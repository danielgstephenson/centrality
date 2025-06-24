import { Circle, Fixture, Vec2 } from 'planck'
import { Simulation } from '../simulation.js'
import { Actor } from './actor.js'
import { dirFromTo } from '../math.js'

export class Unit extends Actor {
  static radius = 0.5
  static maxVelocity = 4
  static thrust = 0.1
  dead = false
  fixture: Fixture
  team: number
  role: number
  spawnPoint: Vec2
  position: Vec2
  velocity: Vec2

  constructor (simulation: Simulation, position: Vec2, team: number, role: number) {
    super(simulation, {
      type: 'dynamic',
      bullet: true,
      linearDamping: 0,
      fixedRotation: true
    })
    this.label = 'unit'
    this.team = team
    this.role = role
    this.spawnPoint = position.clone()
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
    this.position = this.body.getPosition().clone()
    this.velocity = this.body.getLinearVelocity().clone()
  }

  die (): void {
    this.dead = true
  }

  respawn (): void {
    this.position = Vec2.zero()
    this.velocity = this.spawnPoint.clone()
    this.body.setLinearVelocity(this.position)
    this.body.setPosition(this.velocity)
    this.dead = false
  }

  preStep (dt: number): void {
    this.position = this.body.getPosition().clone()
    const team = this.simulation.game.teams[this.team]
    if (!team.active) return
    const allies = this.simulation.units.filter(unit => unit.team === this.team)
    const distances = allies.map(ally => Vec2.distance(ally.position, team.target))
    const distance = Vec2.distance(this.position, team.target)
    if (distance > Math.min(...distances)) return
    const toTarget = dirFromTo(this.position, team.target)
    const force = Vec2.mul(Unit.thrust, toTarget)
    this.body.applyForceToCenter(force)
  }

  postStep (dt: number): void {
    super.postStep(dt)
    if (this.dead) this.respawn()
    this.position = this.body.getPosition().clone()
    this.velocity = Vec2.clamp(this.body.getLinearVelocity().clone(), Unit.maxVelocity)
    this.body.setLinearVelocity(this.velocity)
  }
}
