import { io } from 'socket.io-client'
import { Input } from './input.js'
import { Summary } from '../summary.js'
import { RenderData } from './renderData.js'

export class Client {
  socket = io()
  worker: Worker
  summary = new Summary()
  input = new Input(this)

  constructor () {
    this.worker = new Worker(new URL('./renderer.worker.ts', import.meta.url), { type: 'module' })
    this.socket.on('connected', (summary: Summary) => {
      this.checkGameToken(summary)
      this.summary = summary
      console.log('connected')
      const canvas = document.getElementById('canvas') as HTMLCanvasElement
      const offscreen = canvas.transferControlToOffscreen()
      const renderData: RenderData = { canvas: offscreen, summary }
      this.worker.postMessage(renderData, [offscreen])
    })
    this.socket.on('update', (summary: Summary) => {
      this.checkGameToken(summary)
      this.summary = summary
      const renderData: RenderData = { summary }
      this.worker.postMessage(renderData)
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
