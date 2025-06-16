import { Arena } from '../actors/arena'
import { Unit } from '../actors/unit'
import { Roster } from '../roster'
import { Summary } from '../summary'
import { Simulation } from '../simulation'
import { dirFromTo, range, rotate } from '../math'
import { Vec2 } from 'planck'

export class Renderer {
  summary = new Summary()
  canvasSize = 600
  hues = [200, 100]
  roster = new Roster()
  circleDiv1 = document.getElementById('circleDiv1') as HTMLDivElement
  circleDiv2 = document.getElementById('circleDiv2') as HTMLDivElement
  trailCanvas = document.getElementById('trailCanvas') as HTMLCanvasElement
  unitCanvas = document.getElementById('unitCanvas') as HTMLCanvasElement
  hudCanvas = document.getElementById('hudCanvas') as HTMLCanvasElement
  trailContext = this.trailCanvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
  unitContext = this.unitCanvas.getContext('2d') as CanvasRenderingContext2D
  hudContext = this.hudCanvas.getContext('2d') as CanvasRenderingContext2D
  canvasArray: HTMLCanvasElement[]
  contextArray: CanvasRenderingContext2D[]

  constructor () {
    this.contextArray = [
      this.hudContext,
      this.trailContext,
      this.unitContext
    ]
    this.canvasArray = [
      this.hudCanvas,
      this.trailCanvas,
      this.unitCanvas
    ]
    this.canvasArray.forEach(canvas => {
      canvas.width = this.canvasSize
      canvas.height = this.canvasSize
    })
  }

  draw (): void {
    this.drawTeamCircles()
    this.resetContext()
    const action = this.summary.state === 'action'
    if (action) this.drawTrails()
    this.drawUnits()
    this.drawHud()
  }

  drawTeamCircles (): void {
    const team = this.summary.team
    const hue = this.hues[team]
    const color = `hsla(${hue}, 100%, 50%, 50%)`
    this.circleDiv1.style.borderColor = color
    this.circleDiv2.style.borderColor = color
  }

  drawUnits (): void {
    this.unitContext.clearRect(0, 0, Arena.size, Arena.size)
    this.unitContext.globalAlpha = 1
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

  drawHud (): void {
    this.hudContext.clearRect(0, 0, Arena.size, Arena.size)
    this.drawArena()
    this.drawStations()
    this.drawTimer()
    this.drawGravitons()
  }

  drawArena (): void {
    this.hudContext.globalAlpha = 0.2
    this.hudContext.strokeStyle = 'hsl(0, 0%, 100%)'
    this.hudContext.lineWidth = 0.05
    const size = Arena.size
    const mid = 0.5 * size
    const radius = Unit.centerRadius
    this.hudContext.beginPath()
    this.hudContext.moveTo(mid, 0)
    this.hudContext.lineTo(mid, mid - radius)
    this.hudContext.moveTo(mid, mid + radius)
    this.hudContext.lineTo(mid, size)
    this.hudContext.moveTo(0, mid)
    this.hudContext.lineTo(mid - radius, mid)
    this.hudContext.moveTo(mid + radius, mid)
    this.hudContext.lineTo(size, mid)
    this.hudContext.stroke()
    this.hudContext.save()
    this.hudContext.lineWidth = 0.1
    this.hudContext.beginPath()
    this.hudContext.arc(mid, mid, radius, 0, 2 * Math.PI)
    this.hudContext.clip()
    this.hudContext.stroke()
    this.hudContext.restore()
  }

  drawStations (): void {
    const center = new Vec2(0.5 * Arena.size, 0.5 * Arena.size)
    this.roster.spawnPoints.forEach((spawnPoint, i) => {
      const toCenter = dirFromTo(spawnPoint, center)
      const innerCorner = Vec2.combine(1, spawnPoint, 3 * Unit.radius, toCenter)
      const outerCorner = Vec2.combine(1, spawnPoint, -3 * Unit.radius, toCenter)
      const team = this.roster.teams[i]
      const hue = this.hues[team]
      this.hudContext.strokeStyle = `hsl(${hue}, 100%, 25%)`
      this.hudContext.globalAlpha = 0.5
      this.hudContext.lineWidth = 0.05
      this.hudContext.beginPath()
      this.hudContext.moveTo(innerCorner.x, outerCorner.y)
      this.hudContext.lineTo(innerCorner.x, innerCorner.y)
      this.hudContext.lineTo(outerCorner.x, innerCorner.y)
      this.hudContext.stroke()
    })
  }

  drawTimer (): void {
    this.hudContext.globalAlpha = 0.1
    this.hudContext.strokeStyle = 'hsl(0, 0%, 100%)'
    this.hudContext.lineWidth = 0.1
    const action = this.summary.state === 'action'
    const root = 1.5 * Math.PI
    const maxCount = action ? Simulation.actionCount : Simulation.planCount
    const time = this.summary.countdown / maxCount
    const turn = action ? 1 - time : time
    const a = root - Math.PI * turn
    const b = root + Math.PI * turn
    this.hudContext.beginPath()
    const size = Arena.size
    const mid = 0.5 * size
    const radius = 3 * Unit.centerRadius
    this.hudContext.arc(mid, mid, radius, a, b)
    this.hudContext.stroke()
  }

  drawGravitons (): void {
    this.hudContext.globalAlpha = 1
    this.hudContext.lineWidth = 0.05
    const radius = 1.2 * Unit.radius
    range(2).forEach(team => {
      const active = this.summary.actives[team]
      if (!active) return
      const hue = this.hues[team]
      const color = `hsl(${hue}, 100%, 25%)`
      this.hudContext.strokeStyle = color
      this.hudContext.beginPath()
      const x = this.summary.gravitons[team].x
      const y = this.summary.gravitons[team].y
      this.hudContext.arc(x, y, radius, 0, 2 * Math.PI)
      const diag = rotate(new Vec2(radius, 0), Math.PI / 4)
      this.hudContext.moveTo(x + diag.x, y + diag.y)
      this.hudContext.lineTo(x - diag.x, y - diag.y)
      this.hudContext.moveTo(x - diag.x, y + diag.y)
      this.hudContext.lineTo(x + diag.x, y - diag.y)
      this.hudContext.stroke()
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
