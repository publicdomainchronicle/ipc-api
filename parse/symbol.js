module.exports = function (symbol) {
  return {
    section: symbol[0],
    class: parseInt(symbol.substr(1, 2)),
    subclass: symbol[3],
    group: parseInt(symbol.substr(4, 4)),
    // The string encoding for subgroups is bizarre.
    // For example:
    // ...421000 -> 421
    // ...100000 -> 10
    // ...010000 -> 1
    subgroup: symbol.endsWith('0'.repeat(4))
      ? parseInt(symbol.substr(8, 2))
      : parseInt(symbol.substr(8, 3))
  }
}
