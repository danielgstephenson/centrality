import { Arena } from '../actors/arena.js'
import { Client } from './client.js'

export class Input {
  client: Client
  canvasDiv = document.getElementById('canvasDiv') as HTMLDivElement
  arenaCanvas = document.getElementById('arenaCanvas') as HTMLCanvasElement
  trailCanvas = document.getElementById('trailCanvas') as HTMLCanvasElement
  unitCanvas = document.getElementById('unitCanvas') as HTMLCanvasElement

  constructor (client: Client) {
    this.client = client
    this.canvasDiv.addEventListener('mousedown', (event: MouseEvent) => this.onMouseDown(event))
    window.addEventListener('resize', () => this.onResize())
  }

  onResize (): void {
    // const rect = this.canvasDiv.getBoundingClientRect()
  }

  onMouseDown (event: MouseEvent): void {
    const rect = this.canvasDiv.getBoundingClientRect()
    const x = Arena.size * (event.clientX - rect.x) / rect.width
    const y = -Arena.size * (event.clientY - rect.y - rect.height) / rect.height
    console.log('mouseDown', x.toFixed(2), y.toFixed(2))
  }
}
