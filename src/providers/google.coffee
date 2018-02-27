# Last updated at 2016-10-28

BaseProvider = require './base'

module.exports =
class Google extends BaseProvider
  name: 'google'

  constructor: (account) ->
    return unless account

    window.GoogleAnalyticsObject = 'ga'

    window.ga = ->
      window.ga.q.push arguments

    window.ga.q = []
    window.ga.l = 1 * new Date()

    script = BaseProvider.createScript '//www.google-analytics.com/analytics.js'
    BaseProvider.loadScript script, 'ga'

    window.ga 'create', account, 'auto'
    # window.ga 'require', 'displayfeatures'
    window.ga 'require', 'linkid', 'linkid.js'
    window.ga 'send', 'pageview'

  pageview: ->
    return unless window.ga
    args = Array::slice.call arguments
    data = if typeof args[0] is 'object' then args[0] else args.join '_'
    window.ga 'send', 'pageview', data

  event: (gtaOptions) ->
    return unless window.ga
    category = gtaOptions.page
    action = gtaOptions.action
    label = gtaOptions.type
    window.ga 'send', 'event', category, action, label
