import { GTAEvent, Provider } from '../types'
import { createScript, loadScript } from '../utils'

declare global {
  interface Window {
    sa?: any
  }
}

const kName = 'sensorsdata'
const kSDKUrl = '//g.alicdn.com/teambition-fe/static-files/analytics/sensorsdata.min.js'

export type Params = {
  account: string
  script?: string
  heatmap?: boolean
  showlog?: boolean
  isspa?: boolean
}

export class Sensorsdata implements Provider {
  static providerName = kName

  public name = kName

  constructor(params: Params) {
    const para = {
      sdk_url: params.script || kSDKUrl,
      name: 'sa',
      server_url: params.account,
      ...(params.heatmap ? { heatmap: {scroll_notice_map:'not_collect'} } : {}),
      ...(params.showlog ? {} : { show_log: false }),
      ...(params.isspa === false ? {} : { is_track_single_page: true })
    }

    if (typeof(window['sensorsDataAnalytic201505']) !== 'undefined') {
      return
    }

    window['sensorsDataAnalytic201505'] = para.name

    window[para.name] = window[para.name] || function(command: any) {
      return function() {
        window[para.name]._q = window[para.name]._q || []
        window[para.name]._q.push([command, arguments])
      }
    }

    const commands = [
      'track','quick','register','registerPage','registerOnce','trackSignup', 'trackAbtest',
      'setProfile','setOnceProfile','appendProfile', 'incrementProfile', 'deleteProfile',
      'unsetProfile', 'identify','login','logout','trackLink','clearAllRegister','getAppStatus'
    ]

    for (let i = 0; i < commands.length; ++i) {
      window[para.name][commands[i]] = window[para.name].call(null, commands[i])
    }

    if (!window[para.name]._t) {
      const script = createScript(para.sdk_url)
      window[para.name].para = para
      loadScript(script, para.name)
    }

    window.sa?.quick('autoTrack')
  }

  setUser(id: string, user: object) {
    if (/[a-fA-F0-9]{24}/.test(id)) {
      this.login(id)
      window.sa?.setProfile(user)
    } else {
      window.sa?.quick('isReady', () => {
        window.sa.identify(id, true)
      })
    }
  }

  event(event: GTAEvent) {
    const evt = { platform: 'web' }
    for (const key in event) {
      if (Object.prototype.hasOwnProperty.call(evt, key)) {
        evt[`${key}`.toLowerCase()] = event[key]
      }
    }

    const action = `${evt['action']}`
      .replace(/ /g, '_')
      .replace(/[^A-Za-z0-9_\$]/g, '')
      .toLowerCase()

    window.sa?.track(action, evt)
  }

  login(userId: string) {
    window.sa?.login(userId)
  }

  logout() {
    window.sa?.logout()
  }
}
