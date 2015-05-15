;((root, factory) ->
  'use strict';

  gta = factory()
  if typeof module is 'object' and typeof module.exports is 'object'
    module.exports = gta
  else if typeof define is 'function' and define.amd
    define(['jquery'], -> gta)
  else
    root.Gta = gta

)((if typeof window is 'object' then window else this), ->
  'use strict';

  slice = Array.prototype.slice
  $body = null

  removeElement = (el) ->
    el.parentNode.removeChild(el)

  checkScript = (script, key) ->
    script.onerror = ->
      window[key] = null
      removeElement(script)
    script.onload = ->
      removeElement(script)

  getScript = (src) ->
    script = document.createElement('script')
    scripts = document.getElementsByTagName('script')[0]
    script.async = 1
    script.src = src
    scripts.parentNode.insertBefore(script, scripts)
    return script

  gta = {
    setUserId: (id) ->
      try
        for provider in providers
          provider.setUserId?.apply(provider, id)
      catch e
      return this

    pageview: ->
      try
        for provider in providers
          provider.pageview.apply(provider, arguments)
      catch e
      return this

    event: ->
      try
        arguments[0] or= $body?.data('category') or 'gta'
        for provider in providers
          provider.event.apply(provider, arguments)
      catch e
      return this

    delegateEvents: ->
      return unless window.$
      $body = $('body')
      $(document).off('.gta').on('click.gta', '[data-gta="event"]', (e) =>
        $target = $(e.currentTarget)
        category = $target.data('category')
        unless category
          category = $target.closest('[data-category]').data('category')
        action = $target.data('action') or e.type
        label = $target.data('label')
        value = parseInt($target.data('value'))
        @event(category, action, label, value)
      )

  }

  Providers = {
    google: (account) ->
      return unless account
      window.GoogleAnalyticsObject = '_ga';
      window._ga = ->
        _ga.q.push(arguments)

      _ga.q = []
      _ga.l = 1 * new Date()
      _ga('create', account, 'auto')
      _ga('require', 'displayfeatures')
      _ga('require', 'linkid', 'linkid.js')
      _ga('send', 'pageview')
      script = getScript('//www.google-analytics.com/analytics.js')
      checkScript(script, '_ga')

      return {
        name: 'google'
        pageview: ->
          return unless window._ga
          args = slice.call(arguments)
          data = if typeof args[0] is 'object' then args[0] else args.join('_')
          window._ga('send', 'pageview', data)

        event: (category, action, label, value) ->
          return unless window._ga
          args = ['send', 'event', category, action, label]
          args.push(+value) if value > 0
          window._ga.apply(null, args)
      }

    baidu: (account) ->
      return unless account
      window._hmt = []
      script = getScript("//hm.baidu.com/hm.js?#{account}")
      checkScript(script, '_hmt')

      return {
        name: 'baidu'
        pageview: ->
          return unless window._hmt
          args = slice.call(arguments)
          if typeof args[0] == 'object'
            data = args[0].page
            unless data
              data = []
              for key, val of args[0]
                data.push(val)
              data = data.join('_')
          else
            data = args.join('_')
          window._hmt.push(['_trackPageview', data])

        event: (category, action, label, value) ->
          return unless window._hmt
          args = ['_trackEvent', category, action, label]
          args.push(+value) if value > 0
          window._hmt.push(args)
      }

    piwik: (account) ->
      return unless account
      url = '//piwik.teambition.com'
      window._paq = [
        ['trackPageView'],
        ['enableLinkTracking'],
        ['setTrackerUrl', "#{url}/piwik.php"],
        ['setSiteId', account]
      ]
      script = getScript("#{url}/piwik.js")
      checkScript(script, '_paq')

      return {
        name: 'piwik'
        setUserId: (id) ->
          return unless window._paq
          window._paq.push(['setUserId', id])

        pageview: ->
          return unless window._paq
          args = slice.call(arguments)
          if typeof args[0] == 'object'
            data = args[0].page
            unless data
              data = []
              for key, val of args[0]
                data.push(val)
              data = data.join('_')
          else
            data = args.join('_')
          window._paq.push(['trackPageView', data])

        event: (category, action, label, value) ->
          return unless window._paq
          args = ['trackEvent', category, action, label]
          args.push(+value) if value > 0
          window._paq.push(args)

      }

  }

  element = document.getElementById('gta-main')
  providers = gta.providers = []

  return gta unless element

  for name, Provider of Providers
    account = element.getAttribute("data-#{name}")
    if account and provider = Provider(account)
      providers.push(provider)

  gta.delegateEvents()
  removeElement(element)
  return gta

)
