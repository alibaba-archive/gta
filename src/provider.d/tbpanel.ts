import { GTAEvent, Provider } from 'types'
import { xhrGET } from 'utils'

export type Params = {
  account: string
  track?: string
}

const defaults = {
  track: 'gta.teambition.net/v1'
}

const kName = 'tbpanel'

export class TBPanelLite implements Provider {
  static providerName = kName

  public name = kName

  private userKey: string = ''
  private trackUrl: string

  constructor(params: Params) {
    this.trackUrl = params.track || defaults.track
    if (!/^((https?):)?\/\//.test(this.trackUrl)) {
      this.trackUrl = `//${this.trackUrl}`
    }
  }

  setUser(userKey: string) {
    this.userKey = userKey
  }

  event(eventDetails: GTAEvent) {
    const payload = btoa(JSON.stringify({
      event: eventDetails.action,
      properties: {
        userKey: this.userKey,
        distinct_id: this.userKey,
        event_name: eventDetails.action || 'no-op',
        ...eventDetails
      }
    }).toLowerCase())
    xhrGET(`${this.trackUrl}/track/?data=${payload}&_=${Date.now()}`)
  }
}
