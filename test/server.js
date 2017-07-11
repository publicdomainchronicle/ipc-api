var devNull = require('dev-null')
var handler = require('../')
var http = require('http')
var pino = require('pino')

module.exports = function (callback) {
  var log = pino({}, devNull())
  var server = http.createServer(function (request, response) {
    handler(log, request, response)
  })
  server.listen(0, function () {
    callback(this.address().port, function () {
      server.close()
    })
  })
}
