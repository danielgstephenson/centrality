import { Vec2 } from 'planck'
import { range } from './math.js'

export class Summary {
  gameToken = ''
  simToken = ''
  time = 0
  team = 0
  border: Vec2[] = []
  positions: Vec2[] = []

  constructor () {
    this.positions = range(4).map(_ => {
      return new Vec2(0, 0)
    })
  }
}
