import { GTAEvent, Provider } from '../types'
import { createScript, loadScript } from '../utils'

declare global {
  interface Window {
    ga?: any
    GoogleAnalyticsObject?: string
  }
}

export type Params = {
  account: string
  scriptUrl?: string
}

const defaults = {
  scriptUrl: '//www.google-analytics.com/analytics.js'
}

const kName = 'google'

export class GoogleAnalytics implements Provider {
  static providerName = kName

  public name = kName

  constructor(params: Params) {
    const { account, scriptUrl } = params

    window.GoogleAnalyticsObject = 'ga'

    window.ga = function() {
      window.ga.q.push(arguments)
    }

    window.ga.q = []
    window.ga.l = Date.now()

    const script = createScript(scriptUrl || defaults.scriptUrl)
    loadScript(script, 'ga')

    window.ga('create', account, 'auto')
    window.ga('send', 'pageview')
  }

  pageview() {
    if (window.ga) {
      const args = Array.prototype.slice.call(arguments)
      const data = typeof args[0] === 'object' ? args[0] : args.join('_')
      window.ga('send', 'pageview', data)
    }
  }

  event(eventDetails: GTAEvent) {
    if (window.ga) {
      const { page: category, action, type: label } = eventDetails
      window.ga('send', 'event', category, action, label)
    }
  }
}
