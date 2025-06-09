import { Vec2 } from 'planck'
import { Entry } from '../entry'
import { Unit } from '../actors/unit'

export class UnitSummary {
  spawnPoint = new Vec2(0, 0)
  position = new Vec2(0, 0)
  team = 0
  role = 0
  history: Entry[] = []

  update (unitSummary: UnitSummary, time: number): void {
    this.spawnPoint = unitSummary.spawnPoint
    this.team = unitSummary.team
    this.role = unitSummary.role
    this.position = unitSummary.position
    this.history.push(...unitSummary.history)
    this.history = this.history.filter(entry => entry.time > time - Unit.recall)
  }
}
