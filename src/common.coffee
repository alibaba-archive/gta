module.exports = Common = {}

GTA_CHECK_REGEX = /^\s*\{(.*)\}\s*$/
GTA_PARSE_REGEX = /[\s"']*([^:,"']+)[\s"']*:[\s"']*([^:,"']+)[\s"']*,?/g

Common.extend = (dest, source...) ->
  for arg in source
    for key, value of arg
      dest[key] = value
  return dest

Common.removeElement = (el) ->
  el.parentNode.removeChild el

# gta规则：
# gta两端由 引号、大括号包裹: "{}" 或 '{}'
# 大括号内部类似JSON的 {key: value}格式，不同的是key和value两端的引号可以省略，两端的空格会被省略,
# key 和 value 的值不可以包含： 冒号、逗号、单引号、双引号，
# e.g.  data-gta="{action: 'add content', 'page' : 'Project Page', type: task, control: tasks layout, 'method': double-click}"
Common.parseGta = (gtaString) ->
  return unless gtaString
  gtaString = GTA_CHECK_REGEX.exec(gtaString)?[1]
  return unless gtaString and gtaString.length

  gtaOptions = {}
  while it = GTA_PARSE_REGEX.exec gtaString
    [_, key, value] = it
    gtaOptions[key] = value
  return gtaOptions

# 根据属性为不同的 provider 提供不同类型的 super properties
Common.formatUser = (provider, user)->
  result = {}
  for key, value of user
    continue unless value
    continue if value.wlist? and provider.name not in value.wlist
    if value.alias?[provider.name]
      result[value.alias[provider.name]] = value.value
    else
      if Object::toString.call(value) is '[object Object]' and 'value' of value
        result[key] = value.value
      else
        result[key] = value
  return result
