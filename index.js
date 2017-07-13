/*
Copyright 2017 The BioBricks Foundation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var descriptionOf = require('./description')
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
  var limit = parsed.query.limit
    ? parseInt(parsed.query.limit)
    : Infinity
  if (parsed.pathname === '/') {
    response.setHeader('Content-Type', 'text/plain')
    response.end(META)
  } else if (parsed.pathname === '/classifications') {
    response.setHeader('Content-Type', 'text/plain')
    var first = true
    if (parsed.query.prefix) {
      var prefix = parsed.query.prefix.toUpperCase()
      loadData(function (error, data) {
        /* istanbul ignore if */
        if (error) {
          response.statusCode = 500
          response.end()
        } else {
          response.end(
            data
              .ipcs
              .filter(function (ipc) {
                return ipc[0].startsWith(prefix)
              })
              .slice(0, limit)
              .join('\n')
          )
        }
      })
    } else if (parsed.query.search) {
      var search = parsed.query.search.toLowerCase()
      loadData(function (error, data) {
        /* istanbul ignore if */
        if (error) {
          response.statusCode = 500
          response.end()
        } else {
          var lower = search.toLowerCase()
          var upper = search.toUpperCase()
          var index

          // Catchwords
          for (index = 0; index < data.catchwords.length; index++) {
            var catchword = data.catchwords[index]
            if (limit === 0) break
            if (catchword.includes(lower)) {
              separator()
              response.write(
                catchword[1]
                  .reduce(function (list, ipc) {
                    return list.concat(ipc)
                  }, [])
                  .join(',')
                  .replace(/\n/g, ' ') +
                '\t' +
                catchword[0]
              )
              limit--
            }
          }

          // Classifications
          for (index = 0; index < data.ipcs.length; index++) {
            if (limit === 0) break
            var ipc = data.ipcs[index]
            var description = descriptionOf(ipc[1])
            if (
              description.toLowerCase().includes(lower) ||
              ipc[0].indexOf(upper) !== -1
            ) {
              separator(this)
              response.write(ipc[0] + '\t' + description)
              limit--
            }
          }

          response.end()
        }
      })
    } else {
      loadData(function (error, data) {
        /* istanbul ignore if */
        if (error) {
          response.statusCode = 500
          response.end()
        } else {
          data.ipcs
            .slice(0, limit)
            .forEach(function (ipc) {
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
