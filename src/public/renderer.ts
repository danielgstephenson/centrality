import { Unit } from '../actors/unit.js'
import { range } from '../math.js'
import { Roster } from '../roster.js'
import { Summary } from '../summary.js'
import { Client } from './client.js'
import { RenderData } from './renderData.js'
import { TrailCircle } from './trailCircle.js'
import { UnitCircle } from './unitCircle.js'

export class Renderer {
  roster = new Roster()
  summary = new Summary()
  interfaceDiv = document.getElementById('interfaceDiv') as HTMLDivElement
  hues = [120, 220]
  lights = [30, 50]
  unitCircles: UnitCircle[] = []
  trails: TrailCircle[][] = [[], [], [], []]
  client: Client
  rect: DOMRect
  steps: number

  constructor (client: Client) {
    this.client = client
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const offscreen = canvas.transferControlToOffscreen()
    const renderData: RenderData = { canvas: offscreen, summary: this.summary }
    const worker = new Worker(new URL('./renderer.worker.ts', import.meta.url), { type: 'module' })
    worker.postMessage(renderData, [offscreen])
    this.onResize()
    this.rect = this.interfaceDiv.getBoundingClientRect()
    this.steps = Math.floor(Unit.recall / Unit.trailStep)
    console.log('steps', this.steps)
    range(this.steps).forEach(t => {
      range(4).forEach(i => {
        const position = this.roster.spawnPoints[i]
        const team = this.roster.teams[i]
        const hue = this.hues[team]
        const lightness = this.lights[team]
        const color = `hsl(${hue},100%, ${lightness}%)`
        const scale = 1
        const opacity = 0.5 * t / this.steps
        const trailCircle = new TrailCircle(this, position, color, scale, opacity)
        this.trails[i].unshift(trailCircle)
      })
    })
    range(4).forEach(i => {
      const position = this.roster.spawnPoints[i]
      const team = this.roster.teams[i]
      const role = this.roster.roles[i]
      const hue = this.hues[team]
      const lightness = this.lights[team]
      const color = `hsl(${hue},100%, ${lightness}%)`
      const unitCircle = new UnitCircle(this, position, color, role)
      this.unitCircles.push(unitCircle)
    })
  }

  draw (): void {
    window.requestAnimationFrame(() => this.draw())
    range(4).forEach(i => {
      const unit = this.unitCircles[i]
      unit.position = this.summary.histories[i][0]
      unit.draw()
    })
    range(this.steps).forEach(t => {
      range(4).forEach(i => {
        const trailCircle = this.trails[i][t]
        trailCircle.position = this.summary.histories[i][t]
        trailCircle.draw()
      })
    })
  }

  onResize (): void {
    this.rect = this.interfaceDiv.getBoundingClientRect()
    this.trails.forEach(trail => {
      trail.forEach(trailCircle => {
        trailCircle.setup()
      })
    })
    this.unitCircles.forEach(unitCircle => {
      unitCircle.setup()
    })
  }

  // resetContext (): void {
  //   this.context.resetTransform()
  //   const size = Math.min(this.canvas.width, this.canvas.height)
  //   this.context.translate(0, size)
  //   this.context.scale(size / Arena.size, -size / Arena.size)
  //   this.context.globalAlpha = 1
  // }
}
