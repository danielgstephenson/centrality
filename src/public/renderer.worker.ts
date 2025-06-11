import { RenderData } from './renderer.js'

onmessage = (event: MessageEvent<RenderData>) => {
  console.log('worker onmessage')
}
