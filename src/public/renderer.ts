import { Arena } from '../actors/arena'
import { Unit } from '../actors/unit'
import { range } from '../math'
import { Roster } from '../roster'
import { Client } from './client'

export class Renderer {
  canvas = document.getElementById('canvas') as HTMLCanvasElement
  context = this.canvas.getContext('2d') as CanvasRenderingContext2D
  roster = new Roster()
  client: Client

  hues = [120, 240]
  lights = [30, 50]

  unitColors = [
    'hsl(120, 100%, 30%)',
    'hsl(240, 100%, 50%)'
  ]

  constructor (client: Client) {
    this.client = client
  }

  draw (): void {
    window.requestAnimationFrame(() => this.draw())
    this.setupCanvas()
    this.drawTrails()
    this.drawUnits()
  }

  drawTrails (): void {
    const histories = this.client.summary.histories
    const lengths = histories.map(history => history.length)
    if (lengths.length < 4) return
    const minLength = Math.min(...lengths)
    range(minLength).reverse().forEach(t => {
      range(4).forEach(i => {
        const team = this.roster.teams[i]
        const position = histories[i][t]
        this.resetContext()
        const age = t / minLength
        this.context.globalAlpha = 1 // (1 - age)
        const scale = 1 - 0.7 * age
        const lightness = (this.lights[team] - 15) * (1 - age)
        const color = `hsl(${this.hues[team]}, 100%, ${lightness}%)`
        this.context.fillStyle = color
        this.context.beginPath()
        const x = position.x
        const y = position.y
        this.context.arc(x, y, Unit.radius * scale, 0, 2 * Math.PI)
        this.context.fill()
      })
    })
  }

  drawUnits (): void {
    range(4).forEach(i => {
      if (this.client.summary.histories[i] == null) return
      if (this.client.summary.histories[i][0] == null) return
      const position = this.client.summary.histories[i][0]
      const team = this.roster.teams[i]
      const role = this.roster.roles[i]
      this.resetContext()
      this.context.globalAlpha = 1
      const color = `hsl(${this.hues[team]}, 100%, ${this.lights[team]}%)`
      this.context.fillStyle = color
      this.context.beginPath()
      const x = position.x
      const y = position.y
      this.context.arc(x, y, Unit.radius, 0, 2 * Math.PI)
      this.context.fill()
      if (role === 1) return
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
