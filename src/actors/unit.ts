import { Circle, Fixture, Vec2 } from 'planck'
import { Simulation } from '../simulation.js'
import { Actor } from './actor.js'
import { dirFromTo } from '../math.js'

export class Unit extends Actor {
  static radius = 0.5
  history: Vec2[] = []
  fixture: Fixture
  team: number
  role: number
  spawnPoint: Vec2
  position: Vec2

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
    this.body.setPosition(this.spawnPoint)
    this.fixture = this.body.createFixture({
      shape: new Circle(new Vec2(0, 0), Unit.radius),
      friction: 0,
      restitution: 0.5
    })
    this.fixture.setUserData(this)
    this.body.setMassData({
      mass: 1,
      center: new Vec2(0, 0),
      I: 1
    })
    this.position = this.body.getPosition().clone()
  }

  preStep (dt: number): void {
    this.position = this.body.getPosition().clone()
    const team = this.simulation.game.teams[this.team]
    if (!team.active) return
    const distance = Vec2.distance(this.position, team.graviton)
    const gap = Math.max(Unit.radius, distance)
    const scale = 1 / (gap * gap)
    const toGraviton = dirFromTo(this.position, team.graviton)
    const force = Vec2.mul(scale, toGraviton)
    this.body.applyForceToCenter(force)
  }

  postStep (dt: number): void {
    super.postStep(dt)
    this.position = this.body.getPosition().clone()
  }
}
