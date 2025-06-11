import fs from 'fs-extra'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

export class Config {
  port = 3000
  secure = false
  timeScale = 1
  bot = true

  constructor () {
    const filename = fileURLToPath(import.meta.url)
    const mydirname = dirname(filename)
    const configPath = path.join(mydirname, '../config.json')
    const fileExists: boolean = fs.existsSync(configPath)
    if (fileExists) {
      const json = fs.readJSONSync(configPath)
      if (typeof json.port === 'number') this.port = json.port
      if (typeof json.secure === 'boolean') this.secure = json.secure
      if (typeof json.timeScale === 'number') this.timeScale = json.timeScale
    }
    console.log('port:', this.port)
    console.log('secure:', this.secure)
    console.log('timeScale:', this.timeScale)
  }
}
