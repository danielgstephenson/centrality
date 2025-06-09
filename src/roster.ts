import { Vec2 } from 'planck'
import { Arena } from './actors/arena'

export class Roster {
  teams = [0, 0, 1, 1]
  roles = [1, 0, 1, 0]
  spawnPoints: Vec2[]

  constructor () {
    const a = 0.1 * Arena.size
    const b = 0.9 * Arena.size
    this.spawnPoints = [
      new Vec2(a, a),
      new Vec2(b, b),
      new Vec2(a, b),
      new Vec2(b, a)
    ]
  }
}
