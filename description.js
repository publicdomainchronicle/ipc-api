module.exports = function descriptionOf (array) {
  var start = array.findIndex(function (element) {
    return element.some(function (element) {
      return element
        .replace(/e\.g\./g, '')
        .replace(/i\.e\./g, '')
        .split('')
        .some(function (character) {
          return isLowerCase(character)
        })
    })
  })
  return array
    .slice(start)
    .map(function (element) {
      return element.join('; ')
    })
    .join(' / ')
}

function isLowerCase (char) {
  var code = char.charCodeAt(0)
  return code >= 97 && code <= 122
}
