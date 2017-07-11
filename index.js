var flushWriteStream = require('flush-write-stream')
var from2Array = require('from2-array')
var fs = require('fs')
var fuzzysearch = require('fuzzysearch')
var multistream = require('multistream')
var ndjson = require('ndjson')
var path = require('path')
var pump = require('pump')
var through2 = require('through2')
var url = require('url')
var uuid = require('uuid').v4

var META = (
  require('./package.json').name + ' ' +
  require('./package.json').version
)

var SCHEME = path.join(__dirname, 'data', 'ipc_scheme.json')
var CATCHWORDS = path.join(__dirname, 'data', 'ipc_catchwordindex.json')

var IPCS
var queue = []

function allIPCS (callback) {
  if (IPCS) {
    setImmediate(function () {
      callback(null, IPCS)
    })
  } else {
    queue.push(callback)
  }
}

var tmp = []
pump(
  fs.createReadStream(SCHEME),
  ndjson.parse(),
  flushWriteStream.obj(function (chunk, _, done) {
    tmp.push(chunk[0])
    done()
  }),
  function (error) {
    if (error) {
      process.exit(1)
    } else {
      IPCS = tmp
      queue.forEach(function (callback) {
        setImmediate(function () {
          callback(null, IPCS)
        })
      })
    }
  }
)

module.exports = function (log, request, response) {
  request.log = log.child({request: uuid()})
  request.log.info(request, 'request')
  response.once('finish', function () {
    request.log.info(response, 'response')
  })

  var parsed = url.parse(request.url, true)
  if (parsed.pathname === '/') {
    response.setHeader('Content-Type', 'text/plain')
    response.end(META)
  } else if (parsed.pathname === '/classifications') {
    response.setHeader('Content-Type', 'text/plain')
    var first = true
    if (parsed.query.prefix) {
      var prefix = parsed.query.prefix
      allIPCS(function (error, ipcs) {
        if (error) {
          response.statusCode = 500
          response.end()
        } else {
          response.end(
            ipcs
              .filter(function (ipc) {
                return ipc.startsWith(prefix)
              })
              .join('\n')
          )
        }
      })
    } else if (parsed.query.search) {
      var search = parsed.query.search
      var count = 0
      pump(
        multistream(function (ready) {
          count++
          if (count === 1) {
            ready(null, pump(
              fs.createReadStream(CATCHWORDS),
              ndjson.parse(),
              through2.obj(function (chunk, _, done) {
                if (fuzzysearch(search, chunk[0])) {
                  separator(this)
                  this.push(chunk[0] + '\t' + chunk[1].join(','))
                }
                done()
              })
            ))
          } else if (count === 2) {
            allIPCS(function (error, ipcs) {
              if (error) {
                ready(error)
              } else {
                ready(null, pump(
                  from2Array.obj(ipcs),
                  through2.obj(function (chunk, _, done) {
                    if (chunk.includes(search)) {
                      separator(this)
                      this.push('\t' + chunk)
                    }
                    done()
                  })
                ))
              }
            })
          } else {
            ready(null, null)
          }
        }),
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
