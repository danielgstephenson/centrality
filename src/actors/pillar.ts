import { Circle, Fixture, Vec2 } from 'planck'
import { Actor } from './actor.js'
import { Simulation } from '../simulation.js'
import { Unit } from './unit.js'
import { Arena } from './arena.js'
import { dirFromTo } from '../math.js'

export class Pillar extends Actor {
  static radius = 0.6
  fixture: Fixture

  constructor (simulation: Simulation, spawnPoint: Vec2) {
    super(simulation, {
      type: 'static'
    })
    this.label = 'station'
    const center = new Vec2(0.5 * Arena.size, 0.5 * Arena.size)
    const toCenter = dirFromTo(spawnPoint, center)
    const position = Vec2.combine(1, spawnPoint, 5 * Unit.radius, toCenter)
    this.fixture = this.body.createFixture({
      shape: new Circle(position, Pillar.radius),
      friction: 0,
      restitution: 1
    })
    this.fixture.setUserData(this)
  }
}
