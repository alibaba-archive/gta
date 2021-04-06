import { CookieAbbr } from './utils'

export class CookieStorage {
  private domain: string
  private cache: object = {}

  constructor(
    public key: string,
    public expires: number = 5184000000,    // 60 * 24 * 3600 * 1000
    domain?: string
  ) {
    const match = document.cookie.match(new RegExp(`${key}=(.*?)(;|$)`))
    if (match) {
      try {
        this.cache = JSON.parse(decodeURIComponent(match[1]))
      } catch (e) {}
    }
    this.domain = this.savedDomain || this.defaultDomain
    this.setDomain(domain || this.domain)
  }

  set(key: string, value: any) {
    this.cache[key] = value
    this.commit()
  }

  get<T = any>(key: string): T | undefined {
    return this.cache[key]
  }

  delete(key: string) {
    delete this.cache[key]
    this.commit()
  }

  getDomain() {
    return this.domain
  }

  setDomain(domain: string) {
    // update saved domain
    this.cache[CookieAbbr.preference] = {
      ...this.cache[CookieAbbr.preference],
      [CookieAbbr.cookieDomain]: domain
    }

    // ... and migrate existing data
    if (this.domain !== domain) {
      this.destroy({ flushCache: false })
      this.domain = domain
      this.commit()
    }
  }

  private get savedDomain() {
    const savedDomain = this.cache?.[CookieAbbr.preference]?.[CookieAbbr.cookieDomain]
    return savedDomain && typeof savedDomain === 'string' ? savedDomain : ''
  }

  private get defaultDomain() {
    // use top level domain with leading dot or hostname like localhost
    const hostname = location.hostname || ''
    const extracted = /[a-z0-9-]+\.[a-z0-9-]+$/i.exec(hostname)?.[0]
    return extracted ? `.${extracted}` : hostname
  }

  private get cookieDomain() {
    return this.domain ? `domain=${this.domain};` : ''
  }

  commit() {
    const val = encodeURIComponent(JSON.stringify(this.cache))
    const exactExpires = new Date(Date.now() + this.expires).toUTCString()
    document.cookie = `${this.key}=${val};expires=${exactExpires};${this.cookieDomain}path=/`
  }

  destroy(options?: { flushCache?: boolean }) {
    if (options?.flushCache ?? true) {
      this.cache = {}
    }
    document.cookie = `${this.key}=DELETED;expires=Thu, 01 Jan 1970 00:00:00 UTC;${this.cookieDomain}path=/`
  }
}
