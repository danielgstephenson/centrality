import { Chain, Fixture, Vec2 } from 'planck'
import { Actor } from './actor.js'
import { Simulation } from '../simulation.js'
import { Unit } from './unit.js'
import { Arena } from './arena.js'
import { dirFromTo } from '../math.js'

export class Station extends Actor {
  static size = 2
  vertices: Vec2[]
  fixture: Fixture
  team: number

  constructor (simulation: Simulation, team: number, spawnPoint: Vec2) {
    super(simulation, {
      type: 'static'
    })
    this.team = team
    this.label = 'station'
    const center = new Vec2(0.5 * Arena.size, 0.5 * Arena.size)
    const toCenter = dirFromTo(spawnPoint, center)
    const innerCorner = Vec2.combine(1, spawnPoint, 3 * Unit.radius, toCenter)
    const outerCorner = Vec2.combine(1, spawnPoint, -3 * Unit.radius, toCenter)
    this.vertices = [
      new Vec2(outerCorner.x, outerCorner.y),
      new Vec2(innerCorner.x, outerCorner.y),
      new Vec2(innerCorner.x, innerCorner.y),
      new Vec2(outerCorner.x, innerCorner.y)
    ]
    this.fixture = this.body.createFixture({
      shape: new Chain(this.vertices, true),
      friction: 0,
      restitution: 1
    })
    this.fixture.setUserData(this)
  }
}
