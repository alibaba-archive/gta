# Last updated at 2016-10-28

BaseProvider = require './base'
Common       = require '../common'

module.exports =
class Fullstory extends BaseProvider
  name: 'fullstory'

  constructor: (account)->
    return unless account

    _fullstory = window.FS = (id, user) ->
      if _fullstory.q
        _fullstory.q.push arguments
      else
        _fullstory._api id, user

    _fullstory.q = []
    _fs_debug = window._fs_debug = window._fs_debug or false
    _fs_host = window._fs_host = window._fs_host or 'www.fullstory.com'
    _fs_org = window._fs_org = account

    script = BaseProvider.createScript "https://#{_fs_host}/s/fs.js"
    BaseProvider.loadScript script

    _fullstory.identify = (id, user) ->
      _fullstory 'user', uid: id
      _fullstory 'user', user if user

    _fullstory.setUserVars = (user) ->
      _fullstory 'user', user

    _fullstory.identifyAccount = (id, user = {}) ->
      user.acctId = id
      _fullstory 'account', user

    _fullstory.clearUserCookie = (identified_only) ->
      if not identified_only or document.cookie.match('fs_uid=[`;`]*`[`;`]*`[`;`]*`')
        domain = document.domain
        while true
          document.cookie = 'fs_uid=;domain=' + domain + ';path=/;expires=' + new Date(0)
          index = domain.indexOf('.')
          break if index < 0
          domain = domain.slice index + 1

  setUser: (id, raw_user) ->
    user = Common.extend {}, raw_user
    for k, v of user when not /(^(displayName|email)$)|(.*_(str|int|real|date|bool)$)/.test k
      delete user[k]
    user.displayName = id                     # We don't log sensetive data
    user.email = "#{id}@mail.teambition.com"  # We don't log sensetive data
    window.FS.identify id, user
