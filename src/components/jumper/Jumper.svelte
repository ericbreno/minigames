<script lang="ts">
  import { onDestroy, onMount } from 'svelte'

  const height = 400, width = 800, SQR = 20, FPS = 25
  const W_BLOCKS = Math.floor(width / SQR), 
    H_BLOCKS = Math.floor(height / SQR)
  const JMP = 6, MOVE = 1
  const gx = x => Math.floor(x * SQR)
  const gy = y => Math.floor(height - (y * SQR))

  let cv: HTMLCanvasElement

  const player = {
    x: 0, 
    y: 0,
    color: 'rgb(20, 140, 40)',
    size: 2,
    jumpTick: { finished: () => true, tick: () => 0},
    moveTick: { finished: () => true, tick: () => 0},
  }

  const floor = {
    height: 1,
    color: 'rgb(133, 87, 35)',
    dividerColor: 'rgb(80, 87, 35)',
    width,
  }

  const blocks = [
    {
      x: 10,
      y: 1,
      color: 'rgb(233, 155, 235)',
    }
  ]

  function move(initial, offset, time) {
    const ticks = Math.floor(time / (1_000 / FPS))
    const final = initial + offset
    const step = final - initial
    const MAX_SIN = Math.PI / 2 // 0 -> 1
    let it = 0
    let position = initial

    return {
      finished: () => it >= ticks,
      tick: (read = false) => {
        if (it >= ticks || read) return final
        position = initial + Math.sin((it++ / ticks) * MAX_SIN) * step
        return position
      }
    }
  }

  function bounce(initial, offset, time) {
    const ticks = Math.floor(time / (1_000 / FPS))
    const top = initial + offset
    const step = top - initial
    const MAX_SIN = Math.PI / 2 // 0 -> 1
    let it = 0
    let position = initial

    return {
      finished: () => it >= ticks,
      tick: (read = false) => {
        if (it >= ticks) return initial
        if (read) return position
        const pct = Math.sin((it++ / ticks) * MAX_SIN)
        position = initial + (pct > 0.5 ? 1 - pct : pct) * step
        return position
      }
    }
  }

  function drawPlayer() {
    player.y = player.jumpTick.tick()
    player.x = player.moveTick.tick()

    console.log(player.y)

    const ctx = cv.getContext('2d')

    ctx.fillStyle = player.color
    ctx.fillRect(
      gx(player.x),
      gy(player.y + 1),
      SQR,
      -player.size * SQR
    )
  }

  function drawScene() {
    const ctx = cv.getContext('2d')
    ctx.fillStyle = 'rgb(120, 240, 240)'
    ctx.fillRect(0, 0, width, height)
    
    ctx.fillStyle = floor.color
    ctx.strokeStyle = floor.dividerColor

    let block = 0
    while (block < width) {
      ctx.fillRect(gx(block), gy(1), SQR, SQR)
      ctx.strokeRect(gx(block), gy(1), SQR, SQR)

      block += 1
    }

    blocks.forEach(({ x, y, color }) => {
      ctx.fillStyle = color
      ctx.fillRect(gx(x), gy(y + 1), SQR, SQR)
    })
  }

  function setup() {
    drawScene()
    drawPlayer()
  }

  const handleKey = (event) => {
    const { key } = event

    if (key === 'ArrowUp' && player.jumpTick.finished()) {
      player.jumpTick = bounce(player.y, JMP, 500)
    } else if (key === 'ArrowRight' && player.moveTick.finished()) {
      player.moveTick = move(player.x, MOVE, 150)
    } else if (key === 'ArrowLeft' && player.moveTick.finished()) {
      player.moveTick = move(player.x, -MOVE, 150)
    }
  }

  let interval
  onMount(() => {
    setup()
    interval = setInterval(() => {
      drawScene()
      drawPlayer()
    }, 1_000 / FPS)
  })

  onDestroy(() => {
    clearInterval(interval)
  })
</script>

<svelte:window on:keydown={handleKey} />

<section>
  <canvas
    bind:this={cv}
    height={height}
    width={width} />
</section>

<style>
  section {
    width: 100%;
    padding-top: 2rem;
    display: flex;
    justify-content: center;
  }
</style>