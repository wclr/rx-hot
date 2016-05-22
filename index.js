var Observable = require('rx').Observable
var _Proxy

if (typeof Proxy === 'function'){
  _Proxy = Proxy
} else {
  _Proxy = function (target, handler) {
    this.__target = target
    this.__handler = handler
  }
  _Proxy.prototype = Object.keys(Observable.prototype)
    .filter(function (key) {
      return typeof Observable.prototype[key] === 'function'
    })
    .reduce(function (proto, key) {
      proto[key] = function() {
        return this.__handler.get(this.__target, key).apply(this, arguments)
      }
      return proto
    }, {})
}

function makeHot(stream) {
  if (Observable.isObservable(stream)) {
    return new _Proxy(stream, {
      get: function (stream, method) {
        return function () {
          if ((method === 'subscribe' || method === 'forEach') && !stream.___shared) {
            stream.___shared = stream.share()
          }
          stream = (stream.___shared ? stream.___shared : stream)
          return makeHot(stream[method].apply(stream, arguments))
        }
      }
    })
  }
  return stream
}

var shared = Object.keys(Observable).filter(function (key) {
  return typeof Observable[key] === 'function'
}).reduce(function (shared, method) {
  shared[method] = function () {
    return makeHot(Observable[method].apply(Observable, arguments))
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

shared.makeHot = makeHot
module.exports = shared