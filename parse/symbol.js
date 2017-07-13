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

module.exports = function (symbol) {
  return {
    section: symbol[0],
    class: parseInt(symbol.substr(1, 2)),
    subclass: symbol[3],
    group: parseInt(symbol.substr(4, 4)),
    // The string encoding for subgroups is bizarre.
    // For example:
    // ...421000 -> 421
    // ...100000 -> 10
    // ...010000 -> 1
    subgroup: symbol.endsWith('0'.repeat(4))
      ? parseInt(symbol.substr(8, 2))
      : parseInt(symbol.substr(8, 3))
  }
}
