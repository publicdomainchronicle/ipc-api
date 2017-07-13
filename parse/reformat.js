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

var parseSymbol = require('./symbol')

module.exports = function reformat (string) {
  if (string.length === 14) {
    var parsed = parseSymbol(string)
    return (
      parsed.section + pad(parsed.class) + parsed.subclass + ' ' +
      parsed.group + '/' + pad(parsed.subgroup)
    )
  } else {
    return string
  }
}

function pad (argument) {
  var string = argument.toString()
  return string.length === 1
    ? ('0' + string)
    : string
}

