module.exports = function parse (symbol) {
  var split = symbol.split(' ')[1].split('/')
  return {
    section: symbol[0],
    class: symbol.substr(1, 2),
    subclass: symbol[3],
    group: split[0],
    subgroup: split[1]
  }
}
