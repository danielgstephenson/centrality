import { io } from 'socket.io-client'
import { Renderer } from './renderer'
import { Input } from './input'
import { Summary } from '../summary'

export class Client {
  socket = io()
  renderer = new Renderer(this)
  input = new Input(this)
  summary = new Summary()

  constructor () {
    this.socket.on('connected', (summary: Summary) => {
      this.checkGameToken(summary)
      console.log('connected')
      this.summary = summary
      this.renderer.draw()
      setInterval(() => this.updateServer(), 1000 / 30)
    })
    this.socket.on('update', (summary: Summary) => {
      this.checkGameToken(summary)
      this.summary = summary
    })
  }

  updateServer (): void {
    this.socket.emit('update', this.summary.time)
  }

  checkGameToken (summary: Summary): void {
    const newServer = !['', summary.gameToken].includes(this.summary.gameToken)
    if (newServer) {
      console.log('newServer')
      location.reload()
    }
  }
}
