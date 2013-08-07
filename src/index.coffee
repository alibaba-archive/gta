exports = exports or this

class Gta

  constructor: (options) ->
    @options = options
    @providers = {}
    for provider, option of options
      Provider = Gta["#{provider[0].toUpperCase()}#{provider[1..]}"]
      if Provider?
        @providers[provider] = new Provider(option)

  pageview: ->
    for name, provider of @providers
      provider.pageview.apply(provider, arguments)
    return this

  event: ->
    for name, provider of @providers
      provider.event.apply(provider, arguments)
    return this

  @appendScript: (script) ->
    dom = document.createElement('script')
    text = document.createTextNode(script)
    dom.appendChild(text)
    head = document.getElementsByTagName('head')[0]
    head.appendChild(dom)

  class @Base

    constructor: (option) ->
      @option = option
      @option.account = option.account or ''
      @_q = @_initial()

    _initial: ->

    pageview: ->
      args = for i, val of arguments
        val
      @_q.push(['_trackPageview', args.join('_')])
      return this

    event: ->
      args = for i, val of arguments
        val
      @_q.push(['_trackEvent', args[0], args[1], args[2..].join('_')])

  class @Google extends @Base

    constructor: (option) ->
      super
      @_q.push(['_setDomainName', @option.domain]) if @option.domain?

    _initial: ->
      unless window._gaq?
        Gta.appendScript("""
          var _gaq = _gaq || [];
          _gaq.push(['_setAccount', '#{@option.account}']);
          _gaq.push(['_trackPageview']);
          (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
          })();
        """)
      return window._gaq

  class @Baidu extends @Base

    constructor: (option) ->
      super

    _initial: ->
      unless window._hmt?
        Gta.appendScript("""
          var _hmt = _hmt || [];
          _hmt.push(['_setAccount', '#{@option.account}']);
        """)
      return window._hmt


exports.Gta = Gta