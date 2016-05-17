var factory = require('./index')

var merge = factory.merge
var of = factory.of
var combine = factory.combine

var foo$ = of(5)
var bar$ = of(10)
combine({foo$: foo$, bar$: bar$}).map(function (combined) {
  if (combined.foo + combined.bar == 15){
    console.log('combine object test passed')
  } else {
    throw new Error('combine object test not passed')
  }

}).subscribe()

combine([foo$,bar$]).map(function (combined) {
  if (combined[0] + combined[1] == 15){
    console.log('combine test passed')
  } else {
    throw new Error('combine test not passed')
  }
}).subscribe()
