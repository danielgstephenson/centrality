import { DefaultEventsMap, Socket } from 'socket.io'
import { Game } from './game.js'
import { Summary } from './messages/summary.js'

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

  summarize (): Summary {
    const summary = new Summary()
    summary.gameToken = this.game.token
    summary.simToken = this.game.simulation.token
    summary.team = this.team
    summary.countdown = this.game.simulation.countdown
    summary.state = this.game.simulation.state
    summary.scores = this.game.simulation.scores
    summary.actives = this.game.teams.map(team => team.active)
    summary.targets = this.game.teams.map(team => team.target)
    summary.positions = this.game.simulation.units.map(unit => {
      return unit.position
    })
    return summary
  }
}
