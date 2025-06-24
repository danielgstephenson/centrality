import { Vec2, World, Settings } from 'planck'
import { Actor } from './actors/actor.js'
import { Arena } from './actors/arena.js'
import { Unit } from './actors/unit.js'
import { Game } from './game.js'
import { choose, range, rotate, runif } from './math.js'
import { Roster } from './roster.js'
import { Collider } from './collider.js'
import { Station } from './actors/station.js'
import { Pillar } from './actors/pillar.js'

export class Simulation {
  static actionTime = 3
  static planTime = 3
  static scoreTime = 60
  static victoryTime = 5
  static centerRadius = 1
  static blockSize = 1
  world = new World()
  collider = new Collider(this.world)
  actors = new Map<string, Actor>()
  arena = new Arena(this)
  roster = new Roster()
  units: Unit[] = []
  stations: Station[] = []
  pillars: Pillar[] = []
  token = String(Math.random())
  scores = [0, 0]
  step = 0
  paused = true
  time: number
  game: Game
  timeScale: number
  state = 'action'
  countdown = Simulation.victoryTime

  constructor (game: Game) {
    this.game = game
    this.timeScale = this.game.server.config.timeScale
    Settings.velocityThreshold = 0
    this.makeUnits()
    const mid = 0.5 * Arena.size
    const center = new Vec2(mid, mid)
    const angle = choose([1, -1]) * runif(Math.PI / 4, Math.PI / 2)
    const scale = 0 // runif(0.1, 0.2)
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
      this.stations.push(new Station(this, team, spawnPoint))
      this.pillars.push(new Pillar(this, spawnPoint))
    })
  }

  tick (): void {
    const oldTime = this.time
    this.time = performance.now() / 1000
    if (this.paused) return
    const dt = (this.time - oldTime)
    if (this.state === 'victory') {
      if (this.countdown === 0) this.restart()
      this.countdown = Math.max(0, this.countdown - dt)
      return
    }
    this.actors.forEach(actor => actor.preStep(dt))
    this.world.step(dt)
    this.actors.forEach(actor => actor.postStep(dt))
    this.step += 1
    const centerCounts = this.getCenterCounts()
    if (centerCounts[0] === centerCounts[1]) return
    const strongTeam = centerCounts[0] > centerCounts[1] ? 0 : 1
    this.scores[strongTeam] += dt
    if (Math.max(...this.scores) >= Simulation.scoreTime) {
      this.state = 'victory'
      this.countdown = Simulation.victoryTime
    }
  }

  restart (): void {
    this.token = String(Math.random())
    this.units.forEach(unit => {
      unit.respawn()
    })
    this.game.teams.forEach(team => {
      team.active = false
      team.ready = false
    })
    this.scores = [0, 0]
    this.state = 'action'
    this.countdown = Simulation.actionTime
  }

  getCenterCounts (): number[] {
    const centerCounts = [0, 0]
    const mid = 0.5 * Arena.size
    const center = new Vec2(mid, mid)
    const reach = Simulation.centerRadius + Unit.radius
    this.units.forEach(unit => {
      const distance = Vec2.distance(unit.position, center)
      if (distance > reach) return
      centerCounts[unit.team] += 1
    })
    return centerCounts
  }
}
