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

export function clamp (a: number, b: number, x: number): number {
  return Math.max(a, Math.min(x, b))
}

export function rotate (vector: Vec2, angle: number): Vec2 {
  const x = vector.x * Math.cos(angle) - vector.y * Math.sin(angle)
  const y = vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
  return new Vec2(x, y)
}

export function dirFromTo (from: Vec2, to: Vec2): Vec2 {
  return normalize(Vec2.sub(to, from))
}

export function normalize (vector: Vec2): Vec2 {
  const normalized = vector.clone()
  normalized.normalize()
  return normalized
}
