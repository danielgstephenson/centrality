import { Chain, Fixture, Vec2 } from 'planck'
import { Simulation } from '../simulation'
import { Actor } from './actor'

export class Arena extends Actor {
  static size = 20
  vertices: Vec2[]
  fixture: Fixture

  constructor (simulation: Simulation) {
    super(simulation, {
      type: 'static'
    })
    this.vertices = [
      new Vec2(0, 0),
      new Vec2(0, Arena.size),
      new Vec2(Arena.size, Arena.size),
      new Vec2(Arena.size, 0)
    ]
    this.fixture = this.body.createFixture({
      shape: new Chain(this.vertices, true),
      friction: 0,
      restitution: 0.1
    })
    this.fixture.setUserData(this)
  }
}
