import { Dict, GTA, GTAEvent, Plugin } from '../types'
import { CookieAbbr } from '../utils'

declare module '../index' {
  interface GTA {
    setCurrentPage: SuperPropertyPlugin['setCurrentPage']
    registerProperty: SuperPropertyPlugin['registerProperty']
    unregisterProperty: SuperPropertyPlugin['unregisterProperty']
    registerPersistentProperty: SuperPropertyPlugin['registerPersistentProperty']
    unregisterPersistentProperty: SuperPropertyPlugin['unregisterPersistentProperty']
  }
}

const kName = 'superproperty'

export class SuperPropertyPlugin implements Plugin {
  static pluginName = kName

  name = kName

  private runtimeProperties: Dict<any> = {}
  private persistentProperties: Dict<any>

  constructor(private gta: GTA) {
    gta.setCurrentPage = this.setCurrentPage
    gta.registerProperty = this.registerProperty
    gta.unregisterProperty = this.unregisterProperty
    gta.registerPersistentProperty = this.registerPersistentProperty
    gta.unregisterPersistentProperty = this.unregisterPersistentProperty
    
    this.persistentProperties = gta.storage.get(CookieAbbr.userProperty) ?? {}
  }

  registerProperty = (key: string, value: any) => {
    this.runtimeProperties[key] = value
    return this
  }

  unregisterProperty = (key: string) => {
    delete this.runtimeProperties[key]
    return this
  }

  registerPersistentProperty = (key: string, value: any) => {
    this.persistentProperties[key] = value
    this.gta.storage.set(CookieAbbr.userProperty, this.persistentProperties)
  }

  unregisterPersistentProperty = (key: string) => {
    delete this.persistentProperties[key]
    this.gta.storage.set(CookieAbbr.userProperty, this.persistentProperties)
  }

  setCurrentPage = (page: string) => {
    this.registerProperty('page', page)
  }
  
  onGTAEvent(eventDetails: GTAEvent) {
    return {
      ...this.persistentProperties,
      ...this.runtimeProperties,
      ...eventDetails,
    }
  }
}
