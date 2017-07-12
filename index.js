var flushWriteStream = require('flush-write-stream')
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

// The JSON file with scheme data is about 30MB on disk.
// Load just the codes for all IPC subgroup codes into
// memory immediately. If requests come in before the list
// is loaded, stick them in a queue to call back later.
var IPCS
var tmp = []
var queue = []

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
      queue = undefined
    }
  }
)

// Calls back with an array of all IPC subgroup codes,
// queueing the callback if the data hasn't been read yet.
function allIPCS (callback) {
  if (IPCS) {
    setImmediate(function () {
      callback(null, IPCS)
    })
  } else {
    queue.push(callback)
  }
}

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
      var prefix = parsed.query.prefix.toUpperCase()
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
      var search = parsed.query.search.toLowerCase()
      var count = 0
      pump(
        multistream(function (ready) {
          count++
          if (count === 1) {
            allIPCS(function (error, ipcs) {
              if (error) {
                ready(error)
              } else {
                ready(null, pump(
                  fs.createReadStream(CATCHWORDS),
                  ndjson.parse(),
                  through2.obj(function (chunk, _, done) {
                    if (fuzzysearch(search, chunk[0])) {
                      separator(this)
                      this.push(
                        chunk[0] + '\t' +
                        chunk[1]
                          .reduce(function (list, ipc) {
                            if (ipc.includes(' ')) {
                              return list.concat(ipc)
                            } else {
                              return list.concat(
                                ipcs.filter(function (otherIPC) {
                                  return otherIPC.startsWith(ipc)
                                })
                              )
                            }
                          }, [])
                          .join(',')
                      )
                    }
                    done()
                  })
                ))
              }
            })
          } else if (count === 2) {
            var lower = search.toLowerCase()
            var upper = search.toUpperCase()
            ready(null, pump(
              fs.createReadStream(SCHEME),
              ndjson.parse(),
              through2.obj(function (chunk, _, done) {
                var description = chunk[1]
                  .map(function (element) {
                    return element.join('; ')
                  })
                  .join(': ')
                  .toLowerCase()
                if (
                  fuzzysearch(lower, description) ||
                  chunk[0].indexOf(upper) !== -1
                ) {
                  separator(this)
                  this.push(
                    chunk[0] + '\t' +
                    description
                  )
                }
                done()
              })
            ))
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
