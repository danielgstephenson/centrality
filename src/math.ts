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
