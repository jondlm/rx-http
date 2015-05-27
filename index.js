'use strict';

var Rx = require('rx');
var qs = require('querystring');
var url = require('url');
var http = require('http');

/**
 * getJson$
 *
 * This function takes a url and option query string parameters and returns an Observable that will be a
 *
 * @param {string} inUrl  - The JSON endpoint you want to hit
 * @param {object} [inQs] - An object that will be converted to query string
 *                          parameters
 * @return {Observable}   - Emits a single javascript object or array that is
 *                          the result of JSON parsing what was returned from
 *                          the endpoint
 */
function getJson$(inUrl, inQs) {
  var parsedUrl = url.parse(inUrl);
  var queryStringified = inQs ? qs.stringify(inQs) : null;

  var options = {
    method: 'GET',
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 80,
    path: parsedUrl.path + (queryStringified ? '?' + queryStringified : '')
  };

  return Rx.Observable.create(function(observer) {
    var response = '';

    var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(chunk) { response += chunk; });
      res.on('end', function() {
        var parsed;
        try { parsed = JSON.parse(response); }
        catch (e) { observer.onError(e); }

        observer.onNext(parsed);
        observer.onCompleted();
      });
    });

    req.on('error', function(e) { observer.onError(e); });

    req.end();
  });
}

/**
 * postJson$
 *
 * Takes a url, a body, and optionally a query string object, JSON parses the
 * `body` and expects the server to respond with JSON as well.
 *
 * @param {string} inUrl  - The JSON endpoint you want to hit
 * @param {object} body   - The object you'd like to POST
 * @param {object} [inQs] - An object that will be converted to query string
 *                          parameters
 * @return {Observable}   - Emits a single javascript object or array that is
 *                          the result of JSON parsing what was returned from
 *                          the endpoint
 */
function postJson$(inUrl, body, inQs) {
  var parsedUrl = url.parse(inUrl);
  var queryStringified = inQs ? qs.stringify(inQs) : null;
  var stringifiedBody;

  var options = {
    method: 'POST',
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 80,
    path: parsedUrl.path + (queryStringified ? '?' + queryStringified : ''),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return Rx.Observable.create(function(observer) {
    var response = '';

    // Make sure we can parse the `body`
    try { stringifiedBody = JSON.stringify(body); }
    catch (e) { observer.onError(e); }

    // I would set this above, but we don't know it until after we JSON parse
    // the body
    options.headers['Content-Length'] = stringifiedBody.length;

    var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(chunk) { response += chunk; });
      res.on('end', function() {
        var parsed;
        try { parsed = JSON.parse(response); }
        catch (e) { observer.onError(e); }

        observer.onNext(parsed);
        observer.onCompleted();
      });
    });

    req.on('error', function(e) { observer.onError(e); });

    req.write(stringifiedBody);
    req.end();
  });
}

module.exports = {
  getJson$: getJson$,
  postJson$: postJson$
};

