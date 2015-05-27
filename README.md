# Rx http (WORK IN PROGRESS)

This library was written to wrap the core Node.js http library in Rx
observables. It also enforces a lot of opinions on your requests. I don't
expect it to work for all use-cases. Mostly it serves a very similar need as a
promise. The benefit gained from using Rx around http calls comes when you
start writing requests that need to be repeated many times, or need to be
chained with other Rx-isms. The Rx semantics allow you to write your programs
more declaratively.

This is one of my attempts at finding how much observables can replace other
idioms in my code.

## Docs

Each method returns an `Observable` and may emit an event on either the onNext,
onError, or onCompleted channels.

`#getJson$`

```javascript
var rxHttp = require('rx-http');

rxHttp.getJson$('http://example.com/user/1').subscribe(function(obj) {
  // do something with `obj`
});

rxHttp.getJson$('http://example.com/user/1').subscribe(
  function(obj) { /* onNext */ },
  function(err) { /* onError */ },
  function() { /* onCompleted */ }
);
```

`#postJson$`

```javascript
rxHttp.postJson$('http://example.com/user', {name: 'jon'}).subscribe(function(obj) {
  // do something with `obj`
});
```

## Tests

This code is unit tested with mock http calls.

```
npm test
```

