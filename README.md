# Rx-hot

> Factories for creating :fire: **hot** (multicasted) *Rx.Observable* streams ([rx.js](https://github.com/Reactive-Extensions/RxJS) v.4).  

## Why?
Everyone likes it **hot**, right? Especially [cycle.js](http://cycle.js.org/) with [xstream](https://github.com/staltz/xstream). 
So let's **make streams hot** by default with [rx](https://github.com/Reactive-Extensions/RxJS).


```bash
npm i rx-hot rx -S
```

```js
import {just, merge, interval} from 'rx-hot'

// created stream source$ will be `hot` (or `multicasted`)
let source$ = merge([
 just(0),
 interval(1000)
]).filter(_ => _ % 2)     
```

Instead of:

```js
import {Observable as O} from 'rx'

let source$ = O.merge([
 O.just(0),
 O.interval(1000)
]).filter(_ => _ % 2).share() // need to make it hot explicitly
```


It also provides `combine` factory that acts like `combineLatest` 
and also acts like [`combineLatestObj`](https://github.com/staltz/combineLatestObj) if single plain object is passed. 

```js
import {just, interval, combine} from 'rx-hot'

let foo$ = interval(1000)
let bar$ = interval(5000)

let source$ = combine({foo$, bar$})
  .map(({foo, bar}) =>  foo + bar)  
```

## Is it safe to use?

Yes, quite! It makes consumer to subscribe to multicated (`publish().refCount()` aka `.share()`) 
version of an original stream, this is accomplished using stream object proxing (with native *ES6 Proxy* if available). 
 And this also should not create big overhead.

This effects only streams created using factories from `rx-hot`, it doesn't mess with `Rx.Observable` itself. 
You can also use exported `makeHot` method to make any `rx` stream really :fire: hot!