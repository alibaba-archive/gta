import { GTA, Plugin } from '../types'
import { CookieAbbr, kUUIDRandPrefix } from '../utils'

declare module '../index' {
  interface GTA {
    getReferral?: ReferralDaemon['get']
    sweepReferral?: ReferralDaemon['sweep']
  }
}

const kName = 'referrald'

export class ReferralDaemon implements Plugin {
  static pluginName = kName
  name = kName

  constructor(private gta: GTA) {
    try {
      gta.getReferral = this.get
      gta.sweepReferral = this.sweep

      const hasCookieRecorded = !!this.get()
      const currentUserKey = this.gta.storage.get(CookieAbbr.userKey) || ''
      const isCurrentUserRandom = currentUserKey.indexOf(kUUIDRandPrefix) === 0
      if (document.referrer && isCurrentUserRandom && !hasCookieRecorded) {
        const $parser = document.createElement('a')
        $parser.href = document.referrer
        const referral = {
          domain: $parser.hostname.slice(0, 50),
          path: $parser.pathname.slice(0, 60),
          query: $parser.search.slice(0, 20),
          hash: $parser.hash.slice(0, 20),
        }
        gta.storage.set(CookieAbbr.referral, referral)
      }
    } catch (e) {
      DEBUG('GTA error in referrald', e)
    }
  }

  get = () => {
    return this.gta.storage.get(CookieAbbr.referral) || null
  }

  sweep = () => {
    this.gta.storage.delete(CookieAbbr.referral)
  }
}
