BaseProvider = require './base'
Common       = require '../common'

module.exports =
class SensorsData extends BaseProvider
  name: 'sensorsdata'

  constructor: (account, script, track) ->
    return unless account

    para =
      name: 'sa'
      web_url: track
      server_url: account
      sdk_url: '//dn-st.teambition.net/sensorsdata/sensorsdata.latest.min.js'
      heatmap_url: '//dn-st.teambition.net/sensorsdata/heatmap.latest.min.js'

    Common.extend(para, JSON.parse(script || '{}'))

    window.sensorsDataAnalytic201505 = 'sa'

    window.sa = window.sa or (a) -> () ->
      window.sa._q = window.sa._q || []
      window.sa._q.push([a, arguments])

    funcs = [
      'track', 'quick', 'register', 'registerPage', 'registerOnce',
      'clearAllRegister', 'trackSignup',  'trackAbtest',  'setProfile',
      'setOnceProfile', 'appendProfile',  'incrementProfile',  'deleteProfile',
      'unsetProfile', 'identify', 'login', 'logout', 'trackLink', 'clearAllRegister'
    ]
    for func in funcs
      window.sa[func] = window.sa.call(null, func)

    unless window.sa._t
      script = BaseProvider.createScript para.sdk_url
      BaseProvider.loadScript script, 'sa', no
      window.sa?.para = para

    window.sa?.quick 'autoTrack'

  setUser: (id, raw_user) ->
    if /[a-fA-F0-9]{24}/.test(id)
      window.sa?.login(id)
      window.sa?.setProfile(raw_user)

  event: (gtaOptions) ->
    data = Common.extend {}, gtaOptions
    data.platform ?= 'web'
    normalizedAction = data.action
      .replace(/ /g, '_')
      .replace(/[^A-Za-z0-9_\$]/g, '')
    window.sa?.track(normalizedAction, data)
