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

module.exports = function descriptionOf (array) {
  var start = array.findIndex(function (element) {
    return element.some(function (element) {
      return element
        .replace(/e\.g\./g, '')
        .replace(/i\.e\./g, '')
        .split('')
        .some(function (character) {
          return isLowerCase(character)
        })
    })
  })
  return array
    .slice(start)
    .map(function (element) {
      return element.join('; ')
    })
    .join(' / ')
}

function isLowerCase (char) {
  var code = char.charCodeAt(0)
  return code >= 97 && code <= 122
}
