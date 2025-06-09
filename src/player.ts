import { DefaultEventsMap, Socket } from 'socket.io'
import { Game } from './game'
import { PlayerSummary } from './summaries/playerSummary'

type DefaultSocket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>

export class Player {
  game: Game
  team: number
  id: string
  socket: DefaultSocket

  constructor (game: Game, socket: DefaultSocket) {
    this.game = game
    this.id = socket.id
    this.socket = socket
    this.team = game.getSmallTeam()
  }

  summarize (oldTime: number): PlayerSummary {
    const summary = new PlayerSummary()
    summary.gameToken = this.game.token
    summary.simToken = this.game.simulation.token
    summary.time = this.game.simulation.time
    summary.team = this.team
    summary.units = this.game.simulation.units.map(unit => unit.summarize(oldTime))
    summary.border = this.game.simulation.arena.vertices
    return summary
  }
}
