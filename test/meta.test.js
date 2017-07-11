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
        response.headers['content-type'], 'application/json',
        'application/json'
      )
      response.pipe(concat(function (body) {
        parse(body, function (error, parsed) {
          if (error) {
            test.error(error)
          } else {
            test.equal(
              typeof parsed.name, 'string',
              'name is string'
            )
            test.equal(
              typeof parsed.version, 'string',
              'version is string'
            )
          }
          test.end()
          close()
        })
      }))
    })
  })
})
