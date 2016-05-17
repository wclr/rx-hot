var Observable = require('rx').Observable

const methodsToShare = [
  'filter', 'map', 'first', 'last', 'delay', 'throttle',
  'concat', 'sample', 'withLatestFrom', 'zip', 'combineLatest',
  'skip', 'skipLast', 'skipLastWithTime', 'skipUntil',
  'skipUntilWithTime', 'skipWhile', 'skipWithTime',
  'take', 'takeLast', 'takeLastWithTime', 'takeUntil',
  'takeUntilWithTime', 'takeWhile', 'takeWithTime'
]

function makeCompletelyHot(stream) {
  if (Observable.isObservable(stream)) {
    stream = stream.share()
    for (var i = 0; i < methodsToShare.length; i++){
        var prop = methodsToShare[i]
        ;(function(prop) {
          var _oldMethod = stream[prop]
          stream[prop] = function () {
            return makeCompletelyHot(_oldMethod.apply(stream, arguments))
          }
        })(prop)
    }
  }
  return stream
}

var shared = Object.keys(Observable).filter(function (key) {
  return typeof Observable[key] === 'function'
}).reduce(function (shared, method) {
  shared[method] = function () {
    return makeCompletelyHot(Observable[method].apply(Observable, arguments))
  }
  return shared
}, {})

shared.combineLatestObj = function (obj) {
  var sources = [];
  var keys = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key.replace(/\$$/, ''));
      sources.push(obj[key]);
    }
  }
  return shared.combineLatest(sources, function () {
    var argsLength = arguments.length;
    var combination = {};
    for (var i = argsLength - 1; i >= 0; i--) {
      combination[keys[i]] = arguments[i];
    }
    return combination;
  })
}

shared.combine = function (obj) {
  if (arguments.length === 1 && obj.constructor === Object) {
    return shared.combineLatestObj(obj)
  }
  return shared.combineLatest.apply(null, arguments)
}

module.exports = shared