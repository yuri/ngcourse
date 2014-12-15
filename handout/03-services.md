# Part 3: $http.get, Services and Promises

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

But what exactly is a promise?

## Promises vs Callbacks

JavaScript is single threaded, so we can't really ever "wait" for a result of
a task such as an HTTP request. Our base line solution is callbacks:

```javascript
  request(url, function(error, response) {
    // handle success or error.
  });
  doSomethingElse();
```

A few problems with that. One is the "Pyramid of Doom":

```javascript
  queryTheDatabase(query, function(error, result) {
    request(url, function(error, response) {
      doSomethingElse(response, function(error, result) {
        doAnotherThing(result, function(error, result) {
          request(anotherUrl, function(error, response) {
            ...
          })
        });
      })
    });
  });
```

And this is without any error handling! A larger problem, though: hard to decompose.

The essense of the problem is that this pattern requires us to specify the
task and the callback at the same time. In contrast, promises allow us to
specify and dispatch the request in one place:

```javascript
  promise = $http.get(url);
```
and then to add the callback later, and in a different place:

```javascript
  promise.then(function(response) {
    // handle the response.
  });
```

This also allows us to attach multiple handlers to the same task:

```javascript
  promise.then(function(response) {
    // handle the response.
  });
  promise.then(function(response) {
    // do something else with the response.
  });
```

## Unchaining Promises

You might have seen chained promises:

```javascript
  $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
    .then(function(response) {
      return response.data;
    })
    .then(function(tasks) {
      $log.info(tasks);
      vm.tasks = tasks;
    })
    .then(null, function(error) {
      $log.error(error);
    });
```

We could also make this more complicated:

```javascript
  $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
    .then(function(response) {
      var tasks = response.data;
      return filterTasks(tasks);
    })
    .then(function(tasks) {
      $log.info(tasks);
      vm.tasks = tasks;
    })
    .then(null, function(error) {
      $log.error(error);
    });
```

Or even:

```javascript
  $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
    .then(function(response) {
      return response.data;
    })
    .then(function(tasks) {
      return filterTasksAsynchronously(tasks);
    })
    .then(function(tasks) {
      $log.info(tasks);
      vm.tasks = tasks;
    })
    .then(null, function(error) {
      $log.error(error);
    });
```

To make sense, let's "unchain" this using variables:

```javascript
  var responsePromise = $http.get('http://ngcourse.herokuapp.com/api/v1/tasks');
  var tasksPromise = responsePromise.then(function(response) {
    return response.data;
  });
  var filteredTasksPromise = tasksPromise.then(function(tasks) {
    return filterTasksAsynchronously(tasks);
  });
  var vmUpdatePromise = filteredTasksPromise.then(function(tasks) {
    $log.info(tasks);
    vm.tasks = tasks;
  })
  var errorHandlerPromise = vmUpdatePromise.then(null, function(error) {
    $log.error(error);
  });
```

Let's work through this example.

## Promises Beget Promises (via `.then()`)

A key point to remember: unless your promise library is buggy, `.then()`
always returns a promise. Always.

```javascript
  p1 = getDataAsync(query);

  p2 = p1.then(function (results) {
    return transformData(results);
  });
```

`p2` is now a promise regardless of what transformData() returned. Even if
something fails.

If the callback function returns a value, the promise returns to that value:

```javascript
  p2 = p1.then(function (results) {
    return 1;
  });
```
`p2` will resolve to “1”.

If the callback function returns a promise, the promise returns to a
functionally equivalent promise:

```javascript
  p2 = p1.then(function (results) {
    var newPromise = getSomePromise();
    return newPromise;
  });
```

`p2` is now functionally equivalent to newPromise. It's not the same object,
however. Let's discuss why not.

```javascript
  p2 = p1.then(function (results) {
    throw Error('Oops');
  });

  p2.then(function (results) {
    // You will be wondering why this is never
    // called.
  });
```

`p2` is still a promise, but now it will be rejected with the thrown error.

Why won't the second callback ever be called?

## Catching Rejections

So, catch rejections:

```javascript
  $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
    .then(function(response) {
      return response.data;
    })
    .then(function(tasks) {
      return filterTasksAsynchronously(tasks);
    })
    .then(function(tasks) {
      $log.info(tasks);
      vm.tasks = tasks;
    }, function(error) {
      $log.error(error);
    });
```

What's the problem with this code?

So, the following is better.

