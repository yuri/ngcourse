'use strict';

var supertest = require('supertest-as-promised');
var assert = require('chai').assert;

var request = supertest('https://ngcourse.herokuapp.com');

describe('Different things you can do with HTTP', function() {
  var newTaskId;

  it ('Should be able to set and expect headers', function() {
    return request.get('/api/v1/users')
      .send('accept', 'application/json')
      .expect(200)
      // Actually a bug in ngcourse-api: should give us application/json...
      .expect('content-type', 'text/plain; charset=utf-8');
  });

  it ('Should be able to expect things in the response payload', function() {
    return request.get('/api/v1/users')
      .expect(200)
      .expect(function(response) {
        var body = JSON.parse(response.text);
        assert(body.length === 5, '5 users returned');
      });
  });

  it ('Should be able to POST', function() {
    var jsonPayload = {
      owner: 'alice',
      description: 'Write some tests!'
    };

    return request.post('/api/v1/tasks')
      // Smart enough to set Content-type and JSON stringify.
      .send(jsonPayload)
      .expect(200) // Should be 201 Created?
      .expect(function(response) {
        var newTask = JSON.parse(response.text)[0];
        newTaskId = newTask._id;
        assert(jsonPayload.owner === newTask.owner, 'Owner is as expected');
        assert(
          jsonPayload.description === newTask.description,
          'Description is as expected');
      });
  });

  it ('Should be able to DELETE', function() {
    return request.delete('/api/v1/tasks/' + newTaskId)
      .expect(200)
      .then(function() {
        // Make sure it's actually gone.
        request.get('/api/v1/tasks/' + newTaskId)
          .expect(404);
      });
  });
});
