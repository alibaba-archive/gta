import { GTAEvent, Provider } from '../types'
import { imageGET } from '../utils'

export type Params = {
  account: string
  host: string
}

const defaults = {
  host: '//gm.mmstat.com'
}

const kName = 'aplus'

export class APlus implements Provider {
  static providerName = kName

  public name = kName

  private host: string
  private goldKey: string

  private userKey: string = ''
  private user: object = {}

  constructor(params: Params) {
    this.host = params.host || defaults.host
    this.goldKey = params.account
  }

  setUser(id: string, user: object) {
    this.userKey = id
    this.user = user
  }

  enrichEvent(event: GTAEvent) {
    return {
      gmkey: 'CLK',
      userKey: this.userKey,
      cache: `${Date.now()}`,
      // for backward compatibility
      mp_lib: 'web',
      platform: 'web',
      sys_current_url: window.location?.href,
      ...this.user,
      ...event,
    }
  }

  event(event: GTAEvent) {
    event = this.enrichEvent(event)

    const queries = []
    for (let key in event) {
      if (Object.prototype.hasOwnProperty.call(event, key)) {
        queries.push(`${key}=${encodeURIComponent(event[key])}`)
      }
    }
    
    imageGET(`${this.host}${this.goldKey}?${queries.join('&').toLowerCase()}`)
  }
}
