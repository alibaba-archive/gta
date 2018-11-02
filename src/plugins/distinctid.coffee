BasePlugin = require './base'

module.exports = class UTMDaemon extends BasePlugin
  name: 'distinct id synchronizer'

  constructor: (gta)->
    try
      if window.tbpanel and window.sa
        sa.quick 'isReady', ->
          tbpanel.identify(sa.store.getDistinctId())
    catch e
      console.error e if gta.debug or window._gta_debug
