import { Server } from './server'

export class Game {
  server = new Server()

  constructor () {
    console.log('Game')
  }
}
