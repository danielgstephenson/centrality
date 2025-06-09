import { io } from 'socket.io-client'
import { range } from '../math'
import { UnitSummary } from '../summaries/unitSummary'
import { Renderer } from './renderer'
import { Input } from './input'
import { PlayerSummary } from '../summaries/playerSummary'

export class Client {
  socket = io()
  units: UnitSummary[] = []
  renderer = new Renderer(this)
  input = new Input(this)
  summary = new PlayerSummary()

  constructor () {
    range(4).forEach(_ => this.units.push(new UnitSummary()))
    this.socket.on('connected', (summary: PlayerSummary) => {
      this.checkGameToken(summary)
      console.log('connected')
      this.readSummary(summary)
      this.renderer.draw()
      setInterval(() => this.updateServer(), 1000 / 30)
    })
    this.socket.on('update', (summary: PlayerSummary) => {
      this.checkGameToken(summary)
      this.readSummary(summary)
      this.renderer.draw()
    })
  }

  updateServer (): void {
    this.socket.emit('update', this.summary.time)
  }

  readSummary (summary: PlayerSummary): void {
    this.summary = summary
    this.summary.units.forEach((unitSummary, i) => {
      this.units[i].update(unitSummary, summary.time)
    })
  }

  checkGameToken (summary: PlayerSummary): void {
    const newServer = !['', summary.gameToken].includes(this.summary.gameToken)
    if (newServer) {
      console.log('newServer')
      location.reload()
    }
  }
}
