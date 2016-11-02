# Last updated at 2016-10-28

BaseProvider = require './base'
Common       = require '../common'

module.exports =
class CustomerIO extends BaseProvider
  name: 'customer.io'

  constructor: (@account) ->

  initCustomer: (id) ->
    _cio = window._cio = window._cio or []
    _cio.invoked = true
    _cio.methods = [
      'trackSubmit', 'trackClick', 'trackLink', 'trackForm',
      'pageview', 'reset', 'group', 'ready', 'alias', 'page',
      'once', 'off', 'on', 'load', 'identify', 'sidentify', 'track'
    ]
    _cio.factory = (method) ->
      return ->
        _cio.push [method].concat Array.prototype.slice.call arguments
        return _cio

    _cio[method] = _cio.factory method for method in _cio.methods

    accounts = @account.split ','
    # teambition polyfill
    # if use Teambition as userid pick the first one [customer env=2015]
    # use email as userid pick the second one [customer env=2016]
    _account = if id?.indexOf('@') > 0 then accounts[1] else accounts[0]

    script = BaseProvider.createScript '//assets.customer.io/assets/track.js', 'cio-tracker'
    script.setAttribute 'data-site-id', _account
    BaseProvider.loadScript script, '_cio', false

  setUser: (id, raw_user) ->
    return unless @account
    user = Common.extend {}, raw_user
    user.id = id
    # teambition polyfill
    # For user created later than 2016, use email as user id
    if new Date(user.created_at) >= new Date('2016-01-01')
      user.id = user.email
    user.created_at = Math.floor(new Date(user.created_at).valueOf() / 1000)
    @initCustomer user.id
    window._cio?.identify user

  pageview: (data) ->
    # customer.io pageviews are tracking by the javascript snippet above
    # For Detail: https://customer.io/docs/pageviews.html

  event: (gtaOptions) ->
    return unless @account
    window._cio?.track gtaOptions.action, gtaOptions
