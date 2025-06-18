import { choose } from './math.js'
import { Player } from './player.js'
import { Server } from './server.js'
import { Simulation } from './simulation.js'
import { Team } from './team.js'
import { Plan } from './messages/plan.js'

export class Game {
  server = new Server()
  simulation = new Simulation(this)
  token = String(Math.random())
  teams = [new Team(0), new Team(1)]
  players: Player[] = []

  constructor () {
    console.log('Game')
    this.setupIo()
  }

  setupIo (): void {
    setInterval(() => this.updatePlayers(), 1000 / 30)
    this.server.io.on('connection', socket => {
      const player = new Player(this, socket)
      this.players.push(player)
      console.log('connect:', socket.id)
      socket.emit('connected', player.summarize())
      socket.on('mouseDown', (plan: Plan) => {
        this.simulation.paused = false
        const team = this.teams[player.team]
        if (team == null) return
        if (this.simulation.state === 'action') return
        team.ready = true
        if (plan.button === 2) return
        team.active = true
        team.target = plan.target
      })
      socket.on('disconnect', () => {
        console.log('disconnect:', socket.id)
        this.players = this.players.filter(p => p.id !== socket.id)
      })
    })
  }

  updatePlayers (): void {
    this.players.forEach(player => {
      player.socket.emit('update', player.summarize())
    })
  }

  getSmallTeam (): number {
    const playerCount0 = this.getPlayerCount(0)
    const playerCount1 = this.getPlayerCount(1)
    if (playerCount1 > playerCount0) return 0
    if (playerCount0 > playerCount1) return 1
    return choose([0, 1])
  }

  getPlayerCount (team: number): number {
    const teamPlayers = this.players.filter(p => p.team === team)
    return teamPlayers.length
  }
}
