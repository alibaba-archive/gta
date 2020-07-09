BaseProvider = require './base'
Common       = require '../common'

module.exports =
class TBPanel extends BaseProvider
  name: 'tbpanel'

  loaded: false
  loadHandlers: []

  constructor: (account, scriptUrl, track, bootParams) ->
    return unless account
    scriptUrl or= '//g.alicdn.com/teambition-fe/static-files/tbpanel/generic.36b6.js'

    lib_name = 'tbpanel'
    window.TBPANEL_TRACK_URL = track if track
    tbpanel = window.tbpanel = []
    tbpanel._i = []

    tbpanel.init = (token, config, name) ->
      # support multiple tbpanel instances
      target = tbpanel
      if name?
        target = tbpanel[name] = []
      else
        name = lib_name

      # Pass in current people object if it exists
      target.people or= []

      target.toString = (no_stub) ->
        str = lib_name
        str += '.' + name if name isnt lib_name
        str += ' (stub)' unless no_stub
        return str

      target.people.toString = ->
        target.toString(1) + '.people (stub)'

      _set_and_defer = (target, fn) ->
        split = fn.split '.'
        if split.length is 2
          target = target[split[0]]
          fn = split[1]
        target[fn] = -> target.push [fn].concat Array::slice.call arguments

      functions = [
        'disable', 'track', 'track_pageview', 'track_links', 'track_forms', 'register',
        'register_once', 'alias', 'unregister', 'identify', 'name_tag', 'set_config',
        'people.set', 'people.set_once', 'people.increment', 'people.append',
        'people.track_charge', 'people.clear_charges', 'people.delete_user'
      ]

      _set_and_defer target, fn for fn in functions

      tbpanel._i.push [token, config, name]

    tbpanel.__SV = 1.2

    options = loaded: @handleTBPanelLoaded

    try
      bootParams = JSON.parse(bootParams)
      options = Common.extend(options, bootParams)
    catch e
      console.error e

    tbpanel.init account, options 
    script = BaseProvider.createScript scriptUrl
    BaseProvider.loadScript script, lib_name

  handleTBPanelLoaded: =>
    @loaded = yes
    while handler = @loadHandlers.shift()
      handler()
    return

  onLoad: (handler) ->
    if @loaded
      do handler
    else
      @loadHandlers.push handler
    return

  setUser: (id, raw_user) ->
    user = Common.extend {}, raw_user
    user.userKey = id if id
    window.tbpanel.register user
    # Teambition polyfill for desktop clients
    dc = navigator.userAgent.match /(Teambition(?:-UWP)?)\/([\d\.]+)/i
    if dc
      [ all, client, version ] = dc
      client = 'Teambition_Desktop' if client is 'Teambition'
      window.tbpanel.register
        $browser: client,
        $browser_version: version
    os = navigator.userAgent.match /Windows NT [\d.]+|(?:Macintosh;|Linux|\b\w*BSD)[^;)]*?(?=\)|;)/i
    window.tbpanel.register $os_version: os[0] if os

  event: (gtaOptions) ->
    data = Common.extend {}, gtaOptions
    data.platform ?= 'web'
    window.tbpanel?.track data.action, data

  login: (userId) ->
    @onLoad () ->
      host = window.tbpanel?.get_config('api_host')
      distinctid = window.tbpanel?.get_distinct_id()
      req = new XMLHttpRequest()
      req.open('GET', "#{host}/login?userkey=#{userId}&distinct_id=#{distinctid}")
      req.send()
