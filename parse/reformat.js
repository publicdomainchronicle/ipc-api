var parseSymbol = require('./symbol')

module.exports = function reformat (string) {
  if (string.length === 14) {
    var parsed = parseSymbol(string)
    return (
      parsed.section + pad(parsed.class) + parsed.subclass + ' ' +
      parsed.group + '/' + pad(parsed.subgroup)
    )
  } else {
    return string
  }
}

function pad (argument) {
  var string = argument.toString()
  return string.length === 1
    ? ('0' + string)
    : string
}

