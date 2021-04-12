
import { GTA, Plugin } from '../types'

declare module '../index' {
  interface GTA {
    durationStart?: DurationPlugin['durationStart']
    durationEnd?: DurationPlugin['durationEnd']
  }
}

const kName = 'duration'

export class DurationPlugin implements Plugin {
  static pluginName = kName

  name = kName

  private startTimeMap: Map<string, Array<number>> = new Map()

  constructor(private gta: GTA) {
    this.gta.durationStart = this.durationStart
    this.gta.durationEnd = this.durationEnd

    window.addEventListener('unload', () => {
      this.startTimeMap.forEach((_value, key) => {
        this.durationEnd(key)
      })
    })
  }

  /**
   * 埋点计时开始
   * @param key 埋点存储字段
   */
  durationStart = (key: string) => {
    if(this.startTimeMap.has(key)) {
      const startTime = this.startTimeMap.get(key)!
      startTime.push(Date.now())
      this.startTimeMap.set(key, startTime)
    } else {
      this.startTimeMap.set(key, [Date.now()])
    }
  }

  /**
   * 埋点结束
   * @param key 埋点取值字段
   * @param newFlag 是否取最后的值，false默认取值第一个，取值后删除Map
   * @param index 是否根据索引取值，取值后保留Map
   */
  durationEnd = (key: string, newFlag?: boolean, index?: number) => {
    if (this.startTimeMap.has(key)) {
      const startTime = this.startTimeMap.get(key)!

      let duration: number

      if(newFlag) {
        duration = Date.now() - startTime.pop()!
        this.startTimeMap.delete(key)
      } else {
        // @ts-ignore
        if(index === +index) {
          duration = Date.now() - Number(startTime.splice(index, 1))
        } else {
          duration = Date.now() - startTime[0]
          this.startTimeMap.delete(key)
        }
      }

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