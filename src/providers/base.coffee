Common = require '../common'

module.exports = class BaseProvider
  name: 'base'
  event: -> # virtual
  setUser: -> # virtual
  pageview: -> # virtual

BaseProvider.createScript = (src, id) ->
  script = document.createElement 'script'
  script.async = 1
  script.src = src
  script.id = id if id
  return script

BaseProvider.loadScript = (script, key, removeAfterLoad = yes) ->
  script.onerror = ->
    window[key] = null
    Common.removeElement script
  script.onload = ->
    if removeAfterLoad
      Common.removeElement script

  firstScript = document.getElementsByTagName('script')[0]
  firstScript.parentNode.insertBefore(script, firstScript)