```javascript
  $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
    .then(function(response) {
      return response.data;
    })
    .then(function(tasks) {
      return filterTasksAsynchronously(tasks);
    })
    .then(function(tasks) {
      $log.info(tasks);
      vm.tasks = tasks;
    })
    .then(null, function(error) {
      $log.error(error);
    });
```

Note that one catch at the end is often enough.

## Using an Existing Function As a Handler

```javascript
    .then(null, function(error) {
      $log.error(error);
    });
```

can be replaced with:

```javascript
    .then(null, $log.error);
```

Let's make sure we understand why.

## Returning Promises

There is one (common) case when it's ok to not catch the rejection:

```javascript
  return $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
    .then(function(response) {
      return response.data;
    });
```

That's passing the buck. But remember: the buck stops with the controller's
function that is triggered by Angular.

## Catch and Release

Or you can catch, do something, and still pass the exception onwards:

```javascript
  .then(null, function(error) {
    $log.error(error); // Log the error
    throw error; // Then re-throw it.
  });
```

Sometimes we may want to re-throw conditionally.

## Promise Chains Considered Harmful

A better approach is to break them up into meaningful functions.

```javascript
  function getTasks() {
    return $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
      .then(function(response) {
        return response.data;
      });
  }

  function getMyTasks() {
    return getTasks()
      .then(function(tasks) {
        return filterTasks(tasks, {
          owner: user.username
        });
      });
  }
 
  getMyTasks()
    .then(function(tasks) {
      $log.info(tasks);
      vm.tasks = tasks;
    })
    .then(null, $log.error);
```

## Services

Those functions need a better home, however. Take them out of the controller,
put them in services.

```javascript
'use strict';

angular.module('ngcourse')
.factory('tasks', function($http) {
  var service = {};

  service.getTasks = function () {
    return $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
      .then(function(response) {
        return response.data;
      });
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

Let's put this in `client/app/core/tasks/tasks-service.js` and add the path
our `index.html`.

We can now simplify our controller code:

```javascript
  .controller('TaskListCtrl', function($http, $log, tasks) {
    var vm = this;
    vm.tasks = [];

    tasks.getTasks()
      .then(function(tasks) {
        vm.tasks = tasks;
        vm.numberOfTasks = tasks.length;
      })
      .then(null, $log.error);

    vm.numberOfTasks = 0;
    vm.addTask = function() {
      vm.numberOfTasks += 1;
    };
  });
```

Note that we've injected our newly created service.

## Advantages of Keeping Code in Services

Let's discuss some of the advantages of keeping your code in services rather
than in controllers.

The rule of thumb: code that can be written without referring to a
controller's scope should be written this way and should be places in a
service.

## Using `.factory()` vs `.service()` vs `.provider()`

Note our use of `.factory()` to define a service. There is also `.service()`
and `.provider()`. Let's talk briefly about the differences.

## More Services

When it comes to services, the more the better. Let's refactor some of the
code from our `tasks` service into a new `server` services.

```javascript
  angular.module('ngcourse')

  .factory('server', function($http) {
    var service = {};

    var baseUrl = 'http://ngcourse.herokuapp.com';

    service.get = function (path) {
      return $http.get(baseUrl + path)
        .then(function(response) {
          return response.data;
        });
    };

    return service;
  });
```

While our `tasks` code gets simplified to:

```javascript
  service.getTasks = function () {
    return server.get('/api/v1/tasks');
  };
```

But why bother, you might ask? Lets go over some of the benefits.

## Using `.constant()` and `.value()`

We could decompose yet more, though:

```javascript
  .constant('API_BASE_URL', 'http://ngcourse.herokuapp.com')

  .factory('server', function($http, API_BASE_URL) {
    var service = {};

    service.get = function (path) {
      return $http.get(API_BASE_URL + path)
        .then(function(response) {
          return response.data;
        });
    };

    return service;
  });
```

Alternatively, we can use `.value()` instead of `.constant()`. However, when
in doubt, use `.constant()`.

## Modules

At this point we may want to consider breaking our code up into modules. E.g.,
let's make `server` its own module:

```javascript
  angular.module('ngcourse.server', [])

  .constant('API_BASE_URL', 'http://ngcourse.herokuapp.com')

  .factory('server', function($http, API_BASE_URL) {
    var service = {};

    service.get = function (path) {
      return $http.get(API_BASE_URL + path)
        .then(function(response) {
          return response.data;
        });
    };

    return service;
  });
```

We can then make it a dependency in our `ngcourse` module (in `app.js`):

```javascript
  angular.module('ngcourse', [
    'ngcourse.server'
  ]);
