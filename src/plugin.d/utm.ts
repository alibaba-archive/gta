import { GTA, Plugin } from 'types'
import { CookieAbbr, kUUIDRandPrefix } from 'utils'

declare module 'index' {
  interface GTA {
    getUTM?: UTMDaemon['get']
    sweepUTM?: UTMDaemon['sweep']
  }
}

const kName = 'utmd'

const kUTMTagRegex = /utm_(\w+)=([^&]*)&?/ig

export class UTMDaemon implements Plugin {
  static pluginName = kName
  name = kName

  constructor(private gta: GTA) {
    try {
      gta.getUTM = this.get
      gta.sweepUTM = this.sweep

      const currentUserKey = this.gta.storage.get(CookieAbbr.userKey) || ''
      const isCurrentUserRandom = currentUserKey.indexOf(kUUIDRandPrefix) === 0
      const hasCookieRecorded = !!this.get()
      if (isCurrentUserRandom && !hasCookieRecorded) {
        const utm: object = {}
        let match
        while(match = kUTMTagRegex.exec(window.location.search)) {
          const [, key, value ] = match
          utm[key] = value
        }
        gta.storage.set(CookieAbbr.utm, utm)
      }
    } catch (e) {
      DEBUG('GTA error in utmd', e)
    }
  }

  get = () => {
    return this.gta.storage.get(CookieAbbr.referral) || null
  }

  sweep = () => {
    this.gta.storage.delete(CookieAbbr.referral)
  }
}
