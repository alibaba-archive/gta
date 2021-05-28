import type { GTAOptions, Provider } from './types'

import { plugins } from './plugin.d'
import { providers } from './provider.d'

export const removeNode = (el: HTMLElement) => {
  el.parentNode?.removeChild(el)
}

export const createScript = (src: string, id?: string) => {
  const script = document.createElement('script')
  script.async = true
  script.src = src
  if (id) { script.id = id }
  return script
}

export const loadScript = (script: HTMLScriptElement, key?: string, removeAfterLoad = true) => {
  script.onerror = () => {
    key && delete window[key]
    removeNode(script)
  }

  script.onload = () => {
    if (removeAfterLoad) {
      removeNode(script)
    }
  }

  const firstScript = document.getElementsByTagName('script')[0]
  firstScript?.parentNode?.insertBefore(script, firstScript)
}

// gta规则：
// gta两端由 引号、大括号包裹: "{}" 或 '{}'
// 大括号内部类似JSON的 {key: value}格式，不同的是key和value两端的引号可以省略，两端的空格会被省略,
// key 和 value 的值不可以包含： 冒号、逗号、单引号、双引号，
// e.g.  data-gta="{action: 'add content', 'page' : 'Project Page', type: task, control: tasks layout, 'method': double-click}"
export const GTA_CHECK_REGEX = /^\s*\{(.*)\}\s*$/
export const GTA_PARSE_REGEX = /[\s"']*([^:,"']+)[\s"']*:[\s"']*([^:,"']+)[\s"']*,?/g
export const parseGTA = (raw: string) => {
  if (!raw) { return null }
  const content = GTA_CHECK_REGEX.exec(raw)?.[1]
  if (!content || content.length === 0) { return null }

  let it
  const parsed = {}
  while (it = GTA_PARSE_REGEX.exec(content)) {
    const [, key, value] = it
    parsed[key] = value
  }
  return parsed
}

// 根据属性为不同的 provider 提供不同类型的 super properties
export const formatUserFor = (provider: Provider, user: object) => {
  const result = {}
  for (const key in user) {
    if (Object.prototype.hasOwnProperty.call(user, key)) {
      const value = user[key]
      if (!value) { continue }
      if (value.wlist && !(provider.name in value.wlist)) { continue }
      if (value.alias?.[provider.name]) {
        result[value.alias[provider.name]] = value.value
      } else {
        if (Object.prototype.toString.call(value) === '[object Object]' && 'value' in value) {
          result[key] = value.value
        } else {
          result[key] = value
        }
      }
    }
  }
  return result
}

export const parseConfigElement = ($el: HTMLElement | null): GTAOptions | null => {
  if (!$el) { return null }

  const pluginNames = plugins.map(p => p.pluginName)
  const providerNames = providers.map(p => p.providerName)

  const gtaOptions: GTAOptions = { pluginConfig: {}, providerConfig: {} }

  const len = $el.attributes.length
  for (let i = 0; i < len; ++i) {
    const name = $el.attributes[i].name

    let value: any = $el.attributes[i].value
    if (value === 'true') { value = true }
    if (value === 'false') { value = false }

    const match = name.match(/data-(.*?)(?:-(.*?))?$/)
    if (match) {
      const [, configName, subConfigName] = match

      if (providerNames.indexOf(configName) >= 0) {
        if (!gtaOptions.providerConfig![configName]) {
          gtaOptions.providerConfig![configName] = { account: '' }
        }
        gtaOptions.providerConfig![configName][subConfigName || 'account'] = value
      } else if (pluginNames.indexOf(configName) >= 0 && subConfigName) {
        if (!gtaOptions.pluginConfig![configName]) {
          gtaOptions.pluginConfig![configName] = {}
        }
        gtaOptions.pluginConfig![configName][subConfigName] = value
      } else {
        gtaOptions[configName] = value
      }
    }
  }
  
  return gtaOptions
}

export const xhrGET = (url: string) => {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.send()
  return xhr
}

export const imageGET = (url: string) => {
  const image = document.createElement('img')
  image.src = url
  return image
}

export const kUUIDRandPrefix = '72616e64'  /* '72616e64'.decode('hex') is 'rand' */
export const UUID = () => kUUIDRandPrefix + ('' + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) => {
  return (((Math.random() * 16) | 0) >> (c / 4)).toString(16)
})
export const isRandomID = (id: string) => id.indexOf(kUUIDRandPrefix) === 0

export const find = <T>(arr: T[], predictor: (i: T) => boolean): T | null => {
  const len = arr.length
  for (let i = 0; i < len; ++i) {
    if (predictor(arr[i])) {
      return arr[i]
    }
  }
  return null
}

export const deleteCookie = (name: string, domain?: string) => {
  const cookieDomain = domain ? `domain=${domain};` : ''
  document.cookie = `${name}=DELETED;expires=Thu, 01 Jan 1970 00:00:00 UTC;${cookieDomain}path=/`
}

export let DEBUG_FLAG = false
export const setDebugFlag = (flag: boolean) => { DEBUG_FLAG = flag }
export const DBGCALL = (...args: any[]) => {
  if (DEBUG_FLAG || window._gta_debug) {
    console.info(...args)
  }
}

export enum CookieAbbr {
  userKey = 'uk',
  userProperty = 'up',
  preference = 'pf',
  dryRun = 'dr',
  cookieDomain = 'cd',
  referral = 'r',
  utm = 'utm',
}

declare global {
  const DEBUG: typeof DBGCALL

  interface Window {
    _gta_debug: boolean
  }
}
