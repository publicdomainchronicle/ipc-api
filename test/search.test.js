var concat = require('concat-stream')
var http = require('http')
var parse = require('json-parse-errback')
var server = require('./server')
var tape = require('tape')

tape.test('GET /classifications?search={subgroup catchword}', function (test) {
  server(function (port, close) {
    http.get({
      port: port,
      path: (
        '/classifications' +
        '?search=' + encodeURIComponent('ball-point pens')
      )
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
        test.assert(
          items.some(function (element) {
            return element.endsWith('B43K 7/00')
          }),
          'includes B43K 7/00'
        )
        test.end()
        close()
      }))
    })
  })
})

tape.test('GET /classifications?search={subclass catchword}', function (test) {
  server(function (port, close) {
    http.get({
      port: port,
      path: (
        '/classifications' +
        '?search=' + encodeURIComponent('measuring acceleration')
      )
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
        test.assert(
          items.some(function (element) {
            return element.includes('G01P 15/00')
          }),
          'includes G01P 15/00'
        )
        test.end()
        close()
      }))
    })
  })
})

tape.test('GET /classifications?search={IPC prefix}', function (test) {
  server(function (port, close) {
    http.get({
      port: port,
      path: (
        '/classifications' +
        '?search=' + encodeURIComponent('B43K')
      )
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
        test.assert(
          items.some(function (element) {
            return element.endsWith('B43K 7/00')
          }),
          'includes B43K 7/00'
        )
        test.end()
        close()
      }))
    })
  })
})

tape.test('GET /classifications?prefix=', function (test) {
  server(function (port, close) {
    http.get({
      port: port,
      path: (
        '/classifications' +
        '?search=' + encodeURIComponent('B43K')
      )
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
        test.assert(
          items.some(function (element) {
            return element.endsWith('B43K 7/00')
          }),
          'includes B43K 7/00'
        )
        test.assert(
          items.length > 100,
          'services >100 IPCs'
        )
        test.end()
        close()
      }))
    })
  })
})
