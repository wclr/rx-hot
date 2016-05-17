# Rx-hot

**Hot** (multicasted) factories of Rx.Observable ([rx.js](https://github.com/Reactive-Extensions/RxJS) v.4).  

## Why?
Everyone likes it **hot**, right? Especialy [cycle.js](http://cycle.js.org/) with [xstream](https://github.com/staltz/xstream). 
So let's **make streams hot** by default with [rx](https://github.com/Reactive-Extensions/RxJS).


```bash
npm i rx-hot -S
```

```js
import {just, merge, interval} from 'rx-hot'

// will be `host` or `multicated` by default
let source$ = merge([
 just(0),
 interval(1000)
])     
```

Instead of:

```js
import {Observable as O} from 'rx'

let source$ = O.merge([
 O.just(0),
 O.interval(1000)
]).share() // need to make it hot explicitly
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