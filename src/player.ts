import { DefaultEventsMap, Socket } from 'socket.io'
import { Game } from './game'
import { Summary } from './summary'
import { Unit } from './actors/unit'

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
    summary.time = this.game.simulation.time
    summary.team = this.team
    summary.histories = this.game.simulation.units.map(unit => {
      return unit.history.filter((_, i) => i % Unit.trailStep === 0)
    })
    return summary
  }
}
