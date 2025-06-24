import { Arena } from '../actors/arena'
import { Unit } from '../actors/unit'
import { Roster } from '../roster'
import { Summary } from '../messages/summary'
import { Simulation } from '../simulation'
import { dirFromTo, range, rotate } from '../math'
import { Vec2 } from 'planck'
import { Pillar } from '../actors/pillar'

export class Renderer {
  summary = new Summary()
  canvasSize = 600
  hues = [200, 100]
  roster = new Roster()
  circleDiv1 = document.getElementById('circleDiv1') as HTMLDivElement
  circleDiv2 = document.getElementById('circleDiv2') as HTMLDivElement
  trailCanvas = document.getElementById('trailCanvas') as HTMLCanvasElement
  arenaCanvas = document.getElementById('arenaCanvas') as HTMLCanvasElement
  unitCanvas = document.getElementById('unitCanvas') as HTMLCanvasElement
  hudCanvas = document.getElementById('hudCanvas') as HTMLCanvasElement
  trailContext = this.trailCanvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
  unitContext = this.unitCanvas.getContext('2d') as CanvasRenderingContext2D
  arenaContext = this.arenaCanvas.getContext('2d') as CanvasRenderingContext2D
  hudContext = this.hudCanvas.getContext('2d') as CanvasRenderingContext2D
  canvasArray: HTMLCanvasElement[]
  contextArray: CanvasRenderingContext2D[]

  constructor () {
    this.contextArray = [
      this.hudContext,
      this.trailContext,
      this.unitContext,
      this.arenaContext
    ]
    this.canvasArray = [
      this.hudCanvas,
      this.trailCanvas,
      this.unitCanvas,
      this.arenaCanvas
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
    this.drawArena()
    this.drawPillars()
    this.drawHud()
  }

  drawArena (): void {
    this.arenaContext.clearRect(0, 0, Arena.size, Arena.size)
    this.arenaContext.globalAlpha = 0.15
    this.arenaContext.strokeStyle = 'hsl(0, 0%, 100%)'
    this.arenaContext.lineWidth = 0.05
    const size = Arena.size
    const mid = 0.5 * size
    const radius = Simulation.centerRadius
    this.arenaContext.beginPath()
    this.arenaContext.moveTo(mid, 0)
    this.arenaContext.lineTo(mid, mid - radius)
    this.arenaContext.moveTo(mid, mid + radius)
    this.arenaContext.lineTo(mid, size)
    this.arenaContext.moveTo(0, mid)
    this.arenaContext.lineTo(mid - radius, mid)
    this.arenaContext.moveTo(mid + radius, mid)
    this.arenaContext.lineTo(size, mid)
    this.arenaContext.stroke()
    this.arenaContext.save()
    this.arenaContext.lineWidth = 0.1
    this.arenaContext.beginPath()
    this.arenaContext.arc(mid, mid, radius, 0, 2 * Math.PI)
    this.arenaContext.clip()
    this.arenaContext.stroke()
    this.arenaContext.restore()
  }

  drawPillars (): void {
    this.arenaContext.globalAlpha = 0.15
    this.arenaContext.fillStyle = 'hsl(0, 0%, 100%)'
    this.roster.spawnPoints.forEach(spawnPoint => {
      const center = new Vec2(0.5 * Arena.size, 0.5 * Arena.size)
      const toCenter = dirFromTo(spawnPoint, center)
      const position = Vec2.combine(1, spawnPoint, 5 * Unit.radius, toCenter)
      this.arenaContext.beginPath()
      this.arenaContext.arc(position.x, position.y, Pillar.radius, 0, 2 * Math.PI)
      this.arenaContext.closePath()
      this.arenaContext.fill()
    })
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
    this.summary.positions.forEach((position, i) => {
      const team = this.roster.teams[i]
      const role = this.roster.roles[i]
      const hue = this.hues[team]
      const color = `hsl(${hue}, 100%, 50%)`
      this.unitContext.fillStyle = color
      this.unitContext.globalAlpha = 0.4
      this.unitContext.beginPath()
      this.unitContext.arc(position.x, position.y, Unit.radius, 0, 2 * Math.PI)
      this.unitContext.fill()
      if (role === 1) return
      this.unitContext.globalAlpha = 1
      this.unitContext.fillStyle = 'black'
      this.unitContext.beginPath()
      this.unitContext.arc(position.x, position.y, 0.5 * Unit.radius, 0, 2 * Math.PI)
      this.unitContext.fill()
    })
  }

  clearTrails (): void {
    console.log('clearTrails')
    this.trailContext.fillStyle = 'black'
    this.trailContext.globalAlpha = 1
    this.trailContext.fillRect(0, 0, Arena.size, Arena.size)
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
      if (x === 0 && y === 0) return
      this.trailContext.arc(x, y, Unit.radius, 0, 2 * Math.PI)
      this.trailContext.fill()
    })
  }

  drawHud (): void {
    this.hudContext.clearRect(0, 0, Arena.size, Arena.size)
    this.drawStations()
    this.drawScores()
    this.drawTargets()
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

  drawScores (): void {
    this.hudContext.globalAlpha = 0.5
    const radius = 2.5 * Simulation.centerRadius
    const maxScore = Math.max(...this.summary.scores)
    this.summary.scores.forEach((score, i) => {
      const hue = this.hues[i]
      this.hudContext.strokeStyle = `hsl(${hue}, 100%, 50%)`
      this.hudContext.lineWidth = 0.05
      if (this.summary.state === 'victory' && score === maxScore) {
        const scale = 1 - this.summary.countdown / Simulation.victoryTime
        const thick = 2 * (radius - Simulation.centerRadius)
        this.hudContext.lineWidth = scale * thick + (1 - scale) * 0.05
      }
      const root = 1.5 * Math.PI
      const mid = 0.5 * Arena.size
      const scoreSign = i === 0 ? 1 : -1
      const scoreFraction = score / Simulation.scoreTime
      const angle = root + scoreSign * Math.PI * scoreFraction
      const a = Math.min(root, angle)
      const b = Math.max(root, angle)
      this.hudContext.beginPath()
      this.hudContext.arc(mid, mid, radius, a, b)
      this.hudContext.stroke()
    })
  }

  drawTargets (): void {
    this.hudContext.globalAlpha = 1
    this.hudContext.lineWidth = 0.05
    const radius = 0.5 * Unit.radius
    range(2).forEach(team => {
      const active = this.summary.actives[team]
      if (!active) return
      const hue = this.hues[team]
      const color = `hsl(${hue}, 100%, 25%)`
      this.hudContext.strokeStyle = color
      this.hudContext.beginPath()
      const x = this.summary.targets[team].x
      const y = this.summary.targets[team].y
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
