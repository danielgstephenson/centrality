import { Arena } from '../actors/arena.js'
import { Client } from './client.js'

export class Input {
  client: Client
  canvas = document.getElementById('canvas') as HTMLDivElement

  constructor (client: Client) {
    this.client = client
    this.canvas.addEventListener('mousedown', (event: MouseEvent) => this.onMouseDown(event))
  }

  onMouseDown (event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect()
    const x = Arena.size * (event.clientX - rect.x) / rect.width
    const y = -Arena.size * (event.clientY - rect.y - rect.height) / rect.height
    console.log('mouseDown', x.toFixed(2), y.toFixed(2))
  }
}
