import { Vec2 } from 'planck'
import { Arena } from './actors/arena.js'
import { Unit } from './actors/unit.js'

export class Roster {
  teams = [0, 0, 1, 1]
  roles = [1, 0, 1, 0]
  spawnPoints: Vec2[]

  constructor () {
    const a = 2 * Unit.radius
    const b = Arena.size - 2 * Unit.radius
    this.spawnPoints = [
      new Vec2(b, b),
      new Vec2(a, a),
      new Vec2(a, b),
      new Vec2(b, a)
    ]
  }
}
