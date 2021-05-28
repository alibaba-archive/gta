import { plugins } from './plugin.d'
import { providers } from './provider.d'
import { CookieStorage } from './storage'
import { CookieAbbr, DEBUG_FLAG, find, formatUserFor, parseConfigElement, setDebugFlag, UUID } from './utils'
import { BaseProviderParams, GTAEvent, GTAOptions, PluginConstructor, Plugin, Provider, ProviderConstructor } from './types'

import { SuperPropertyPlugin } from './plugin.d/super-property'
import { DurationPlugin } from './plugin.d/duration'

declare const __MACRO_VERSION__: string

export const kVersion = __MACRO_VERSION__
export class GTA {
  static version = kVersion
  version = kVersion

  get debug() { return DEBUG_FLAG }
  set debug(flag: boolean) { setDebugFlag(flag) }

  private dryRun: boolean = false
  private initialized: boolean = false

  private plugins: Plugin[] = []
  private providers: Provider[] = []

  public options: GTAOptions | null = null
  public storage = new CookieStorage('TB_GTA', 180 * 24 * 3600 * 1000 /* 180 days */)

  constructor() {
    this.registerPlugin(SuperPropertyPlugin, null)
    this.registerPlugin(DurationPlugin, null)
  }

  init(options?: GTAOptions) {
    // quit if already initialized
    if (this.initialized) { return true }
    this.initialized = true

    // stop for non-browser env
    if (typeof document === 'undefined') { return false }

    // take options
    const inPageConfig = parseConfigElement(document.getElementById('gta-main'))
    if (!options && !inPageConfig) { return false }

    // merge options, options first, in-page config second
    options = {
      ...inPageConfig,
      ...options,
      providerConfig: {
        ...inPageConfig?.providerConfig,
        ...options?.providerConfig,
      },
      pluginConfig: {
        ...inPageConfig?.pluginConfig,
        ...options?.pluginConfig,
      }
    }

    // update domain
    if (typeof options.domain === 'string') { this.storage.setDomain(options.domain) }

    // update saved preference
    const pref = this.storage.get(CookieAbbr.preference) ?? {}
    if (typeof options.dryRun === 'boolean') { pref[CookieAbbr.dryRun] = Number(options.dryRun) }
    this.storage.set(CookieAbbr.preference, pref)

    // use previous preference if not specified
    if (typeof options.dryRun !== 'boolean' && typeof pref[CookieAbbr.dryRun] === 'number') { options.dryRun = Boolean(pref[CookieAbbr.dryRun]) }
    if (options.dryRun === true) { this.dryRun = true }

    this.options = options

    // install providers
    if (!this.dryRun) {
      for (const name in options.providerConfig) {
        if (Object.prototype.hasOwnProperty.call(options.providerConfig, name)) {
          const providerCtor = find(providers, p => p.providerName === name)
          if (providerCtor) {
            this.registerProvider(providerCtor, options.providerConfig[name])
          }
        }
      }
    }

    // install plugins
    for (let i = 0; i < plugins.length; ++i) {
      const pluginCtor = plugins[i]
      const pluginConfig = options.pluginConfig?.[pluginCtor.pluginName]
      if (!pluginConfig?.disabled) {
        this.registerPlugin(pluginCtor, options.pluginConfig?.[pluginCtor.pluginName])
      }
    }

    return true
  }

  setUser(userId?: string, user?: object, options?: GTAOptions) {
    try {
      if (!this.init(options)) { return false }
      if (!userId) {
        userId = this.storage.get<string>(CookieAbbr.userKey) || UUID()
      }
      this.storage.set(CookieAbbr.userKey, userId)
      for (let i = 0; i < this.providers.length; ++i) {
        const provider = this.providers[i]
        const formattedUser = formatUserFor(provider, user || {})
        provider.setUser?.(userId, formattedUser)
      }
    } catch (e) {
      DEBUG('GTA error when setUser: ', e)
      return false
    }
    return true
  }

  registerProvider<T extends BaseProviderParams>(Ctor: ProviderConstructor<T>, params: T) {
    let instance: Provider | null = null
    if (params.account) {
      this.providers.push(instance = new Ctor(params))
    }
    return instance
  }

  registerPlugin<T>(Ctor: PluginConstructor<T>, params: T) {
    let instance: Plugin | null = null
    this.plugins.push(instance = new Ctor(this, params))
    return instance
  }

  event(event: GTAEvent) {
    try {
      if (event && typeof event === 'object') {
        for (let i = 0; i < this.plugins.length; ++i) {
          if (this.plugins[i].onGTAEvent) {
            const rtn = this.plugins[i].onGTAEvent!(event)
            if (!rtn) {
              DEBUG(`An event was filtered by plugin: ${this.plugins[i].name}`, event)
              return this
            }
            event = rtn
          }
        }

        DEBUG('GTA event: ', event)

        for (let i = 0; i < this.providers.length; ++i) {
          try {
            this.providers[i].event?.(event)
          } catch (e) {
            DEBUG(`error on gta provider: ${this.providers[i].name}, ${e}`)
          }
        }
      }
    } catch (e) {
      DEBUG('GTA error when event: ', e)
    }
    return this
  }

  pageview() {
    try {
      for (let i = 0; i < this.providers.length; ++i) {
        this.providers[i].pageview?.()
      }
    } catch (e) {
      DEBUG('GTA error when pageview: ', e)
    }
  }

  login(userId: string, user: object) {
    try {
      const prevId = this.storage.get<string>(CookieAbbr.userKey) || ''
      this.storage.set(CookieAbbr.userKey, userId)
      for (let i = 0; i < this.providers.length; ++i) {
        const provider = this.providers[i]
        const formattedUser = formatUserFor(provider, user || {})
        provider.login?.(userId, formattedUser, { prevId })
      }
    } catch (e) {
      DEBUG('GTA error when login: ', e)
    }
  }

  logout(userId: string) {
    try {
      this.storage.destroy()
      this.storage.set(CookieAbbr.userKey, UUID())
      for (let i = 0; i < this.providers.length; ++i) {
        this.providers[i].logout?.(userId)
      }
    } catch (e) {
      DEBUG('GTA error when logout: ', e)
    }
  }
}

export default new GTA()
