'use strict';

var querystring = require('querystring');
var request = require('supertest');
var expect = require('chai').expect;
var Q = require('q');

describe('api', function () {
  var server;

  beforeEach(function () {
    server = request('http://ngcourse.herokuapp.com');
  });

  function getAndCheckStatus(endpoint, statusCode) {
    var deferred = Q.defer();
    server
      .get(endpoint)
      .expect(statusCode)
      .end(function(error, response) {
        var body;
        if (error) {
          deferred.reject(error);
        } else {
          try {
            body = JSON.parse(response.text);
            deferred.resolve(body);
          } catch(e) {
            deferred.resolve(response.text);
          }          
        }
      });
    return deferred.promise;
  }

  it('should return a 404 on a wrong endpoint', function (done) {
    server
      .get('/api/foo')
      .expect(404)
      .end(done);
  });

  it('should return a 404 on a wrong endpoint', function () {
    return getAndCheckStatus('/api/foo', 404);
  });

  it('should return a 200 on a correct endpoint', function (done) {
    server
      .get('/api/v1/tasks')
      .expect(200)
      .end(done);
  });

  it('should return a 200 on a correct endpoint', function (done) {
    return getAndCheckStatus('/api/v1/tasks', 200)
      .then(function(body) {
        // body is now a JSON object
        expect(body.length).to.equal(75);
      });
  });

});