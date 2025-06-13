import { Vec2, World, Settings } from 'planck'
import { Actor } from './actors/actor.js'
import { Arena } from './actors/arena.js'
import { Unit } from './actors/unit.js'
import { Game } from './game.js'
import { choose, range, rotate, runif } from './math.js'
import { Roster } from './roster.js'

export class Simulation {
  static actionCount = 8
  static planCount = 5
  world = new World()
  actors = new Map<string, Actor>()
  arena = new Arena(this)
  roster = new Roster()
  units: Unit[] = []
  token = String(Math.random())
  step = 0
  paused = true
  time: number
  game: Game
  timeScale: number
  state = 'action'
  countdown = Simulation.actionCount
  score = 0

  constructor (game: Game) {
    this.game = game
    this.timeScale = this.game.server.config.timeScale
    Settings.velocityThreshold = 0
    this.makeUnits()
    const mid = 0.5 * Arena.size
    const center = new Vec2(mid, mid)
    const angle = choose([1, -1]) * runif(Math.PI / 4, Math.PI / 2)
    const scale = runif(0.01, 0.1)
    const velocities = this.roster.spawnPoints.map(spawnPoint => {
      const toCenter = Vec2.sub(center, spawnPoint)
      return rotate(Vec2.mul(scale, toCenter), angle)
    })
    this.units.forEach((unit, i) => {
      unit.body.setLinearVelocity(velocities[i])
    })
    this.time = performance.now() / 1000
    setInterval(() => this.tick(), 50 / this.timeScale)
  }

  makeUnits (): void {
    range(4).forEach(i => {
      const spawnPoint = this.roster.spawnPoints[i]
      const team = this.roster.teams[i]
      const role = this.roster.roles[i]
      this.units.push(new Unit(this, spawnPoint, team, role))
    })
  }

  tick (): void {
    const oldTime = this.time
    this.time = performance.now() / 1000
    if (this.paused) return
    const ready0 = this.game.teams[0].ready
    const ready1 = this.game.teams[1].ready
    const ready = ready0 || ready1
    if (this.state === 'plan' && !ready) return
    const dt = (this.time - oldTime)
    this.countdown = Math.max(0, this.countdown - dt)
    this.updateState()
    if (this.state === 'plan') return
    this.actors.forEach(actor => actor.preStep(dt))
    this.world.step(dt)
    this.actors.forEach(actor => actor.postStep(dt))
    this.step += 1
  }

  updateState (): void {
    if (this.countdown > 0) return
    if (this.state === 'action') {
      this.state = 'plan'
      this.countdown = Simulation.planCount
    } else if (this.state === 'plan') {
      this.state = 'action'
      this.countdown = Simulation.actionCount
      this.game.teams.forEach(team => {
        team.oldGraviton = team.graviton
        team.ready = false
      })
    }
  }
}
