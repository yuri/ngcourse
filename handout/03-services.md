# $http.get, Services and Promises

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

Our server is setup at http://erg.herokuapps.com/. Here is our `tasks` endpoint:

    http://erg.herokuapps.com/api/v1/tasks

## Are we going to be using `$resource`?

No. We'll be using `$http`.

## $http.get

Let's start by just getting a list of tasks:

```javascript
  .controller('TaskListCtrl', function($http, $log) {
    var scope = this;
    scope.tasks = [];

    $http.get('http://locahost:3001/api/v1/tasks')
      .then(function(response) {
        $log.info(response);
      })
      .then(null, $log.error);
```




