import { Unit } from '../actors/unit'
import { Arena } from '../actors/arena'
import { Vec2 } from 'planck'

export class TrailCircle {
  interfaceDiv = document.getElementById('interfaceDiv') as HTMLDivElement
  div: HTMLDivElement
  position: Vec2
  scale: number

  constructor (position: Vec2, color: string, scale: number, opacity: number) {
    this.scale = scale
    this.div = document.createElement('div')
    this.div.style.position = 'absolute'
    this.div.style.backgroundColor = color
    this.div.style.opacity = opacity.toString()
    this.interfaceDiv.appendChild(this.div)
    this.position = position
    this.draw()
  }

  draw (): void {
    const rect = this.interfaceDiv.getBoundingClientRect()
    const radius = this.scale * rect.width * Unit.radius / Arena.size
    this.div.style.width = `${2 * radius}px`
    this.div.style.height = `${2 * radius}px`
    this.div.style.clipPath = `circle(${radius}px)`
    this.div.style.top = `-${radius}px`
    this.div.style.left = `-${radius}px`
    const x = rect.left + rect.width * this.position.x / Arena.size
    const y = rect.top + rect.height * this.position.y / Arena.size
    this.div.style.transform = `translate3d(${x}px,${y}px,0)`
  }
}
