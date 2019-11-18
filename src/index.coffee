Common    = require 'common'
Plugins   = require 'plugins'
Providers = require 'providers'

class GTA
  debug: no
  plugins: []
  providers: []
  mixPayload: {}
  actionMap: {} 

  version: '1.1.5'

  constructor: ->
    return if typeof document is 'undefined'
    $el = document.getElementById 'gta-main'
    return unless $el
    @delegateEvents()
    @preloadActions($el)

  init: ->
    return if typeof document is 'undefined'
    $el = document.getElementById 'gta-main'
    return unless $el

    for own name, Provider of Providers
      @registerProvider name, Provider, $el

    for own name, Plugin of Plugins
      @registerPlugin Plugin

    Common.removeElement $el

  initXhr: (url) -> 
    xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.send()
    return xhr

  preloadActions: ($el) -> 
    url = $el.getAttribute 'data-tbtracking'
    return unless url
    xhr = @initXhr(url)
    xhr.onreadystatechange = () => 
      if xhr.readyState is 4 and xhr.status is 200
        actions = JSON.parse(xhr.response)
        for item in actions
          @actionMap[item.hash] = (@actionMap[item.hash] or []).concat(item)

  registerProperty: (key, value)->
    @mixPayload[key] = value
    return this

  unregisterProperty: (key) ->
    delete @mixPayload[key]
    return this

  registerProvider: (name, Provider, $el = document.getElementById('gta-main')) ->
    return false if not $el

    account = $el.getAttribute "data-#{name}"
    scriptUrl = $el.getAttribute "data-#{name}-script"
    trackUrl = $el.getAttribute "data-#{name}-track"
    randomProportion = $el.getAttribute "data-#{name}-random-proportion"

    return true if randomProportion and do Math.random > randomProportion

    if account
      @providers.push new Provider account, scriptUrl, trackUrl
      return true

    return false

  registerPlugin: (Plugin) ->
    plugin = new Plugin this
    @plugins.push plugin
    return plugin

  setCurrentPage: (page) ->
    @registerProperty('page', page)

  setUser: (id, user, turnOff) ->
    return this if turnOff

    try
      @init()
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

  login: (userId) ->
    try
      for provider in @providers
        provider.login?.apply provider, arguments
    catch e
    return this

  logout: ->
    try
      for provider in @providers
        provider.logout?.apply provider, arguments
    catch e
    return this

  event: (gtaOptions) ->
    try
      if typeof gtaOptions is 'object' and !!gtaOptions
        gtaOptions.method or= 'click'
        gtaOptions = Common.extend {}, @mixPayload, gtaOptions
        for plugin in @plugins
          gtaOptions = plugin.onGTAEvent?(gtaOptions)
          unless gtaOptions
            console.info 'An event was filtered by plugin:', plugin.name if @debug or window._gta_debug
            return this
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
          gtaHash = el.dataset?.gtaHash

          if gtaOptions and (!gtaIgnore or matches(e.target, gtaIgnore))
            @event gtaOptions
          
          if gtaHash
            actions = @actionMap[gtaHash] or []
            for action in actions
              @event Common.pick action, ['action', 'type', 'control']

          el = el.parentElement
      , 0
    document.body.addEventListener 'click', listener, true

module.exports = new GTA()
