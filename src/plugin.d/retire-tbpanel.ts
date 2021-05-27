import { GTA, Plugin } from '../types'
import { deleteCookie } from '../utils'

const kName = 'retire-tbpanel-cookie'

export class RetireTBPanelPlugin implements Plugin {
  static pluginName = kName
  name = kName

  constructor(_gta: GTA) {
    try {
      this.sweepTBPanelCookies()
    } catch (e) {
      DEBUG('GTA error when retire tbpanel cookie: ', e)
    }
  }

  private sweepTBPanelCookies() {
    const cookies = document.cookie.split(';')
    const toBeSweptCookieName = cookies
      .map(cookie => cookie.split('=')?.[0].trim())
      .filter(name => /^mp_tbpanel.*?$/.test(name) || /^mp_.*?_mixpanel$/.test(name))
    
    const domainList = this.generateDomainList()

    toBeSweptCookieName.forEach(name => {
      deleteCookie(name)
      domainList.forEach(domain => deleteCookie(name, domain))
    })
  }

  private generateDomainList = () => {
    const currentDomain = location.hostname
    const parentDomainPieces = currentDomain.split('.') || []
    const parentDomainList = []

    while (parentDomainPieces.length >= 2) {
      const domain = parentDomainPieces.join('.')
      parentDomainList.push(domain)
      parentDomainList.push(`.${domain}`)
      parentDomainPieces.shift()
    }

    return parentDomainList
  }
}
