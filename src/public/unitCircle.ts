import { Unit } from '../actors/unit'
import { Arena } from '../actors/arena'
import { Vec2 } from 'planck'
import { Renderer } from './renderer'

export class UnitCircle {
  interfaceDiv = document.getElementById('interfaceDiv') as HTMLDivElement
  div: HTMLDivElement
  hole: HTMLDivElement
  position: Vec2
  color: string
  renderer: Renderer

  constructor (renderer: Renderer, position: Vec2, color: string, role: number) {
    this.renderer = renderer
    this.color = color
    this.div = document.createElement('div')
    this.div.style.position = 'absolute'
    this.div.style.backgroundColor = this.color
    this.interfaceDiv.appendChild(this.div)
    this.hole = document.createElement('div')
    this.hole.style.position = 'absolute'
    this.hole.style.backgroundColor = 'black'
    this.hole.style.opacity = (role === 0 ? 1 : 0).toString()
    this.interfaceDiv.appendChild(this.hole)
    this.position = position
    this.setup()
    this.draw()
  }

  setup (): void {
    const rect = this.renderer.rect
    const radius = rect.width * Unit.radius / Arena.size
    this.div.style.width = `${2 * radius}px`
    this.div.style.height = `${2 * radius}px`
    this.div.style.clipPath = `circle(${radius}px)`
    this.div.style.top = `-${radius}px`
    this.div.style.left = `-${radius}px`
    const childScale = 0.6
    this.hole.style.width = `${2 * radius * childScale}px`
    this.hole.style.height = `${2 * radius * childScale}px`
    this.hole.style.clipPath = `circle(${radius * childScale}px)`
    this.hole.style.top = `-${radius * childScale}px`
    this.hole.style.left = `-${radius * childScale}px`
  }

  draw (): void {
    const rect = this.renderer.rect
    const x = rect.left + rect.width * this.position.x / Arena.size
    const y = rect.top + rect.height * this.position.y / Arena.size
    this.div.style.transform = `translate3d(${x}px,${y}px,0)`
    this.hole.style.transform = `translate3d(${x}px,${y}px,0)`
  }
}
