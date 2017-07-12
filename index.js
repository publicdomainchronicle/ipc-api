var fuzzysearch = require('fuzzysearch')
var loadData = require('./load-data')
var url = require('url')
var uuid = require('uuid').v4

var META = (
  require('./package.json').name + ' ' +
  require('./package.json').version
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
      var prefix = parsed.query.prefix.toUpperCase()
      loadData(function (error, data) {
        if (error) {
          response.statusCode = 500
          response.end()
        } else {
          response.end(
            data
              .ipcs
              .filter(function (ipc) {
                return ipc.startsWith(prefix)
              })
              .join('\n')
          )
        }
      })
    } else if (parsed.query.search) {
      var search = parsed.query.search.toLowerCase()
      loadData(function (error, data) {
        if (error) {
          response.statusCode = 500
          response.end()
        } else {
          var lower = search.toLowerCase()
          var upper = search.toUpperCase()

          // Catchwords
          setImmediate(function () {
            data.catchwords.forEach(function (catchword) {
              if (fuzzysearch(lower, catchword[0])) {
                separator()
                response.write(
                  catchword[0] + '\t' +
                  catchword[1]
                    .reduce(function (list, ipc) {
                      if (ipc.includes(' ')) {
                        return list.concat(ipc)
                      } else {
                        return list.concat(
                          data.ipcs.filter(function (otherIPC) {
                            return otherIPC[0].startsWith(ipc)
                          })
                        )
                      }
                    }, [])
                    .join(',')
                )
              }
            })
          })

          setImmediate(function () {
            // Classifications
            data.ipcs.forEach(function (ipc) {
              var description = ipc[1]
                .map(function (element) {
                  return element.join('; ')
                })
                .join(': ')
                .toLowerCase()
              if (
                fuzzysearch(lower, description) ||
                ipc[0].indexOf(upper) !== -1
              ) {
                separator(this)
                response.write(ipc[0] + '\t' + description)
              }
            })
          })

          setImmediate(function () {
            response.end()
          })
        }
      })
    } else {
      loadData(function (error, data) {
        if (error) {
          response.statusCode = 500
          response.end()
        } else {
          data.ipcs.forEach(function (ipc) {
            separator()
            response.write(ipc[0])
          })
          response.end()
        }
      })
    }
  } else {
    response.statusCode = 404
    response.end()
  }

  function separator () {
    if (first) {
      first = false
    } else {
      response.write('\n')
    }
  }
}
