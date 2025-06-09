import { Vec2 } from 'planck'
import { range } from '../math'
import { UnitSummary } from './unitSummary'

export class PlayerSummary {
  gameToken = ''
  simToken = ''
  time = 0
  team = 0
  border: Vec2[] = []
  units: UnitSummary[]

  constructor () {
    this.units = range(4).map(_ => new UnitSummary())
  }
}