```

Note that an Angular "app" is basically just an Angular module.

Each module can define `.config()` and `.run()` sections. You will rarely see
`.config()` except when setting up routes. (We'll discuss it in that context.)
Your `.run()` is essentially you modules's equivalent of the "main" block.

```javascript
  angular.module('ngcourse', [
    'ngcourse.server'
  ])

  .run(function($log) {
    $log.info('All ready!');
  });
```

Keep in mind, though, that Angular's modules are somewhat of a fiction.

## Reusing Promises

```javascript
  var taskPromise;
  service.getTasks = function () {
    taskPromise = taskPromise || server.get('/api/v1/tasks');
    return taskPromise;
  };
```

## Postponing the Requests

```javascript
  .factory('server', function($http, user, API_BASE_URL) {
    var service = {};

    service.get = function (path) {
      return user.whenAuthenticated()
        .then(function() {
          return $http.get(API_BASE_URL + path);
        })
        .then(function(response) {
          return response.data;
        });
    };

    return service;
  });
```

## A Brand New Promise

Suppose we have a function that uses callbacks. We have a few options for
turning it into a function that returns a promise.

The first approach is to use `$q.defer()`:

```javascript
  function getFooPromise(param) {
    var deferred = $q.defer();
    getFooWithCallbacks(param, function(error, result) {
      if (error) {
        deferred.reject(error);
      } else {
        deferred.resolve(result);
      }
    });
    return deferred.promise;
  }
```

An alternative is to use the ES6-style constructor:

```js
  function getFooPromise(name) {
    return $q(function(resolve, reject) {
      getFooWithCallbacks(param, function(error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
```

This latter approach is less common today but is worth adopting since it is
closer to the native promise creation in ES6.

However, beware of a very common JavaScript antipattern that involves
unnecessary creation of new promises. This often goes by the name of "Deferred
Antipatern", but it applies equally to the ES6-style promise constructor. In
most cases, you do not need to create new promises from scratch and resolve
them yourself. If you got a promise from another function, you should use that
promise's `.then()` method to create further promises. It is almost never a
good idea to create a manually resolve a promise inside of a promise callback.

Converting a callback-style function to one returning a promise is about the
only valid case for using a promise constructor. Even in this case, however,
the result can be better achieved using a dedicated conversion function. For
example, if you have a function that relies on Node-style callbacks as in the
example above above, you can convert it using
[angular-promisify](https://github.com/rangle/angular-promisify) like so:

```js
  var getFooPromise = denodeify(getFooWithCallbacks);
```

While manually resolving promises is rarely a good idea, `$q` offers two
promise-creation methods that often come in very handy. You can use
`$q.when(value)` to create a promise that resolves to `value` and
`$q.reject(error)` to create a promise that rejects with `error`. Use those
methods when you want to avoid calling a function that would have given you
a promise.

```javascript
  service.get = function (path) {
    if (!networkInformation.isOnline) {
      return $q.reject('offline');
    } else {
      return user.whenAuthenticated()
        .then(function() {
          return $http.get(API_BASE_URL + path);
        })
        .then(function(response) {
          return response.data;
        });
    }
  };
```

Or, better yet:

```javascript

  function waitForPreconditions() {
    if (!networkInformation.isOnline) {
      return $q.reject('offline');
    } else {
      return user.whenAuthenticated();
    }
  }

  service.get = function (path) {
    return waitForPreconditions()
      .then(function() {
        return $http.get(API_BASE_URL + path);
      })
      .then(function(response) {
        return response.data;
      });
    }
  };
```

## Promises from `$timeout()`

Angular's `$timeout()` service also returns a promise. The same is true for a
number of other AngularJS functions.

## Promises vs Events

While promises are nearly always better than Node- style callbacks, the choice
of when to use promises vs a publish-subscribe approach (e.g., via
`$broadcast`) is a bit more complex. Here are the key differences between the
two approaches:

| Promises                           | Events (aka “Publish – Subscribe”) |
|------------------------------------|------------------------------------|
| Things that happen ONCE            | Things that happen MANY TIMES      |
| Same treatment for past and future | Only care about the future*        |
| Easily matched with requests       | Detached from requests             |

Promises are often the best approach for handling responses to an explicit
request, such as an HTTP call. Publish-subscribe often works better for
handling actions initiated by the user (except with modals).

## Next Steps

We now know most of what we need to know about services. Before we write more
service code, however, we need to get setup for unit testing.
