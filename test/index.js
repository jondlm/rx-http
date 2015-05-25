var rxHttp = require('../index');
var assert = require('assert');
var nock = require('nock');

var noop = function() {};

describe('#getJson$', function() {
  it('should GET and parse a json payload', function(done) {
    var expected = { name: 'johnson' };

    nock('http://test.com')
      .get('/')
      .reply(200, expected);

    rxHttp.getJson$('http://test.com/').subscribe(function(result) {
      assert.deepEqual(result, expected);
      done();
    });
  });

  it('should GET with query string parameters', function(done) {
    nock('http://frank.com')
      .get('/?age=23')
      .reply(200, '{ "pass": true }');

    rxHttp.getJson$('http://frank.com', { age: 23 }).subscribe(function(result) {
      assert.deepEqual(result, { pass: true });
      done();
    });
  });

  it('should error out with a GET with a non-json response', function(done) {
    nock('http://poo.com')
      .get('/')
      .reply('200', 'not json');

    rxHttp.getJson$('http://poo.com').subscribe(noop, function(err) {
      assert(err);
      done();
    });
  });

  it('should not error out with a GET and a non 200 response', function(done) {
    nock('http://poo.com')
      .get('/')
      .reply('404', '{}');

    rxHttp.getJson$('http://poo.com').subscribe(function(err) {
      assert(err);
      done();
    });
  });
});
