import { Vec2 } from 'planck'
import { Unit } from './actors/unit'

export class Entry {
  position: Vec2
  time: number

  constructor (unit: Unit) {
    this.position = unit.body.getPosition().clone()
    this.time = unit.simulation.time
  }
}
