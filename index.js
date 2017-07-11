var fs = require('fs')
var fuzzysearch = require('fuzzysearch')
var multistream = require('multistream')
var ndjson = require('ndjson')
var path = require('path')
var pump = require('pump')
var through2 = require('through2')
var url = require('url')
var uuid = require('uuid').v4

var META = {
  name: require('./package.json').name,
  version: require('./package.json').version
}

var SCHEME = path.join(__dirname, 'data', 'ipc_scheme.json')
var CATCHWORDS = path.join(__dirname, 'data', 'ipc_catchwordindex.json')

module.exports = function (log, request, response) {
  request.log = log.child({request: uuid()})
  request.log.info(request, 'request')
  response.once('finish', function () {
    request.log.info(response, 'response')
  })

  var parsed = url.parse(request.url, true)
  if (parsed.pathname === '/') {
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify(META))
  } else if (parsed.pathname === '/classifications') {
    response.setHeader('Content-Type', 'text/plain')
    var search = parsed.query.search
    var first = true
    if (search) {
      pump(
        multistream([
          pump(
            fs.createReadStream(SCHEME),
            ndjson.parse(),
            through2.obj(function (chunk, _, done) {
              if (chunk[0].includes(search)) {
                separator(this)
                this.push('\t' + chunk[0])
              }
              done()
            })
          ),
          pump(
            fs.createReadStream(CATCHWORDS),
            ndjson.parse(),
            through2.obj(function (chunk, _, done) {
              if (fuzzysearch(search, chunk[0])) {
                separator(this)
                this.push(chunk[0] + '\t' + chunk[1].join(','))
              }
              done()
            })
          )
        ]),
        response
      )
    } else {
      pump(
        fs.createReadStream(SCHEME),
        ndjson.parse(),
        through2.obj(function (chunk, _, done) {
          separator(this)
          this.push(chunk[0])
          done()
        }),
        response
      )
    }
  } else {
    response.statusCode = 404
    response.end()
  }

  function separator (through) {
    if (first) {
      first = false
    } else {
      through.push('\n')
    }
  }
}
