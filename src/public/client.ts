import { io } from 'socket.io-client'
import { Input } from './input'
import { Summary } from '../summary'
import { Renderer } from './renderer'

export class Client {
  socket = io()
  renderer = new Renderer(this)
  input = new Input(this)

  constructor () {
    this.socket.on('connected', (summary: Summary) => {
      this.checkGameToken(summary)
      console.log('connected')
      this.renderer.summary = summary
      this.renderer.draw()
      setInterval(() => this.updateServer(), 1000 / 20)
    })
    this.socket.on('update', (summary: Summary) => {
      this.checkGameToken(summary)
      this.renderer.summary = summary
    })
  }

  updateServer (): void {
    this.socket.emit('update')
  }

  checkGameToken (summary: Summary): void {
    const oldToken = this.renderer.summary.gameToken
    const reload = !['', summary.gameToken].includes(oldToken)
    if (reload) {
      console.log('newServer')
      location.reload()
    }
  }
}
