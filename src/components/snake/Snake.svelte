<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { handleKey } from './KeyHandler'
  import type { Direction } from './KeyHandler'
  import SnakeCore, { PARAMS } from './SnakeCore'

  let cv: HTMLCanvasElement
  let width = 200
  let height = 200
  
  let snake: SnakeCore
  let halted = true
  let score = 0

  let xDir: Direction = 1
  let yDir: Direction = 0
  let nextXDir: Direction = 1
  let nextYDir: Direction = 0

  function setup() {
    const [pw, ph] = [
      Math.min(window.innerWidth, PARAMS.MAX_WIDTH),
      Math.min(window.innerHeight, PARAMS.MAX_HEIGHT),
    ]
    const cols = Math.floor((pw * .8) / PARAMS.BWM)
    const rows = Math.floor((ph * .8) / PARAMS.BWM)
    
    width = Math.floor(cols * PARAMS.BWM + PARAMS.MARGIN)
    height = Math.floor(rows * PARAMS.BWM + PARAMS.MARGIN)

    const ctx = cv.getContext('2d')
    snake = new SnakeCore(ctx, rows, cols)
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
    }, 1_000 / PARAMS.MPS)
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

  onMount(() => {
    setup()
  })

  onDestroy(() => {
    clearInterval(interval)
  })
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
  <div class="info">
    {#if score}
    <p>You lost</p>
    <p>Press arrow keys to restart</p>
    {:else} 
    <p>Press arrow keys to start</p>
    {/if}
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
</style>