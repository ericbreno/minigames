import { LinkedList } from '../LinkedList'

export const PARAMS = {
  MAX_WIDTH: 700,
  MAX_HEIGHT: 800,
  MAX_W_SMALL: 400,
  MAX_H_SMALL: 500,
  BLOCK_SIZE: 20,
  MARGIN: 2,
  BWM: 22, // block with margin
  BG: '#7d7d7d',
  OUTLINE_COLOR: '#000000cd',
  SNAKE_COLOR: '#00ff00',
  FOOD_COLOR: '#970e0e',
  MPS: 7, // moves per second
  MPS_FAST: 11,
}

type SnakeBlock = [number, number]
export type SnakeConfigType = {
  infiniteBoard: boolean
  fast: boolean
  smallBoard: boolean
}

export default class SnakeCore {
  private snakeBlocks: LinkedList<SnakeBlock> = new LinkedList()

  private food: SnakeBlock = [-1, -1]
  private grid: boolean[][] = []
  private max = 0

  get score() {
    return this.snakeBlocks.length - 2
  }

  constructor (
    private ctx: CanvasRenderingContext2D,
    private rows: number,
    private cols: number,
    private config: SnakeConfigType
  ) {
    this.grid = Array(rows).fill(0).map(() => Array(cols).fill(false))
    this.max = rows * cols

    const middleX = Math.floor(cols / 2)
    const middleY = Math.floor(rows / 2)

    this.snakeBlocks.push([middleX, middleY])
    this.snakeBlocks.push([middleX - 1, middleY])
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
    const [nextX, nextY] = this.calcNextCoords(xDir, yDir)
    
    const newHead = [nextX, nextY] as SnakeBlock
    this.snakeBlocks.push(newHead)
    this.grid[nextY][nextX] = true
    
    this.ctx.fillStyle = PARAMS.SNAKE_COLOR
    this.drawBlock(newHead)
  }

  private calcNextCoords(
    xDir: number,
    yDir: number
  ) {
    const head = this.snakeBlocks.peek()
    const [x, y] = head

    if (this.config.infiniteBoard) {
      const [nextX, nextY] = [x + xDir, y + yDir]
      return [
        nextX < 0 ? this.cols - 1 : nextX >= this.cols ? 0 : nextX,
        nextY < 0 ? this.rows - 1 : nextY >= this.rows ? 0 : nextY
      ]
    } 
    
    const [nextX, nextY] = [x + xDir, y + yDir]
    return [nextX, nextY]
  }

  private removeTail() {
    if (this.ateFood()) return

    const tail = this.snakeBlocks.shift()
    this.grid[tail[1]][tail[0]] = false
    this.ctx.fillStyle = PARAMS.BG
    this.drawBlock(tail)
  }

  private ateFood() {
    const head = this.snakeBlocks.peek()
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
    const remainingBlocks = this.max - this.snakeBlocks.length
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
    const [nextX, nextY] = this.calcNextCoords(xDir, yDir)

    const _hitWall = 
      nextX < 0 || nextX >= this.cols ||
      nextY < 0 || nextY >= this.rows
    const hitWall = this.config.infiniteBoard ? false : _hitWall

    const hitBlock = !hitWall && this.grid[nextY][nextX]
    const notFood = hitBlock && this.food[0] !== nextX && this.food[1] !== nextY

    return hitWall || (hitBlock && notFood)
  }
}
