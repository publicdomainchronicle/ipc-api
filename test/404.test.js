var http = require('http')
var server = require('./server')
var tape = require('tape')

tape.test('GET /nonexistent', function (test) {
  server(function (port, close) {
    http.get({
      port: port,
      path: '/nonexistent'
    }, function (response) {
      test.equal(
        response.statusCode, 404,
        'responds 404'
      )
      test.end()
      close()
    })
  })
})
