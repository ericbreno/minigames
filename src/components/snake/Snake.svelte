<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import { handleKey } from './KeyHandler'
  import type { Direction } from './KeyHandler'
  import SnakeCore, { PARAMS, type SnakeConfigType } from './SnakeCore'
  import SnakeConfig from './SnakeConfigs.svelte'

  let cv: HTMLCanvasElement
  let snake: SnakeCore

  let [width, height, halted, score] = [200, 200, true, 0]
  let [xDir, yDir, nextXDir, nextYDir] = [1, 0, 1, 0] as Direction[]
  let snakeConfig: SnakeConfigType = {
    infiniteBoard: false,
    fast: false,
    smallBoard: false,
  }

  function setup() {
    const { smallBoard } = snakeConfig
    const [pw, ph] = [
      Math.min(window.innerWidth, smallBoard ? PARAMS.MAX_W_SMALL : PARAMS.MAX_WIDTH),
      Math.min(window.innerHeight, smallBoard ? PARAMS.MAX_H_SMALL : PARAMS.MAX_HEIGHT),
    ]
    const cols = Math.floor((pw * .8) / PARAMS.BWM)
    const rows = Math.floor((ph * .8) / PARAMS.BWM)
    
    width = Math.floor(cols * PARAMS.BWM + PARAMS.MARGIN)
    height = Math.floor(rows * PARAMS.BWM + PARAMS.MARGIN)

    const ctx = cv.getContext('2d')
    snake = new SnakeCore(ctx, rows, cols, snakeConfig)
  }

  function resetCanvas() {
    const ctx = cv.getContext('2d')
    ctx.fillStyle = PARAMS.BG
    ctx.fillRect(0, 0, width, height)
  }

  function checkCollision() {
    if (snake.willCollide(nextXDir, nextYDir)) {
      halted = true
      clearInterval(interval)
    }
  }

  let interval = null
  function startLoop() {
    setup()
    resetCanvas()

    interval = setInterval(() => {
      checkCollision()
      if (!halted) {
        xDir = nextXDir
        yDir = nextYDir
        snake.moveAndDraw(xDir, yDir)
        score = snake.score
      }
    }, 1_000 / (snakeConfig.fast ? PARAMS.MPS_FAST : PARAMS.MPS))
  }

  const handleMove = (event) => {
    const next = handleKey(event, xDir, yDir)
    if (next[0] === next[1] && next[0] === -1) return

    if (halted) {
      halted = false
      startLoop()
    }

    nextXDir = next[0]
    nextYDir = next[1]
  }

  onMount(() => setup())
  onDestroy(() => clearInterval(interval))
</script>

<svelte:window on:keydown={handleMove} />

<title>Snake Game</title>

<main>
  <h1>Snake Game!</h1>
  <p class="score">{score} {score != 1 ? 'points' : 'point'}</p>

  <div class="canvas-wrapper">
    <canvas width={width} height={height} bind:this={cv} />
    <div class="canvas-cover"></div> 
  </div>

  {#if halted}
  <div class="info" transition:fade={{ duration: 150 }}>
    <div class="modal" transition:fly={{ y: 200, duration: 250 }}>
      {#if score}
      <p>You lost!</p>
      <span>Press <kbd>arrow keys</kbd> to restart</span>
      {:else} 
      <p>Press <kbd>arrow keys</kbd> to start</p>
      {/if}

      <SnakeConfig value={snakeConfig} />
    </div>
  </div>
  {/if}
</main>

<style>
  main {
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 100%;

    text-align: center;
  }

  .score {
    margin-top: -1rem;
    font-weight: 550;
  }

  canvas {
    position: relative;
    background-color: #7c7c7c;
    box-shadow: 1px 1px 5px 0px black;
  }

  .canvas-wrapper {
    position: relative;
  }

  .canvas-cover {
    position: absolute;
    inset: 1px;
    background-size: 22px 22px;
    background-image: 
      linear-gradient(to right, #656565 1px, transparent 1px),
      linear-gradient(to bottom, #656565 1px, transparent 1px);
  }

  .info {
    position: fixed;
    inset: 0;
    background-color: #0000008d;
    font-size: 1.25rem;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .info .modal {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 1rem 3rem 2rem 3rem;
    margin-bottom: 20vh;
    background-color: whitesmoke;
  }

  kbd {
    font-weight: 550;
    font-family: inherit;
  }
</style>