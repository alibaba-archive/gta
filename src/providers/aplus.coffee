BaseProvider = require './base'
Common       = require '../common'

module.exports =
class Aplus extends BaseProvider
  name: 'aplus'

  constructor: (@account) ->
    script = document.createElement('script')
    script.type = 'text/javascript'
    script.id = 'beacon-aplus'
    script.src = '//g.alicdn.com/alilog/mlog/aplus_v2.js'
    script.setAttribute('exparams', 'clog=o&aplus&sidx=aplusSidx&ckx=aplusCkx')
    script.async = true
    script.defer = true

    # 部署位置原则上在body标签之后, 越靠前越好, 最好是body内第一行
    body = document.getElementsByTagName('body')[0]
    body.insertBefore(script, body.firstChild)

  event: (gtaOptions) ->
    for property, value of gtaOptions
      gokeys.push "#{property}=#{value}"

    gokey = gokeys.join('-')

    window.goldlog?.record(@account, 'CLK', gokey, 'GET')
