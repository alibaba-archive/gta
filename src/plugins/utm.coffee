BasePlugin = require './base'

UTM_TAG_REGEX = /utm_(\w+)=([^&]*)&?/ig

module.exports = class UTMDaemon extends BasePlugin
  name: 'utm daemon'

  constructor: (gta)->
    try
      utm = {}
      while match = UTM_TAG_REGEX.exec window.location.search
        [ part, key, value ] = match
        utm[key] = value
      encodedUTM = encodeURI(JSON.stringify(utm))
      domain = ".#{/\.?([\w\-]+\.\w+)$/.exec(window.location.hostname)[1]}"
      monthLater = new Date(Date.now() + 2592000000).toGMTString()  # 1000 * 60 * 60 * 24 * 30
      if part
        document.cookie = "utm=#{encodedUTM};expires=#{monthLater};domain=#{domain};path=/"
    catch e
      console.error e if gta.debug or window._gta_debug
