import { Arena } from '../actors/arena'
import { Client } from './client'

export class Input {
  canvas = document.getElementById('canvas') as HTMLCanvasElement
  client: Client

  constructor (client: Client) {
    this.client = client
    this.canvas.addEventListener('mousedown', event => this.mouseDown(event))
  }

  mouseDown (event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect()
    const x = Arena.size * (event.clientX - rect.x) / rect.width
    const y = -Arena.size * (event.clientY - rect.y - rect.height) / rect.height
    console.log('mouseDown', x.toFixed(2), y.toFixed(2))
  }
}
