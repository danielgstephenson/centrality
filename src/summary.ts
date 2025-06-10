import { Vec2 } from 'planck'
import { range } from './math'
import { Unit } from './actors/unit'

export class Summary {
  gameToken = ''
  simToken = ''
  time = 0
  team = 0
  border: Vec2[] = []
  histories: Vec2[][] = []

  constructor () {
    this.histories = range(4).map(_ => {
      return range(Unit.recall).map(_ => {
        return new Vec2(0, 0)
      })
    })
  }
}
