import { Circle, Fixture, Vec2 } from 'planck'
import { Simulation } from '../simulation.js'
import { Actor } from './actor.js'
import { range } from '../math.js'

export class Unit extends Actor {
  static radius = 0.5
  static recall = 25
  static trailStep = 5
  history: Vec2[] = []
  fixture: Fixture
  team: number
  role: number
  spawnPoint: Vec2

  constructor (simulation: Simulation, position: Vec2, team: number, role: number) {
    super(simulation, {
      type: 'dynamic',
      bullet: true,
      linearDamping: 0,
      fixedRotation: true
    })
    this.team = team
    this.role = role
    this.spawnPoint = position.clone()
    this.history = range(Unit.recall).map(_ => this.spawnPoint.clone())
    this.body.setPosition(this.spawnPoint)
    this.fixture = this.body.createFixture({
      shape: new Circle(new Vec2(0, 0), Unit.radius),
      friction: 0,
      restitution: 1
    })
    this.fixture.setUserData(this)
    this.body.setMassData({
      mass: 1,
      center: new Vec2(0, 0),
      I: 1
    })
  }

  postStep (dt: number): void {
    super.postStep(dt)
    const position = this.body.getPosition().clone()
    this.history[0] = position
    this.history.unshift(position)
    this.history = this.history.slice(0, Unit.recall)
  }
}
