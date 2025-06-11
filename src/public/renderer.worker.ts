import { Arena } from '../actors/arena'
import { Unit } from '../actors/unit'
import { Roster } from '../roster'
import { Summary } from '../summary'
import { RenderData } from './renderData'

const hues = [120, 220]
const lights = [30, 50]
const steps = Math.floor(Unit.recall / Unit.trailStep)
const roster = new Roster()
const canvasSize = 400

let summary = new Summary()

onmessage = (event: MessageEvent<RenderData>) => {
  if (event.data.summary != null) {
    summary = event.data.summary
  }
  if (event.data.canvas == null) return
  const canvas = event.data.canvas
  canvas.width = canvasSize
  canvas.height = canvasSize
  const context = canvas.getContext('2d')
  function draw (): void {
    requestAnimationFrame(draw)
    if (context === null) {
      throw new Error('worker canvas context is null')
    }
    resetContext(context)
    context.clearRect(0, 0, Arena.size, Arena.size)
    summary.histories.forEach((history, i) => {
      history.forEach((position, t) => {
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
  requestAnimationFrame(draw)
}

function resetContext (context: OffscreenCanvasRenderingContext2D): void {
  context.resetTransform()
  context.translate(0, canvasSize)
  context.scale(canvasSize / Arena.size, -canvasSize / Arena.size)
  context.globalAlpha = 1
}
