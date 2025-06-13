import { io } from 'socket.io-client'
import { Input } from './input.js'
import { Summary } from '../summary.js'
import { Renderer } from './renderer.js'

export class Client {
  socket = io()
  summary = new Summary()
  renderer = new Renderer()
  input = new Input(this)
  updateTime = performance.now()

  constructor () {
    this.input.onResize()
    this.socket.on('connected', (summary: Summary) => {
      this.checkGameToken(summary)
      this.summary = summary
      this.renderer.summary = summary
      this.renderer.draw()
      console.log('connected')
    })
    this.socket.on('update', (summary: Summary) => {
      this.updateTime = performance.now()
      this.checkGameToken(summary)
      this.summary = summary
      this.renderer.summary = summary
      this.renderer.draw()
    })
  }

  checkGameToken (summary: Summary): void {
    const oldToken = this.summary.gameToken
    const reload = !['', summary.gameToken].includes(oldToken)
    if (reload) {
      console.log('newServer')
      location.reload()
    }
  }
}
