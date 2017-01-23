Common    = require 'common'
Plugins   = require 'plugins'
Providers = require 'providers'

class GTA
  debug: no
  plugins: []
  providers: []
  mixPayload: {}

  version: '1.0.2'

  constructor: ->
    $el = document.getElementById 'gta-main'
    return unless $el

    for name, Provider of Providers
      account = $el.getAttribute "data-#{name}"
      scriptUrl = $el.getAttribute "data-#{name}-script"
      trackUrl = $el.getAttribute "data-#{name}-track"
      randomProportion = $el.getAttribute "data-#{name}-random-proportion"

      continue if randomProportion and do Math.random > randomProportion

      if account
        @providers.push new Provider account, scriptUrl, trackUrl

    for name, Plugin of Plugins
      @plugins.push new Plugin this

    @delegateEvents()
    Common.removeElement $el

  registerProperty: (key, value)->
    @mixPayload[key] = value
    return this

  unregisterProperty: (key) ->
    delete @mixPayload[key]
    return this

  registerPlugin: (Plugin) ->
    @plugins.push new Plugin this

  setCurrentPage: (page) ->
    @registerProperty('page', page)

  setUser: (id, user) ->
    try
      for provider in @providers
        formattedUser = Common.formatUser provider, user
        if @debug or window._gta_debug
          console.log 'formatUser', provider.name, formattedUser
        provider.setUser?.call provider, id, formattedUser
    catch e
      console.error e if @debug or window._gta_debug
    return this

  pageview: ->
    try
      for provider in @providers
        provider.pageview?.apply provider, arguments
    catch e
    return this

  event: (gtaOptions) ->
    try
      if typeof gtaOptions is 'object' and !!gtaOptions
        gtaOptions.method or= 'click'
        gtaOptions = Common.extend {}, @mixPayload, gtaOptions
        for plugin in @plugins
          gtaOptions = plugin.onGTAEvent?(gtaOptions)
        console.log 'GTA options: ', gtaOptions if @debug or window._gta_debug
        for provider in @providers
          try
            provider.event? gtaOptions
          catch ee
            console.trace "error on gta provider: #{provider.name}, #{ee}" if @debug or window._gta_debug
    catch e
      console.trace "error on gta event: #{e}" if @debug or window._gta_debug
    return this

  delegateEvents: ->
    matches = (el, selector) ->
      (el.matches || el.matchesSelector ||
       el.msMatchesSelector || el.mozMatchesSelector ||
       el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector)
    listener = (e) =>
      window.setTimeout =>
        el = e.target
        while el
          gtaString = el.dataset?.gta
          gtaIgnore = el.dataset?.gtaIgnore
          gtaOptions = Common.parseGta gtaString
          if gtaOptions and (!gtaIgnore or matches(e.target, gtaIgnore))
            @event gtaOptions
          el = el.parentElement
      , 0
    document.body.addEventListener 'click', listener, true

module.exports = new GTA()
