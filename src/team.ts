import { Vec2 } from 'planck'

export class Team {
  active = false
  oldActive = false
  ready = false
  target = new Vec2(0, 0)
  oldTarget = new Vec2(0, 0)
  index: number

  constructor (index: number) {
    this.index = index
  }
}
