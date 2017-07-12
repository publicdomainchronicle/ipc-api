var concat = require('concat-stream')
var http = require('http')
var parse = require('json-parse-errback')
var server = require('./server')
var tape = require('tape')

tape.test('GET /classifications', function (test) {
  server(function (port, close) {
    http.get({
      port: port,
      path: '/classifications'
    }, function (response) {
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

tape.test('GET /classifications?limit', function (test) {
  server(function (port, close) {
    http.get({
      port: port,
      path: '/classifications?limit=10'
    }, function (response) {
      test.equal(
        response.statusCode, 200,
        'responds 200'
      )
      test.equal(
        response.headers['content-type'], 'text/plain',
        'text/plain'
      )
      response.pipe(concat(function (body) {
        var items = body
          .toString()
          .split('\n')
        test.equal(
          items.length, 10,
          'serves 10'
        )
        test.end()
        close()
      }))
    })
  })
})
