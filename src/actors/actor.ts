import { BodyDef, Body } from 'planck'
import { Simulation } from '../simulation'

export class Actor {
  static count = 0
  simulation: Simulation
  body: Body
  id: string
  label = 'actor'
  removed = false

  constructor (simulation: Simulation, bodyDef: BodyDef) {
    Actor.count += 1
    this.id = String(Actor.count)
    this.simulation = simulation
    this.body = this.simulation.world.createBody(bodyDef)
    this.body.setUserData(this)
    this.simulation.actors.set(this.id, this)
  }

  preStep (dt: number): void {}

  postStep (dt: number): void {}
}
