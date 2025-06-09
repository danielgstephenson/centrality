import { Circle, Fixture, Vec2 } from 'planck'
import { Simulation } from '../simulation'
import { Actor } from './actor'
import { Entry } from '../entry'
import { UnitSummary } from '../summaries/unitSummary'

export class Unit extends Actor {
  static radius = 0.5
  static recall = 5
  history: Entry[] = []
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
    this.body.setPosition(this.spawnPoint)
    this.fixture = this.body.createFixture({
      shape: new Circle(new Vec2(0, 0), Unit.radius),
      friction: 0,
      restitution: 0.7
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
    const newEntry = new Entry(this)
    this.history.push(newEntry)
    this.history = this.history.filter(entry => entry.time > this.simulation.time - Unit.recall)
  }

  summarize (oldTime: number): UnitSummary {
    const summary = new UnitSummary()
    summary.spawnPoint = this.spawnPoint
    summary.team = this.team
    summary.role = this.role
    summary.history = this.history.filter(entry => entry.time > oldTime)
    summary.position = this.body.getPosition().clone()
    return summary
  }
}
