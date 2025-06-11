import { Vec2 } from 'planck'
import { range } from './math.js'
import { Unit } from './actors/unit.js'

export class Summary {
  gameToken = ''
  simToken = ''
  time = 0
  team = 0
  border: Vec2[] = []
  histories: Vec2[][] = []

  constructor () {
    const steps = Math.floor(Unit.recall / Unit.trailStep)
    this.histories = range(4).map(_ => {
      return range(steps).map(_ => {
        return new Vec2(0, 0)
      })
    })
  }
}
