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

var devNull = require('dev-null')
var handler = require('../')
var http = require('http')
var pino = require('pino')

module.exports = function (callback) {
  var log = pino({}, devNull())
  var server = http.createServer(function (request, response) {
    handler(log, request, response)
  })
  server.listen(0, function () {
    callback(this.address().port, function () {
      server.close()
    })
  })
}
