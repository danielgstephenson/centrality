import { Vec2 } from 'planck'

export function range (a: number, b?: number): number[] {
  if (b == null) return range(0, a - 1)
  return [...Array(b - a + 1).keys()].map(i => a + i)
}

export function choose<T> (choices: T[]): T {
  return choices[Math.floor(Math.random() * choices.length)]
}

export function runif (a: number, b: number): number {
  return a + (b - a) * Math.random()
}

export function rotate (vector: Vec2, angle: number): Vec2 {
  const x = vector.x * Math.cos(angle) - vector.y * Math.sin(angle)
  const y = vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
  return new Vec2(x, y)
}
