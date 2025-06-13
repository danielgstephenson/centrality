import { Vec2 } from 'planck'

export class Team {
  active = false
  ready = false
  graviton = new Vec2(0, 0)
  oldGraviton = new Vec2(0, 0)
  index: number

  constructor (index: number) {
    this.index = index
  }
}
