import { Arena } from '../actors/arena'
import { Unit } from '../actors/unit'
import { Roster } from '../roster'
import { RenderData } from './renderData'

const canvasSize = 400
const hues = [120, 220]
const lights = [30, 50]
const steps = Math.floor(Unit.recall / Unit.trailStep)
const roster = new Roster()

let canvas: OffscreenCanvas | null = null
let context: OffscreenCanvasRenderingContext2D | null = null

onmessage = (event: MessageEvent<RenderData>) => {
  if (event.data.canvas != null) {
    canvas = event.data.canvas
    canvas.width = canvasSize
    canvas.height = canvasSize
    context = canvas.getContext('2d')
  }
  if (context == null) return
  if (event.data.summary == null) return
  const summary = event.data.summary
  resetContext(context)
  context.clearRect(0, 0, Arena.size, Arena.size)
  summary.histories.forEach((history, i) => {
    history.forEach((position, t) => {
      if (context == null) return
      const team = roster.teams[i]
      const role = roster.roles[i]
      const hue = hues[team]
      const lightness = lights[team]
      const color = `hsl(${hue}, 100%, ${lightness}%)`
      context.globalAlpha = t + 1 === steps ? 1 : 0.1 * (t + 1) / steps
      context.fillStyle = color
      context.beginPath()
      const x = position.x
      const y = position.y
      context.arc(x, y, Unit.radius, 0, 2 * Math.PI)
      context.fill()
      if (role === 1 || t < steps - 1) return
      context.fillStyle = 'black'
      context.beginPath()
      context.arc(x, y, 0.6 * Unit.radius, 0, 2 * Math.PI)
      context.fill()
    })
  })
}

function resetContext (context: OffscreenCanvasRenderingContext2D): void {
  context.resetTransform()
  context.translate(0, canvasSize)
  context.scale(canvasSize / Arena.size, -canvasSize / Arena.size)
  context.globalAlpha = 1
}
