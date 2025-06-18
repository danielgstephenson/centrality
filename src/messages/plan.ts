import { Vec2 } from 'planck'

export class Plan {
  target = Vec2.zero()
  button = 0

  constructor (target: Vec2, button: number) {
    this.target = target
    this.button = button
  }
}
