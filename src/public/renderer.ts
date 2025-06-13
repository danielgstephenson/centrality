import { Arena } from '../actors/arena'
import { Unit } from '../actors/unit'
import { Roster } from '../roster'
import { Summary } from '../summary'

export class Renderer {
  summary = new Summary()
  canvasSize = 600
  hues = [100, 200]
  roster = new Roster()
  arenaCanvas = document.getElementById('arenaCanvas') as HTMLCanvasElement
  trailCanvas = document.getElementById('trailCanvas') as HTMLCanvasElement
  unitCanvas = document.getElementById('unitCanvas') as HTMLCanvasElement
  arenaContext = this.arenaCanvas.getContext('2d') as CanvasRenderingContext2D
  trailContext = this.trailCanvas.getContext('2d') as CanvasRenderingContext2D
  unitContext = this.unitCanvas.getContext('2d') as CanvasRenderingContext2D
  canvasArray: HTMLCanvasElement[]
  contextArray: CanvasRenderingContext2D[]

  constructor () {
    this.contextArray = [
      this.arenaContext,
      this.trailContext,
      this.unitContext
    ]
    this.canvasArray = [
      this.arenaCanvas,
      this.trailCanvas,
      this.unitCanvas
    ]
    this.canvasArray.forEach(canvas => {
      canvas.width = this.canvasSize
      canvas.height = this.canvasSize
    })
  }

  draw (): void {
    this.resetContext()
    this.drawTrails()
    this.drawUnits()
  }

  drawUnits (): void {
    this.unitContext.clearRect(0, 0, Arena.size, Arena.size)
    this.summary.positions.forEach((position, i) => {
      const team = this.roster.teams[i]
      const role = this.roster.roles[i]
      const hue = this.hues[team]
      const color = `hsl(${hue}, 100%, 50%)`
      this.unitContext.globalAlpha = 1
      this.unitContext.fillStyle = color
      this.unitContext.beginPath()
      const x = position.x
      const y = position.y
      this.unitContext.arc(x, y, Unit.radius, 0, 2 * Math.PI)
      this.unitContext.fill()
      if (role === 1) return
      this.unitContext.fillStyle = 'black'
      this.unitContext.beginPath()
      this.unitContext.arc(x, y, 0.6 * Unit.radius, 0, 2 * Math.PI)
      this.unitContext.fill()
    })
  }

  drawTrails (): void {
    this.trailContext.fillStyle = 'black'
    this.trailContext.globalAlpha = 0.01
    this.trailContext.fillRect(0, 0, Arena.size, Arena.size)
    this.replaceDarkColors()
    this.summary.positions.forEach((position, i) => {
      const team = this.roster.teams[i]
      const hue = this.hues[team]
      const color = `hsl(${hue}, 100%, 25%)`
      this.trailContext.globalAlpha = 0.1
      this.trailContext.fillStyle = color
      this.trailContext.beginPath()
      const x = position.x
      const y = position.y
      this.trailContext.arc(x, y, Unit.radius, 0, 2 * Math.PI)
      this.trailContext.fill()
    })
  }

  resetContext (): void {
    this.contextArray.forEach(context => {
      context.resetTransform()
      context.translate(0, this.canvasSize)
      context.scale(this.canvasSize / Arena.size, -this.canvasSize / Arena.size)
      context.globalAlpha = 1
    })
  }

  replaceDarkColors (): void {
    const imageData = this.trailContext.getImageData(0, 0, this.trailCanvas.width, this.trailCanvas.height)
    const data = imageData.data
    const threshold = 0.1
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const luminance = (r + g + b) / 3
      if (luminance < threshold) {
        data[i] = 0
        data[i + 1] = 0
        data[i + 2] = 0
      }
    }
    this.trailContext.putImageData(imageData, 0, 0)
  }
}
