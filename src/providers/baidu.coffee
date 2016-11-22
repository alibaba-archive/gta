# Last updated at 2016-10-27

BaseProvider = require './base'
Common       = require '../common'

module.exports =
class Baidu extends BaseProvider
  name: 'baidu'

  constructor: (account) ->
    return unless account
    window._hmt = window._hmt || []
    script = BaseProvider.createScript "//hm.baidu.com/hm.js?#{account}"
    BaseProvider.loadScript script, '_hmt'

  pageview: ->
    return unless window._hmt
    args = Array::slice.call arguments
    if typeof args[0] is 'object'
      data = args[0].page
      unless data
        data = (val for key, val of args[0]).join '_'
    else
      data = args.join '_'
    window._hmt.push ['_trackPageview', data]

  event: (gtaOptions) ->
    return unless window._hmt
    category = gtaOptions.page or ''
    action = gtaOptions.action or ''
    label = gtaOptions.type or ''
    window._hmt.push ['_trackEvent', category, action, label]
