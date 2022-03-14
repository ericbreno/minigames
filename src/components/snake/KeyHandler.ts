let [nextXDir, nextYDir] = [1, 0, 1, 0]

export type Direction = 1 | -1 | 0

export const handleKey = (event, xDir, yDir) => {
  const { key, code } = event

  if ((key === 'ArrowLeft' || code === 'KeyA') && xDir !== 1) {
    nextXDir = -1
    nextYDir = 0
  } else if ((key === 'ArrowRight' || code === 'KeyD') && xDir !== -1) {
    nextXDir = 1
    nextYDir = 0
  } else if ((key === 'ArrowUp' || code === 'KeyW') && yDir !== 1) {
    nextXDir = 0
    nextYDir = -1
  } else if ((key === 'ArrowDown' || code === 'KeyS') && yDir !== -1) {
    nextXDir = 0
    nextYDir = 1
  } else {
    return [-1, -1] as Direction[]
  }

  return [nextXDir, nextYDir] as Direction[]
}