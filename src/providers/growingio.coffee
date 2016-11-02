# Last updated at 2016-10-28

BaseProvider = require './base'

module.exports =
class GrowingIO extends BaseProvider
  name: 'growingio'

  constructor: (account) ->
    return unless account
    _vds = _vds or []
    window._vds = _vds
    _vds.push ['setAccountId', account]
    script = BaseProvider.createScript (if 'https:' is document.location.protocol then 'https://' else 'http://') + 'dn-growing.qbox.me/vds.js'
    BaseProvider.loadScript script
