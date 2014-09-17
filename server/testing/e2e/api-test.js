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

  it('should return a 404 on a wrong endpoint', function (done) {
    return server
    .get('/api/foo')
    .expect(404)
    .end(done);
  });

  it('should get 3 tasks', function (done) {
    return server
    .get('/api/v1/tasks')
    .expect(200)
    .end(function(err, res) {
      var body = JSON.parse(res.text);
      expect(body.length).to.equal(26);
      done(err);
    });
  });    

});