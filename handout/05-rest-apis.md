After setting up a basic view we will set up the app to receive data from the
server using `$http.get`. To avoid doing server interaction in the controller,
we will start writing custom services using Angular’s `.factory()` method.
Server interaction introduces *asynchronicity*, so we look at *promises*,
which is currently the preferred approach to handling asynchronous code in
JavaScript. We will look at *chaining* promises, a well as error handling. In
addition to reusing promises created by `$http.get`, we will also create our
own using `$q`. We will also consider use of promises in `$timeout` and
`$interval`.

## Talking to a Rest Server via Postman

Before we begin talking to the server, let's get comfortable interacting with
the REST API using Postman.

If you do not have Postman install, get it here:

    <http://http://www.getpostman.com/>

Our server is setup at http://ngcourse.herokuapp.com/. Here is our `tasks` endpoint:

    http://ngcourse.herokuapp.com/api/v1/tasks

## Are we going to be using `$resource`?

No. We'll be using `$http`.

## $http.get

Let's start by just getting a list of tasks:

```javascript
  .controller('TaskListCtrl', function($http, $log) {
    var vm = this;
    vm.tasks = [];

    $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
      .success(function(data, status) {
        $log.info(data);
        vm.tasks = data;
      })
      .error(function(data, status) {
        $log.error(status, data);
      });
```

We'll focus on a different approach, though:

```javascript
  .controller('TaskListCtrl', function($http, $log) {
    var vm = this;
    vm.tasks = [];

    $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
      .then(function(response) {
        $log.info(response);
        vm.tasks = response.data;
      })
      .then(null, function(error) {
        $log.error(error);
      });
```

This takes advantage of the fact that `$http.get()` returns an object that can
act as a standard "promise".

In addition to `$http.get()`, there is also `$http.post()`, `$http.put()`,
`$http.delete()`, etc. They all return promises.