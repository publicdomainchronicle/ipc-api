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
