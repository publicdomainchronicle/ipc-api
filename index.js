var uuid = require('uuid').v4
var url = require('url')

var META = {
  name: require('./package.json').name,
  version: require('./package.json').version
}

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
  } else {
    response.statusCode = 404
    response.end()
  }
}
