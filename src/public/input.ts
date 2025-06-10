import { Arena } from '../actors/arena'
import { Client } from './client'

export class Input {
  client: Client
  interfaceDiv = document.getElementById('interfaceDiv') as HTMLDivElement

  constructor (client: Client) {
    this.client = client
    this.interfaceDiv.addEventListener('mousedown', (event: MouseEvent) => this.mouseDown(event))
    window.addEventListener('resize', (event) => this.client.renderer.draw())
  }

  mouseDown (event: MouseEvent): void {
    const rect = this.interfaceDiv.getBoundingClientRect()
    const x = Arena.size * (event.clientX - rect.x) / rect.width
    const y = -Arena.size * (event.clientY - rect.y - rect.height) / rect.height
    console.log('mouseDown', x.toFixed(2), y.toFixed(2))
  }
}
