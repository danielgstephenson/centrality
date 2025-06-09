import { Arena } from '../actors/arena'
import { Unit } from '../actors/unit'
import { range } from '../math'
import { Client } from './client'

export class Renderer {
  canvas = document.getElementById('canvas') as HTMLCanvasElement
  context = this.canvas.getContext('2d') as CanvasRenderingContext2D
  client: Client

  colors = [
    'hsl(120, 100%, 30%)',
    'hsl(240, 100%, 50%)'
  ]

  constructor (client: Client) {
    this.client = client
  }

  draw (): void {
    // window.requestAnimationFrame(() => this.draw())
    this.setupCanvas()
    this.drawTrails()
    this.drawUnits()
  }

  drawTrails (): void {
    const lengths = this.client.units.map(unit => unit.history.length)
    const minLength = Math.min(...lengths)
    const maxTime = this.client.summary.time
    range(minLength).forEach(i => {
      this.client.units.forEach(unit => {
        const entry = unit.history[i]
        this.resetContext()
        const age = (maxTime - entry.time) / Unit.recall
        this.context.globalAlpha = 0.1
        this.context.fillStyle = this.colors[unit.team]
        this.context.beginPath()
        const x = entry.position.x
        const y = entry.position.y
        this.context.arc(x, y, Unit.radius * (1 - age), 0, 2 * Math.PI)
        this.context.fill()
      })
    })
  }

  drawUnits (): void {
    this.client.units.forEach(unit => {
      this.resetContext()
      this.context.globalAlpha = 1
      this.context.fillStyle = this.colors[unit.team]
      this.context.beginPath()
      const x = unit.position.x
      const y = unit.position.y
      this.context.arc(x, y, Unit.radius, 0, 2 * Math.PI)
      this.context.fill()
      if (unit.role === 1) return
      this.context.fillStyle = 'black'
      this.context.beginPath()
      this.context.arc(x, y, 0.7 * Unit.radius, 0, 2 * Math.PI)
      this.context.fill()
    })
  }

  setupCanvas (): void {
    const min = Math.min(window.innerWidth, window.innerHeight)
    this.canvas.width = min
    this.canvas.height = min
  }

  resetContext (): void {
    this.context.resetTransform()
    const size = Math.min(this.canvas.width, this.canvas.height)
    this.context.translate(0, size)
    this.context.scale(size / Arena.size, -size / Arena.size)
    this.context.globalAlpha = 1
  }
}
