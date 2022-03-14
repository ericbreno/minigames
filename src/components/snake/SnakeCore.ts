export const PARAMS = {
  MAX_WIDTH: 700,
  MAX_HEIGHT: 800,
  BLOCK_SIZE: 20,
  MARGIN: 2,
  BWM: 22, // block with margin
  BG: '#7d7d7d',
  OUTLINE_COLOR: '#000000cd',
  SNAKE_COLOR: '#00ff00',
  FOOD_COLOR: '#970e0e',
  MPS: 7, // moves per second
}

type SnakeBlock = [number, number]

export default class SnakeCore {
  private blocks: SnakeBlock[] = []

  private food: SnakeBlock = [-1, -1]
  private grid: boolean[][] = []
  private max = 0

  get score() {
    return this.blocks.length - 2
  }

  constructor (
    private ctx: CanvasRenderingContext2D,
    private rows: number,
    private cols: number
  ) {
    this.grid = Array(rows).fill(0).map(() => Array(cols).fill(false))
    this.max = rows * cols

    const middleX = Math.floor(cols / 2)
    const middleY = Math.floor(rows / 2)

    this.blocks.push([middleX, middleY], [middleX - 1, middleY])
  }

  moveAndDraw(
    xDir: number,
    yDir: number
  ) {
    this.advanceHead(xDir, yDir)
    this.removeTail()
    this.addFood()
  }

  private advanceHead(
    xDir: number,
    yDir: number
  ) {
    const head = this.blocks[this.blocks.length - 1]
    const [x, y] = head
    const [nextX, nextY] = [x + xDir, y + yDir]
    
    const newHead = [nextX, nextY] as SnakeBlock
    this.blocks.push(newHead)
    this.grid[nextY][nextX] = true
    
    this.ctx.fillStyle = PARAMS.SNAKE_COLOR
    this.drawBlock(newHead)
  }

  private removeTail() {
    if (this.ateFood()) return

    const tail = this.blocks.shift()
    this.grid[tail[1]][tail[0]] = false
    this.ctx.fillStyle = PARAMS.BG
    this.drawBlock(tail)
  }

  private ateFood() {
    const head = this.blocks[this.blocks.length - 1]
    const [x, y] = head

    if (this.food[0] === x && this.food[1] === y) {
      this.food = [-1, -1]
      return true
    }

    return false
  }

  private addFood() {
    if (this.food[0] !== -1) return

    const [x, y] = this.getRandomCoords()

    this.food = [x, y]
    this.grid[y][x] = true

    this.ctx.fillStyle = PARAMS.FOOD_COLOR
    this.drawBlock(this.food)
  }

  private getRandomCoords() {
    const remainingBlocks = this.max - this.blocks.length
    const threshold = 10
    if (remainingBlocks < threshold) {
      for (let i = 0; i < this.grid.length; i++) {
        for (let j = 0; j < this.grid[i].length; j++) {
          if (!this.grid[i][j]) {
            return [j, i]
          }
        }
      }
    }

    const x = Math.floor(Math.random() * this.cols)
    const y = Math.floor(Math.random() * this.rows)

    if (!this.grid[y][x]) {
      return [x, y]
    }

    return this.getRandomCoords()
  }

  private drawBlock([x, y]: SnakeBlock) {
    const startX = PARAMS.MARGIN + x * (PARAMS.MARGIN + PARAMS.BLOCK_SIZE) 
    const startY = PARAMS.MARGIN + y * (PARAMS.MARGIN + PARAMS.BLOCK_SIZE)

    this.ctx.fillRect(
      startX,
      startY, 
      PARAMS.BLOCK_SIZE, 
      PARAMS.BLOCK_SIZE
    )
  }

  willCollide(xDir: number, yDir: number) {
    const head = this.blocks[this.blocks.length - 1]
    const [x, y] = head
    const [nextX, nextY] = [x + xDir, y + yDir]

    const hitWall = 
      nextX < 0 || nextX >= this.cols ||
      nextY < 0 || nextY >= this.rows

    const hitBlock = !hitWall && this.grid[nextY][nextX]
    const notFood = hitBlock && this.food[0] !== nextX && this.food[1] !== nextY

    return hitWall || (hitBlock && notFood)
  }
}
