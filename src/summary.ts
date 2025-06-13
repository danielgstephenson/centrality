import { Vec2 } from 'planck'

export class Summary {
  gameToken = ''
  simToken = ''
  team = 0
  countdown = 1
  state = 'action'
  actives = [false, false]
  positions = [Vec2.zero(), Vec2.zero(), Vec2.zero(), Vec2.zero()]
  gravitons = [Vec2.zero(), Vec2.zero()]
  score: number = 0
}
