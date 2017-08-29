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

var concat = require('concat-stream')
var http = require('http')
var server = require('./server')
var tape = require('tape')

tape.skip(
  'GET /classifications?search={subgroup catchword}',
  function (test) {
    server(function (port, close) {
      http.get({
        port: port,
        path: (
          '/classifications' +
          '?search=' + encodeURIComponent('ball-point pens')
        )
      }, function (response) {
        test.equal(
          response.statusCode, 200,
          'responds 200'
        )
        test.equal(
          response.headers['content-type'], 'text/plain',
          'text/plain'
        )
        response.pipe(concat(function (body) {
          var items = body
            .toString()
            .split('\n')
          test.assert(
            items.some(function (element) {
              return element.startsWith('B43K 7/00')
            }),
            'includes B43K 7/00'
          )
          test.end()
          close()
        }))
      })
    })
  }
)

tape.skip(
  'GET /classifications?search={many-subgroup catchword}',
  function (test) {
    server(function (port, close) {
      http.get({
        port: port,
        path: (
          '/classifications' +
          '?search=' + encodeURIComponent('coating with plastic') +
          '&limit=10'
        )
      }, function (response) {
        test.equal(
          response.statusCode, 200,
          'responds 200'
        )
        test.equal(
          response.headers['content-type'], 'text/plain',
          'text/plain'
        )
        response.pipe(concat(function (body) {
          var items = body
            .toString()
            .split('\n')
          test.assert(
            items.some(function (element) {
              return element.includes('B29B')
            }),
            'includes B29B...'
          )
          test.end()
          close()
        }))
      })
    })
  }
)

