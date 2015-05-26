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

module.exports = {
  getJson$: getJson$
};

