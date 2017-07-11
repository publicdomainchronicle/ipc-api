var concat = require('concat-stream')
var http = require('http')
var parse = require('json-parse-errback')
var server = require('./server')
var tape = require('tape')

tape.test('GET /', function (test) {
  server(function (port, close) {
    http.get({port: port}, function (response) {
      test.equal(
        response.statusCode, 200,
        'responds 200'
      )
      test.equal(
        response.headers['content-type'], 'text/plain',
        'text/plain'
      )
      test.end()
      close()
    })
  })
})
