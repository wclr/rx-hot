'use strict'
var factory = require('./index')

var merge = factory.merge
var of = factory.of
var combine = factory.combine

var test = require('tape')

test.skip('combine object', function (t) {
  var foo$ = of(5)
  var bar$ = of(10)

  var $source = combine({foo$: foo$, bar$: bar$}).map(function (combined) {
    t.is(combined.foo + combined.bar, 15)
    t.end()
  }).subscribe()
})


test('combine object two shared subscribers', function (t) {
  var foo$ = of(5)
  var bar$ = of(10)

  var $source = combine({foo$: foo$, bar$: bar$}).delay(1).map(function (combined) {
    return Math.random(1)
  })

  var x1, x2

  $source.subscribe(function (x) {
    x1 = x
  })

  $source.subscribe(function (x) {
    x2 = x
  })

  setTimeout(function(){
    t.ok(x1, 'source is mapped to random number')
    t.is(x1, x2, 'subscriber\'s results are the same')
    t.end()
  }, 10)
})
