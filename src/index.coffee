((root, factory) ->
  'use strict'

  gta = factory()
  if typeof module is 'object' and typeof module.exports is 'object'
    module.exports = gta
  else if typeof define is 'function' and define.amd
    define(['jquery'], -> gta)
  else
    root.Gta = gta

)((if typeof window is 'object' then window else this), ->
  'use strict'

  slice = Array.prototype.slice
  $body = null
  newGtaReg = /^\s*\{(.*)\}\s*$/

  removeElement = (el) ->
    el.parentNode.removeChild(el)

  checkScript = (script, key) ->
    script.onerror = ->
      window[key] = null
      removeElement(script)
    script.onload = ->
      # do not remove script attriubte if src of script is customer.io
      removeElement(script) unless script.getAttribute('data-site-id')

  getScript = (src, id) ->
    script = document.createElement('script')
    scripts = document.getElementsByTagName('script')[0]
    script.async = 1
    script.src = src
    script.id = id if id
    scripts.parentNode.insertBefore(script, scripts)
    return script

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

        event: (gtaOptions) ->
          return unless window._ga
          category = gtaOptions.page
          action = gtaOptions.action
          label = gtaOptions.type
          args = ['send', 'event', category, action, label]
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

        event: (gtaOptions) ->
          return unless window._hmt
          category = gtaOptions.page
          action = gtaOptions.action
          label = gtaOptions.type
          args = ['_trackEvent', category, action, label]
          window._hmt.push(args)
      }

    mixpanel: (account) ->
      return unless account
      lib_name = 'mixpanel';
      window.mixpanel = [];
      mixpanel._i = [];

      mixpanel.init = (token, config, name) ->
        # support multiple mixpanel instances
        target = mixpanel
        if name?
          target = mixpanel[name] = []
        else
          name = lib_name;

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
          split = fn.split('.')
          if split.length is 2
            target = target[split[0]]
            fn = split[1]

          target[fn] = ->
            target.push([fn].concat(slice.call(arguments)))

        functions = [
          'disable', 'track', 'track_pageview', 'track_links', 'track_forms', 'register',
          'register_once', 'alias', 'unregister', 'identify', 'name_tag', 'set_config',
          'people.set', 'people.set_once', 'people.increment', 'people.append',
          'people.track_charge', 'people.clear_charges', 'people.delete_user'
        ]

        for fn in functions
          _set_and_defer(target, fn)

        mixpanel._i.push([token, config, name])

      mixpanel.__SV = 1.2
      mixpanel.init(account)
      script = getScript('//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js')
      checkScript(script, lib_name)

      return {
        name: 'mixpanel'
        pageview: ->
          # Mixpanel does not support pageview

        event: (gtaOptions) ->
          data = gtaOptions
          data.platform = 'web'
          window.mixpanel?.track(data.action, data)
      }

    # customer.io
    customer: (account) ->
      return unless account
      initCustomer = (id) ->
        _cio = window._cio = window._cio or []
        _cio.invoked = true
        _cio.methods = [
          'trackSubmit', 'trackClick', 'trackLink', 'trackForm',
          'pageview', 'reset', 'group', 'ready', 'alias', 'page',
          'once', 'off', 'on', 'load', 'identify', 'sidentify', 'track'
        ]
        _cio.factory = (method) ->
          return ->
            _cio.push([method].concat(Array.prototype.slice.call(arguments, 0)))
            return _cio

        for method in _cio.methods
          _cio[method] = _cio.factory(method)

        accounts = account.split(',')
        # teambition polyfill
        # if use Teambition as userid pick the first one [customer env=2015]
        # use email as userid pick the second one [customer env=2016]
        if id?.indexOf('@') > 0
          _account = accounts[1]
        else
          _account = accounts[0]
        script = getScript '//assets.customer.io/assets/track.js', 'cio-tracker'
        script.setAttribute 'data-site-id', _account
        checkScript script, '_cio'

      return {
        name: 'customer'
        setUser: (id, user) ->
          initCustomer(id)
          window._cio?.identify({
            id: id,
            name: user.name,
            email: user.email,
            created_at: Math.floor(new Date(user.createdAt).valueOf() / 1000),
            language: user.language
          })

        pageview: (data) ->
          # customer.io pageviews are tracking by the javascript snippet above
          # For Detail: https://customer.io/docs/pageviews.html

        event: (gtaOptions) ->
          return unless account
          data = gtaOptions
          data.platform = 'web'
          window._cio?.track(data.action, data)
      }

    fullstory: (account) ->
      return unless account

      _fullstory = window.FS = (id, user) ->
        if _fullstory.q
          _fullstory.q.push(arguments)
        else
          _fullstory._api(id, user)

      _fullstory.q = []
      _fs_debug = window._fs_debug = window._fs_debug or false
      _fs_host = window._fs_host = window._fs_host or 'www.fullstory.com'
      _fs_org = window['_fs_org'] = account

      script = getScript("https://#{_fs_host}/s/fs.js")
      checkScript(script)

      _fullstory.identify = (id, user) ->
        _fullstory('user', {uid: id})
        if user then _fullstory('user', user)

      _fullstory.setUserVars = (user) ->
        _fullstory('user', user)

      _fullstory.identifyAccount = (id, user = {}) ->
        user.acctId = id
        _fullstory('account', user)

      return {
        name: 'fullstory'
        setUser: (id, user) ->
          _fullstory.identify(id, user)
      }
  }

  initGta = ->
    element = document.getElementById('gta-main')
    providers = gta.providers = []

    return gta unless element

    for name, Provider of Providers
      account = element.getAttribute("data-#{name}")
      scriptUrl = element.getAttribute("data-#{name}-script")
      trackUrl = element.getAttribute("data-#{name}-track")
      randomProportion = element.getAttribute("data-#{name}-random-proportion")

      continue if randomProportion and Math.random() > randomProportion

      if account and provider = Provider(account, scriptUrl, trackUrl)
        providers.push(provider)

    gta.delegateEvents()
    removeElement(element)
    return providers

  providers = []

  gta = {
    debug: false

    page: ''

    setCurrentPage: (page) ->
      this.page = page
      return this

    setUser: (id, user) ->
      try
        providers = initGta()
        for provider in providers
          provider.setUser?.call(provider, id, user)
      catch e
      return this

    pageview: ->
      try
        for provider in providers
          provider.pageview.apply(provider, arguments)
      catch e
      return this

    event: (gtaOptions) ->
      try
        # new rules
        isObject = typeof gtaOptions is 'object' and !!gtaOptions
        if isObject
          gtaOptions.page or= this.page
          if this.debug
            console.log('gtaOptions: ', gtaOptions)
          for provider in providers
            provider.event?(gtaOptions)
      catch e
      return this

    delegateEvents: ->
      return unless window.$
      $body = $('body')
      $(document).off('.gta').on('click.gta', '[data-gta]', (e) =>
        $target = $(e.currentTarget)
        gtaString = $target.data('gta')
        # new gta rule
        if newGtaReg.test(gtaString)
          gtaOptions = @parseGta(gtaString)
          @event(gtaOptions)
        return this
      )

    # 新gta规则：
    # gta两端由 引号、大括号包裹: "{}" 或 '{}'
    # 大括号内部类似JSON的 {key: value}格式，不同的是key和value两端的引号可以省略，两端的空格会被省略,
    # key 和 value 的值不可以包含： 冒号、逗号、单引号、双引号，
    # e.g.  data-gta="{action: 'add content', 'page' : 'Project Page', type: task, control: tasks layout, 'method': double-click}"
    parseGta: (gtaString) ->
      gtaString = newGtaReg.exec(gtaString)[1]
      return unless gtaString.length
      reg = /[\s"']*([^:,"']+)[\s"']*:[\s"']*([^:,"']+)[\s"']*,?/g
      gtaOptions = {}
      while it = reg.exec(gtaString)
        key = it[1]
        value = it[2]
        gtaOptions[key] = value
      return gtaOptions
  }

  return gta

)
