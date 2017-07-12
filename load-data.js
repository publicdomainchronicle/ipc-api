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
