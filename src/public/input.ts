import { Vec2 } from 'planck'
import { Arena } from '../actors/arena.js'
import { Client } from './client.js'
import { Plan } from '../messages/plan.js'

export class Input {
  client: Client
  interfaceDiv = document.getElementById('interfaceDiv') as HTMLDivElement
  canvasDiv = document.getElementById('canvasDiv') as HTMLDivElement
  arenaCanvas = document.getElementById('arenaCanvas') as HTMLCanvasElement
  trailCanvas = document.getElementById('trailCanvas') as HTMLCanvasElement
  unitCanvas = document.getElementById('unitCanvas') as HTMLCanvasElement

  constructor (client: Client) {
    this.client = client
    document.addEventListener('contextmenu', (event) => event.preventDefault())
    this.canvasDiv.addEventListener('mousedown', (event: MouseEvent) => this.onMouseDown(event))
    window.addEventListener('resize', () => this.onResize())
  }

  onResize (): void {
    const rect = this.interfaceDiv.getBoundingClientRect()
    if (rect.width > rect.height) {
      this.interfaceDiv.style.flexDirection = 'row'
      return
    }
    this.interfaceDiv.style.flexDirection = 'column'
  }

  onMouseDown (event: MouseEvent): void {
    const rect = this.canvasDiv.getBoundingClientRect()
    const x = Arena.size * (event.clientX - rect.x) / rect.width
    const y = -Arena.size * (event.clientY - rect.y - rect.height) / rect.height
    const target = new Vec2(x, y)
    console.log('mouseDown', x.toFixed(2), y.toFixed(2))
    const plan = new Plan(target, event.button)
    this.client.socket.emit('mouseDown', plan)
  }
}
