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

var flushWriteStream = require('flush-write-stream')
var fs = require('fs')
var ndjson = require('ndjson')
var path = require('path')
var pump = require('pump')

var data
var queue = []

module.exports = function (callback) {
  if (data) {
    setImmediate(function () {
      callback(null, data)
    })
  } else {
    queue.push(callback)
  }
}

var reading = {
  catchwords: [],
  ipcs: []
}

var catchwordsDone = false
var ipcsDone = false
var errored = false

pump(
  fs.createReadStream(
    path.join(__dirname, 'data', 'ipc_scheme.json')
  ),
  ndjson.parse(),
  flushWriteStream.obj(function (chunk, _, done) {
    reading.ipcs.push(chunk)
    done()
  }),
  function (error) {
    /* istanbul ignore if */
    if (error) {
      onError(error)
    } else {
      ipcsDone = true
      onReady()
    }
  }
)

pump(
  fs.createReadStream(
    path.join(__dirname, 'data', 'ipc_catchwordindex.json')
  ),
  ndjson.parse(),
  flushWriteStream.obj(function (chunk, _, done) {
    reading.catchwords.push(chunk)
    done()
  }),
  function (error) {
    /* istanbul ignore if */
    if (error) {
      onError(error)
    } else {
      catchwordsDone = true
      onReady()
    }
  }
)

/* istanbul ignore next */
function onError (error) {
  if (!error) {
    errored = true
    queue.forEach(function (callback) {
      setImmediate(function () {
        callback(error)
      })
    })
  }
}

function onReady () {
  if (ipcsDone && catchwordsDone) {
    data = reading
    queue.forEach(function (callback) {
      setImmediate(function () {
        callback(null, data)
      })
    })
  }
}
