import { choose } from './math'
import { Player } from './player'
import { Server } from './server'
import { Simulation } from './simulation'

export class Game {
  server = new Server()
  simulation = new Simulation(this)
  token = String(Math.random())
  players: Player[] = []

  constructor () {
    console.log('Game')
    this.setupIo()
  }

  setupIo (): void {
    this.server.io.on('connection', socket => {
      const player = new Player(this, socket)
      this.players.push(player)
      console.log('connect:', socket.id)
      socket.emit('connected', player.summarize(-1))
      socket.on('update', (oldTime: number) => {
        socket.emit('update', player.summarize(oldTime))
      })
      socket.on('disconnect', () => {
        console.log('disconnect:', socket.id)
        this.players = this.players.filter(p => p.id !== socket.id)
      })
    })
  }

  getSmallTeam (): number {
    const playerCount1 = this.getPlayerCount(1)
    const playerCount2 = this.getPlayerCount(2)
    if (playerCount2 > playerCount1) return 1
    if (playerCount1 > playerCount2) return 2
    return choose([1, 2])
  }

  getPlayerCount (team: number): number {
    const teamPlayers = this.players.filter(p => p.team === team)
    return teamPlayers.length
  }
}
