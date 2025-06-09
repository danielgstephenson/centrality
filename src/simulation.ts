import { Vec2, World, Settings } from 'planck'
import { Actor } from './actors/actor'
import { Arena } from './actors/arena'
import { Unit } from './actors/unit'
import { Game } from './game'
import { range, runif } from './math'

export class Simulation {
  world = new World()
  actors = new Map<string, Actor>()
  arena = new Arena(this)
  units: Unit[] = []
  token = String(Math.random())
  step = 0
  time: number
  game: Game
  timeScale: number

  constructor (game: Game) {
    this.game = game
    this.timeScale = this.game.server.config.timeScale
    Settings.velocityThreshold = 0
    this.makeUnits()
    const velocities = range(4).map(_ => {
      const x = runif(-1, 1)
      const y = runif(-1, 1)
      return new Vec2(x, y)
    })
    this.units.forEach((unit, i) => {
      unit.body.setLinearVelocity(velocities[i])
    })
    this.time = performance.now() / 1000
    setInterval(() => this.tick(), 30)
  }

  makeUnits (): void {
    const a = 0.1 * Arena.size
    const b = 0.9 * Arena.size
    const v00 = new Vec2(a, a)
    const v01 = new Vec2(b, b)
    const v10 = new Vec2(a, b)
    const v11 = new Vec2(b, a)
    this.units.push(new Unit(this, v00, 0, 0))
    this.units.push(new Unit(this, v01, 1, 0))
    this.units.push(new Unit(this, v10, 1, 1))
    this.units.push(new Unit(this, v11, 0, 1))
  }

  tick (): void {
    const oldTime = this.time
    this.time = performance.now() / 1000
    const dt = this.timeScale * (this.time - oldTime)
    this.actors.forEach(actor => actor.preStep(dt))
    this.world.step(dt)
    this.actors.forEach(actor => actor.postStep(dt))
    this.step += 1
  }
}
