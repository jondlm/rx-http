# Rx http (WORK IN PROGRESS)

This library was written to wrap the core Node.js http library in Rx
observables. It also enforces a lot of opinions on your requests. I don't
expect it to work for all use-cases. Mostly it serves a very similar need as a
promise. The benefit gained from using Rx around http calls comes when you
start writing requests that need to repeated many times, or need to be chained
with other Rx-isms. The Rx semantics allow you to write your programs more
declaratively.

This is one of my attempts at finding how much observables can replace promises
in my code.

## Examples

`#getJson$`

```javascript
var rxHttp = require('rx-http');

rxHttp.getJson$('http://example.com/something.json').subscribe(function(obj) {
  // do something with `obj`
});
```

## Tests

This code is unit tested with mock http calls.

```
npm test
```

