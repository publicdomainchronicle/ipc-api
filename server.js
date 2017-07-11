var handler = require('./')
var http = require('http')
var pino = require('pino')

var log = pino()

var server = http.createServer(function (request, response) {
  handler(log, request, response)
})

var PORT = process.env.PORT
  ? parseInt(process.env.PORT)
  : 8080

server.listen(PORT, function () {
  var port = this.address().port
  log.info({port: port}, 'listening')
})

process
  .on('SIGTERM', logSignalAndShutDown)
  .on('SIGQUIT', logSignalAndShutDown)
  .on('SIGINT', logSignalAndShutDown)
  .on('uncaughtException', function (exception) {
    log.error(exception)
    shutDown()
  })

function logSignalAndShutDown (signal) {
  log.info({signal: signal}, 'trap')
  shutDown()
}

function shutDown () {
  log.info('closing')
  server.close(function () {
    log.info('closed')
    process.exit()
  })
}
