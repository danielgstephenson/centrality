import { Arena } from '../actors/arena'
import { RenderData } from './renderData'

// const roster = new Roster()
// const hues = [120, 220]
// const lights = [30, 50]

const canvasSize = 512

function resetContext (context: OffscreenCanvasRenderingContext2D): void {
  context.resetTransform()
  context.translate(0, canvasSize)
  context.scale(canvasSize / Arena.size, -canvasSize / Arena.size)
  context.globalAlpha = 1
}

onmessage = (event: MessageEvent<RenderData>) => {
  console.log('worker onmessage')
  const canvas = event.data.canvas
  const context = canvas.getContext('2d')
  if (context === null) {
    throw new Error('worker canvas context is null')
  }
  canvas.width = canvasSize
  canvas.height = canvasSize
  console.log('canvas size:', canvas.width, canvas.height)
  resetContext(context)
  context.fillStyle = 'red'
  context.beginPath()
  const x = 0.5 * Arena.size
  const y = 0.5 * Arena.size
  context.arc(x, y, 1, 0, 2 * Math.PI)
  context.fill()
}
