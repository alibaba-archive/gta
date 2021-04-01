
import { GTA, Plugin } from 'types'

declare module 'index' {
  interface GTA {
    durationStart?: DurationPlugin['durationStart']
    durationEnd?: DurationPlugin['durationEnd']
  }
}

const kName = 'duration'

export class DurationPlugin implements Plugin {
  static pluginName = kName

  name = kName

  private startTimeMap: Map<string, number> = new Map()

  constructor(private gta: GTA) {
    this.gta.durationStart = this.durationStart
    this.gta.durationEnd = this.durationEnd

    window.addEventListener('unload', () => {
      this.startTimeMap.forEach((_value, key) => {
        this.durationEnd(key)
      })
    })
  }

  durationStart = (key: string) => {
    this.startTimeMap.set(key, Date.now())
  }

  durationEnd = (key: string) => {
    if (this.startTimeMap.has(key)) {
      const duration = Date.now() - this.startTimeMap.get(key)!
      this.startTimeMap.delete(key)

      DEBUG(`time on ${key} : ${duration}`)
      this.gta.event({
        gmkey: 'EXP',
        [key]: duration,
      })
    } else {
      console.warn(`${key} need use durationStart function`);
    }
  }
}