BasePlugin = require './base'

COOKIE_TEST_REGEX = /(^|;\s?)referral=(\S+);/i

module.exports = class ReferralDaemon extends BasePlugin
  name: 'referral daemon'

  constructor: (gta)->
    try
      if document.referrer and not COOKIE_TEST_REGEX.test(document.cookie)
        $parser = document.createElement('a')
        $parser.href = document.referrer
        referral =
          domain: $parser.hostname.slice(0, 100)
          path: $parser.pathname.slice(0, 100)
          query: $parser.search.slice(0, 100)
          hash: $parser.hash.slice(0, 100)
        encodedReferral = encodeURI(JSON.stringify(referral))
        domain = ".#{/\.?([\w\-]+\.\w+)$/.exec(window.location.hostname)[1]}"
        monthLater = new Date(Date.now() + 2592000000).toGMTString()  # 1000 * 60 * 60 * 24 * 30
        document.cookie = "referral=#{encodedReferral};expires=#{monthLater};domain=#{domain};path=/"
    catch e
      console.error e if gta.debug or window._gta_debug
