# Part 10: Working Session

## Test-Driven-Development of a Service

Let's use what we've learned to add some more features to the
`tasks-service.js`.

Try using a "Test-Driven-Development" approach, in which you define what
the new functions should look like by writing tests first; then you can fill
in the actual implementation as you get the tests to pass.

## Setup:

If you've been following along with the course so far, your
`client/app/task-service.js` file should look like this:

```javascript
angular.module('ngcourse')
.factory('tasks', function(server) {
  var service = {};

  service.getTasks = function () {
    return server.get('/api/v1/tasks')
  };

  service.getMyTasks = function () {
    return service.getTasks()
    .then(function(tasks) {
      return filterTasks(tasks, {
        owner: user.username
      });
    });
  };

  return service;
});
```

Your `client/app/task-service.test.js` file should look like this:

```javascript
describe('tasks service', function () {
  // Load the angular module. Having smaller modules helps here.
  beforeEach(module('ngcourse'));
  beforeEach(module(function($provide){
    // Mock 'server'.
    $provide.service('server', function() {
      var service = {};
      var data = [{
        owner: 'bob',
        description: 'Mow the lawn'
      }];

      service.get = function () {
        return Q.when(data);
        // or try this: Q.reject(new Error('Some Error'));
      };
      return service;
    });
    // Mock $q.
    $provide.service('$q', function() {
      return Q;
    });
  }));

  it('should get tasks', function() {
    // Setup a variable to store injected services.
    var injected = {};
    // Run inject() to inject service.
    inject(function (tasks) {
      injected.tasks = tasks;
    });
    // Write a test that returns a promise;
    return injected.tasks.getTasks()
    .then(function (tasks) {
      expect(tasks.length).to.equal(1);
      // We no longer need to call done()
    });
  });
});
```

And your `client/app/server/server-service.js` file should look like this:

```javascript
angular.module('ngcourse.server', [])

.factory('server', function ($http, API_BASE_URL) {
  var service = {};

  service.get = function (path) {
    return $http.get(API_BASE_URL + path)
    .then(function (response) {
      return response.data;
    });
  };

  service.post = function (path, data) {
    return $http.post(API_BASE_URL + path, data);
  }

  service.put = function (path, id, data) {
    return $http.put(API_BASE_URL + path + '/' + id, data);
  }

  service.delete = function (path, id) {
    return $http.delete(API_BASE_URL + path + '/' + id, data);
  }

  return service;
});
```

# Exercise 1: Add the Ability to Create a New Task

Let's follow the steps to create an "add task" feature to your application. To
do this, we'll be calling `POST /api/v1/tasks` on the server.  We've already
defined a `post()` function in `server-service.js` that does this.  So, we need
to:

1. Add a mock version of this method in our mock server in
  `tasks-service.test.js`
2. Define a `createTask` function in `tasks-service.js`.
3. Write some tests in `task-service.test.js` that define what we want this
  new function's behaviour to be.  It should accept an object like

  ```javascript
  {
    owner: 'Alice',
    description: 'A newly-created task.'
  }
  ```

  and cause that task to be 'created' in the mock server.  Try using a sinon spy
  to verify this.
4. Hook the `task-service.js createTask()` function up to a button in `index.html`
  via `task-controller.js`.

# Exercise 2: Build out a 'Users Service'

The server also exposes some APIs to manipulate users.  Let's build a service,
similar to `tasks-service.js`, that allows the caller to get a list of users.

The HTTP call in question is `GET /api/v1/users`.  It will give you a response
like this:

```json
[
  {
    "_id": "54c5bf79959f98303cd372e0",
    "username": "ed",
    "password": "$2a$10$t4R1ndYMcEpT7.qZfPb2lO6rQXA0sNKFrm5S6Z0XH9cIptKg68Y3K",
    "displayName": "Ed Beeblebrox",
    "__v": 0
  },
  {
    "_id": "54c5bf79959f98303cd372dd",
    "username": "bob",
    "password": "$2a$10$t4R1ndYMcEpT7.qZfPb2lO6rQXA0sNKFrm5S6Z0XH9cIptKg68Y3K",
    "displayName": "Bob Beeblebrox",
    "__v": 0
  },
  ...
]
```

Tip: Just follow the pattern set by `tasks-service.js`.
* Expose the users API call from `app/core/server/server-service.js`
* Define `app/core/users/user-service.js` and
  `app/core/users/user-service.test.js`
* Follow same mocking and testing strategy as in `tasks-service.test.js`

# Exercise 3: Update tasks-service.js createTask() to Check the Owner

Now that you know how to get a list of users, you can update your
`tasks-service.js` to check that the given owner is valid before creating the
task.

Tips:
* Inject your users service into the `tasks-service.js` using dependency
  injection.
* Create a mock users service in `tasks-service.test.js` that gives you a
  controlled list of users.
* Add tests to `tasks-service.js createTask()` to validate the passed in owner
  field against the `username` fields from your mock users service.
* Add some unit tests for the happy case and the error case.

# Bonus Exercise:

Use the `ng-repeat` directive, `tasks-service.js getTasks()` and `task-controller`
to display a list of tasks in `index.html`.