tape(
  'GET /classifications?search={class description}',
  function (test) {
    server(function (port, close) {
      http.get({
        port: port,
        path: (
          '/classifications' +
          '?search=' + encodeURIComponent('animal-drawn ploughs')
        )
      }, function (response) {
        test.equal(
          response.statusCode, 200,
          'responds 200'
        )
        test.equal(
          response.headers['content-type'], 'text/plain',
          'text/plain'
        )
        response.pipe(concat(function (body) {
          /* eslint-disable max-len */
          var expected = {
            'A': {
              description: ['HUMAN NECESSITIES'],
              children: {
                '01': {
                  'description': [
                    'AGRICULTURE',
                    'FORESTRY',
                    'ANIMAL HUSBANDRY',
                    'HUNTING',
                    'TRAPPING',
                    'FISHING'
                  ],
                  children: {
                    B: {
                      'description': [
                        'SOIL WORKING IN AGRICULTURE OR FORESTRY',
                        'PARTS, DETAILS, OR ACCESSORIES OF AGRICULTURAL MACHINES OR IMPLEMENTS, IN GENERAL'
                      ],
                      'children': {
                        '3': {
                          'description': ['Ploughs with fixed plough-shares'],
                          'children': {
                            '10': [
                              ['Animal-drawn ploughs'],
                              ['without alternating possibility, i.e. incapable of making an adjacent furrow on return journey'],
                              ['Trussed-beam ploughs', 'Single-wheel ploughs']
                            ],
                            '12': [
                              ['Animal-drawn ploughs'],
                              ['without alternating possibility, i.e. incapable of making an adjacent furrow on return journey'],
                              ['Two-wheel beam ploughs']
                            ],
                            '14': [
                              ['Animal-drawn ploughs'],
                              ['without alternating possibility, i.e. incapable of making an adjacent furrow on return journey'],
                              ['Frame ploughs']
                            ],
                            '16': [
                              ['Animal-drawn ploughs'],
                              ['Alternating ploughs, i.e. capable of making an adjacent furrow on return journey']
                            ],
                            '18': [
                              ['Animal-drawn ploughs'],
                              ['Alternating ploughs, i.e. capable of making an adjacent furrow on return journey'],
                              ['Turn-wrest ploughs']
                            ],
                            '20': [
                              ['Animal-drawn ploughs'],
                              ['Alternating ploughs, i.e. capable of making an adjacent furrow on return journey'],
                              ['Balance ploughs']
                            ],
                            '22': [
                              ['Animal-drawn ploughs'],
                              ['Alternating ploughs, i.e. capable of making an adjacent furrow on return journey'],
                              ['with parallel plough units used alternately']
                            ],
                            '24': [
                              ['Tractor-drawn ploughs']
                            ],
                            '26': [
                              ['Tractor-drawn ploughs'],
                              ['without alternating possibility']
                            ],
                            '28': [
                              ['Tractor-drawn ploughs'],
                              ['Alternating ploughs']
                            ],
                            '30': [
                              ['Tractor-drawn ploughs'],
                              ['Alternating ploughs'],
                              ['Turn-wrest ploughs']
                            ],
                            '32': [
                              ['Tractor-drawn ploughs'],
                              ['Alternating ploughs'],
                              ['Balance ploughs']
                            ],
                            '34': [
                              ['Tractor-drawn ploughs'],
                              ['Alternating ploughs'],
                              ['with parallel plough units used alternately']
                            ],
                            '36': [
                              ['Ploughs mounted on tractors']
                            ],
                            '38': [
                              ['Ploughs mounted on tractors'],
                              ['without alternating possibility']
                            ],
                            '40': [
                              ['Ploughs mounted on tractors'],
                              ['Alternating ploughs']
                            ],
                            '42': [
                              ['Ploughs mounted on tractors'],
                              ['Alternating ploughs'],
                              ['Turn-wrest ploughs']
                            ],
                            '44': [
                              ['Ploughs mounted on tractors'],
                              ['Alternating ploughs'],
                              ['with parallel plough units used alternately']
                            ],
                            '46': [
                              ['Ploughs supported partly by tractor and partly by their own wheels']
                            ],
                            '50': [
                              ['Self-propelled ploughs']
                            ],
                            '52': [
                              ['Self-propelled ploughs'],
                              ['with three or more wheels, or endless tracks']
                            ],
                            '54': [
                              ['Self-propelled ploughs'],
                              ['with three or more wheels, or endless tracks'],
                              ['without alternating possibility']
                            ],
                            '56': [
                              ['Self-propelled ploughs'],
                              ['with three or more wheels, or endless tracks'],
                              ['Alternating ploughs']
                            ],
                            '58': [
                              ['Self-propelled ploughs'],
                              ['with two wheels']
                            ],
                            '60': [
                              ['Self-propelled ploughs'],
                              ['with two wheels'],
                              ['Alternating ploughs']
                            ],
                            '62': [
                              ['Self-propelled ploughs'],
                              ['with two wheels'],
                              ['Alternating ploughs'],
                              ['Balance ploughs']
                            ],
                            '64': [
                              ['Cable ploughs', 'Indicating or signalling devices for cable plough systems']
                            ],
                            '66': [
                              ['Cable ploughs', 'Indicating or signalling devices for cable plough systems'],
                              ['with motor-driven winding apparatus mounted on the plough']
                            ],
                            '68': [
                              ['Cable ploughs', 'Indicating or signalling devices for cable plough systems'],
                              ['Cable systems with one or two engines']
                            ],
                            '70': [
                              ['Cable ploughs', 'Indicating or signalling devices for cable plough systems'],
                              ['Cable systems with one or two engines'],
                              ['Systems with one engine for working uphill']
                            ],
                            '72': [
                              ['Cable ploughs', 'Indicating or signalling devices for cable plough systems'],
                              ['Means for anchoring the cables']
                            ],
                            '74': [
                              ['Use of electric power for propelling ploughs']
                            ],
                            '421': [
                              ['Ploughs mounted on tractors'],
                              ['Alternating ploughs'],
                              ['Turn-wrest ploughs'],
                              ['with a headstock frame made in one piece']
                            ],
                            '426': [
                              ['Ploughs mounted on tractors'],
                              ['Alternating ploughs'],
                              ['Turn-wrest ploughs'],
                              ['with a headstock frame made of two or more parts']
                            ],
                            '02': [
                              ['Man-driven ploughs']
                            ],
                            '08': [
                              ['Animal-drawn ploughs'],
                              ['without alternating possibility, i.e. incapable of making an adjacent furrow on return journey'],
                              ['Swing ploughs']
                            ],
                            '06': [
                              ['Animal-drawn ploughs'],
                              ['without alternating possibility, i.e. incapable of making an adjacent furrow on return journey']
                            ],
                            '04': [
                              ['Animal-drawn ploughs']
                            ],
                            '00': []
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          /* eslint-enable max-len */
          test.deepEqual(JSON.parse(body), expected)
          test.end()
          close()
        }))
      })
    })
  }
)

tape.test(
  'GET /classifications?search={subclass catchword}',
  function (test) {
    server(function (port, close) {
      http.get({
        port: port,
        path: (
          '/classifications' +
          '?search=' + encodeURIComponent('traps for animals')
        )
      }, function (response) {
        test.equal(
          response.statusCode, 200,
          'responds 200'
        )
        test.equal(
          response.headers['content-type'], 'text/plain',
          'text/plain'
        )
        response.pipe(concat(function (body) {
          console.log(body.length)
          /* eslint-disable max-len */
          var expected = {
            A: {
              description: ['HUMAN NECESSITIES'],
              children: {
                '01': {
                  description: [
                    'AGRICULTURE', 'FORESTRY', 'ANIMAL HUSBANDRY',
                    'HUNTING', 'TRAPPING', 'FISHING'
                  ],
                  children: {
                    M: {
                      description: [
                        'CATCHING, TRAPPING OR SCARING OF ANIMALS',
                        'APPARATUS FOR THE DESTRUCTION OF NOXIOUS ANIMALS OR NOXIOUS PLANTS'
                      ],
                      children: {
                        23: {
                          description: ['Traps for animals'],
                          children: {
                            '06': [['Collecting-traps'], ['with tipping platforms'], ['with locking mechanism for the tipping platform']],
                            '04': [['Collecting-traps'], ['with tipping platforms']],
                            '08': [['Collecting-traps'], ['with approaches permitting entry only']],
                            '10': [['Collecting-traps'], ['with rotating cylinders or turnstiles']],
                            '12': [['Collecting-traps'], ['with devices for throwing the animal to a collecting chamber']],
                            '14': [['Collecting-traps'], ['Other traps automatically reset']],
                            '02': [['Collecting-traps']],
                            '18': [['Box traps'], ['with pivoted closure flaps']],
                            '20': [['Box traps'], ['with dropping doors or slides']],
                            '22': [['Box traps'], ['with dropping covers']],
                            '16': [['Box traps']],
                            '28': [['Jaw or like spring traps'], ['of the double-jaw or pincer type'], ['Jaw trap setting-devices']],
                            '26': [['Jaw or like spring traps'], ['of the double-jaw or pincer type']],
                            '30': [['Jaw or like spring traps'], ['Break-back traps']],
                            '32': [['Jaw or like spring traps'], ['Racket net traps']],
                            '34': [['Jaw or like spring traps'], ['with snares']],
                            '36': [['Jaw or like spring traps'], ['with arrangements for piercing the victim']],
                            '24': [['Jaw or like spring traps']],
                            '38': [['Electric traps']],
                            '00': []
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          /* eslint-enable max-len */
          test.deepEqual(JSON.parse(body), expected)
          test.end()
          close()
        }))
      })
    })
  }
)

tape.skip(
  'GET /classifications?search={IPC prefix}',
  function (test) {
    server(function (port, close) {
      http.get({
        port: port,
        path: (
          '/classifications' +
          '?search=' + encodeURIComponent('B43K')
        )
      }, function (response) {
        test.equal(
          response.statusCode, 200,
          'responds 200'
        )
        test.equal(
          response.headers['content-type'], 'text/plain',
          'text/plain'
        )
        response.pipe(concat(function (body) {
          var items = body
            .toString()
            .split('\n')
          test.assert(
            items.some(function (element) {
              return element.startsWith('B43K 7/00')
            }),
            'includes B43K 7/00'
          )
          test.end()
          close()
        }))
      })
    })
  }
)

tape.skip(
  'GET /classifications?search=&limit=',
  function (test) {
    server(function (port, close) {
      http.get({
        port: port,
        path: (
          '/classifications' +
          '?search=' + encodeURIComponent('fruit') +
          '&limit=10'
        )
      }, function (response) {
        test.equal(
          response.statusCode, 200,
          'responds 200'
        )
        test.equal(
          response.headers['content-type'], 'text/plain',
          'text/plain'
        )
        response.pipe(concat(function (body) {
          var items = body
            .toString()
            .split('\n')
          test.equal(
            items.length, 10,
            'serves 10 results'
          )
          test.end()
          close()
        }))
      })
    })
  }
)

tape.skip(
  'GET /classifications?prefix=&limit=',
  function (test) {
    server(function (port, close) {
      http.get({
        port: port,
        path: (
          '/classifications' +
          '?prefix=' + encodeURIComponent('B43K') +
          '&limit=10'
        )
      }, function (response) {
        test.equal(
          response.statusCode, 200,
          'responds 200'
        )
        test.equal(
          response.headers['content-type'], 'text/plain',
          'text/plain'
        )
        response.pipe(concat(function (body) {
          var items = body
            .toString()
            .split('\n')
          test.equal(
            items.length, 10,
            'serves 10 results'
          )
          test.end()
          close()
        }))
      })
    })
  }
)

tape.skip(
  'GET /classifications?prefix=',
  function (test) {
    server(function (port, close) {
      http.get({
        port: port,
        path: (
          '/classifications' +
          '?prefix=' + encodeURIComponent('B43K')
        )
      }, function (response) {
        test.equal(
          response.statusCode, 200,
          'responds 200'
        )
        test.equal(
          response.headers['content-type'], 'text/plain',
          'text/plain'
        )
        response.pipe(concat(function (body) {
          var items = body
            .toString()
            .split('\n')
          test.assert(
            items.some(function (element) {
              return element.startsWith('B43K 7/00')
            }),
            'includes B43K 7/00'
          )
          test.assert(
            items.length > 100,
            'serves >100 IPCs'
          )
          test.end()
          close()
        }))
      })
    })
  }
)
