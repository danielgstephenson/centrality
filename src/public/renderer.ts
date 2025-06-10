import { Unit } from '../actors/unit'
import { range } from '../math'
import { Roster } from '../roster'
import { Summary } from '../summary'
import { Client } from './client'
import { TrailCircle } from './trailCircle'
import { UnitCircle } from './unitCircle'

export class Renderer {
  roster = new Roster()
  summary = new Summary()
  interfaceDiv = document.getElementById('interfaceDiv') as HTMLDivElement
  canvas = document.getElementById('canvas') as HTMLDivElement
  hues = [120, 220]
  lights = [30, 50]
  unitCircles: UnitCircle[] = []
  trails: TrailCircle[][] = [[], [], [], []]
  rect: DOMRect
  client: Client
  steps: number

  constructor (client: Client) {
    this.client = client
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
}
