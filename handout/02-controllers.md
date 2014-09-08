# Part 2: Getting Started with the Client

This course will be organized around building a collaborative task manager. We
will start by building a client app, which we will later connect to a REST
API. Our first task is to setup a simple Angular app consisting of a few
*controllers* and a few *templates*, and to understand how they fit together
via *scopes* and the *digest cycle*. We'll be making use of common built-in
directives such as `ng-model`, `ng-show`, `ng-hide`, `ng-cloak`, `ng-if`, `ng-
repeat`. We will also discuss Angular’s dependency injection and the use of
`$log` for logging.

## The Most Trivial Angular App

Let's start by setting up a really simple angular app -- so simple in fact
that it won't do anything at all. Here is what we'll put in our HTML file.

```html
  <!DOCTYPE html>
  <html>
    <head>
      ...
      <script src="/bower_components/angular/angular.js"></script>
      <link rel="stylesheet" type="text/css" href="/css/styles.css"/>
    </head>
    <body>
      <div ng-app="erg">
        Hello!
      </div>
      <script src="/app/app.js"></script>
    </body>
  </html>
```

We'll also need a very very simple JavaScript file - our "app":

```javascript
  angular.module('erg', []);
```

## A "Classic" Controller

This app doesn't do anything at all. To make it do something remotely interesting we'll need to add a controller. We'll define the controller in a separate javascript file:

```javascript
  angular.module('erg')

  .controller('MainCtrl', function($scope) {
    $scope.username = 'alice';
    $scope.numberOfTasks = 0;
  });
```

We can now attach the controller to an element and start using the content of its scope:

```html
  <body>
    <div ng-app="erg">
      <div ng-controller="MainCtrl">
        Hello, {{username}}!
        You've got {{numberOfTasks}} tasks.
      </div>
    </div>
    <script src="/app/app.js"></script>
    <script src="/app/components/main/main-controller.js"></script>
  </body>
```

Note the directory structure and the file name conventions that we are using.

## Handling Events

If we put functions onto the controller's scope, we can attach those functions to DOM events.

Adding a function:

```javascript
  .controller('MainCtrl', function($scope) {
    $scope.username = 'alice';
    $scope.numberOfTasks = 0;
    $scope.addTask = function() {
      $scope.numberOfTasks += 1;
    };
  });
```

Attaching it to an event:

```html
  <div ng-controller="MainCtrl">
    Hello, {{username}}!
    You've got {{numberOfTasks}} tasks.<br/>
    <button ng-click="addTask()">Add task</button>
  </div>
```

## Debugging 1: JSHint

Use JSHint to catch simple mistakes in your code. From the command line:

```bash
  gulp lint
```

Or configure your editor to run JSHint for you.

Once you are running JSHint, it will tell you about some of the other things
you should be doing, such as using 'use strict'.

## Debugging 2: $log

```javascript
  .controller('MainCtrl', function($scope, $log) {
    $scope.username = 'alice';
    $scope.numberOfTasks = 0;
    $scope.addTask = function() {
      $log.debug('Current number of tasks:', $scope.numberOfTasks);
      $scope.numberOfTasks += 1;
    };
  });
```

## Debugging 3: Debugger

```javascript
  .controller('MainCtrl', function($scope, $log) {
    $scope.username = 'alice';
    $scope.numberOfTasks = 0;
    $scope.addTask = function() {
      debugger
      $log.debug('Current number of tasks:', $scope.numberOfTasks);
      $scope.numberOfTasks += 1;
    };
  });
```

## Debugging 4: Using the Console

Accessing an element's scope. Inspect the element in Chrome, and $scope will be set in the console.

```javascript
  $scope.numberOfTasks = 42;  // angular.element($0).scope();
  $scope.$apply();
```

Note that you *rarely* need to call `$apply()` on your own. Angular will
normally do it for you.

## A Look at Dependency Injection (DI)

This:

```javascript
  .controller('MainCtrl', function($scope, $log) {
    $log.debug('Hello');
  });
```

ends up being equivalent to this:

```javascript
  .controller('MainCtrl', function($log, $scope) {
    $log.debug('Hello');
  });
```

And this won't work at all:

```javascript
  .controller('MainCtrl', function(myScope, myLog) {
    myLog.debug('Hello');
  });
```

How come? The magic of Function.toString()!

DI "annotation":

```javascript
  .controller('MainCtrl', ['$scope', '$log',
    function($scope, $log) {
      $log.debug('Hello');
    }
  ]);
```

In which case you can rename the variables. (Don't do this!)

```javascript
  .controller('MainCtrl', ['$scope', '$log',
    function(x, y) {
      y.debug('Hello');
    }
  ]);
```

This used to be needed due to minification. Can now be handled with the ng-
annotate plugin for Gulp.

## Two-Way Binding with ng-model

We can also control a scope's value from the HTML:

```html
  <div ng-controller="MainCtrl">
    Enter username: <input ng-model="username"/><br/>
    <br/>
    Hello, {{username}}!
    You've got {{numberOfTasks}} tasks
    {{ username }} has {{numberOfTasks}} tasks.<br/>
    <button ng-click="addTask()">Add task</button>
  </div>
```

However: "ng-model" is a misnomer. Do not rely on controller's scope as your
"model"!

## Adding "Watchers"

Our controller can get alerted if the value on the scope changes:

```javascript
  .controller('MainCtrl', function($scope, $log) {
    $scope.username = 'alice';
    $scope.numberOfTasks = 0;
    $scope.addTask = function() {
      $log.debug('Current number of tasks:', $scope.numberOfTasks);
      $scope.numberOfTasks += 1;
    };
    $scope.$watch('username', function(newValue, oldValue) {
      $log.info(newValue, oldValue);
    });
  });
```

However: *this is rarely useful*. We'll see better ways of handling such things.

## Basic Form Validation

Angular provides us a few facilities to quickly validate forms:

```html
  <form name="form" novalidate>
    Enter username: <input ng-model="username" ng-maxlength="5" name="username"/>
    <span ng-show="form.username.$invalid">Oops</span>
  </form>
```

## Implementing "Login"

Let's add HTML to hide the login form upon login.

```html
  <div ng-controller="MainCtrl">
    <div ng-hide="isAuthenticated">
      Enter username: <input ng-model="username"/><br/>
      Password: <input type="password" ng-model="password"/><br/>
      <button ng-click="login()">Login</button>
    </div>
    <div ng-show="isAuthenticated">
      Hello, {{username}}!
      You've got {{numberOfTasks}} tasks<br/>
      <button ng-click="addTask()">Add task</button>
    </div>
  </div>
```

We'll need the following in the controller:

```javascript
  .controller('MainCtrl', function($scope, $log) {
    $scope.isAuthenticated = false;
    $scope.numberOfTasks = 0;
    $scope.login = function() {
      $scope.isAuthenticated = true;
    };
    $scope.addTask = function() {
      $scope.numberOfTasks += 1;
    };
  });
```

## Splitting Up the Controllers

This controller is getting unweildy. Let's split it into two. Our HTML:

```html
  <div ng-controller="MainCtrl">
    <div ng-hide="isAuthenticated">
      Enter username: <input ng-model="username"/><br/>
      Password: <input type="password" ng-model="password"/><br/>
      <button ng-click="login()">Login</button>
    </div>

    <div ng-show="isAuthenticated">
      Hello, {{username}}! {{numberOfTasks || 'No tasks'}}
    </div>

    <div ng-show="isAuthenticated" ng-controller="TaskListCtrl">
      {{username}}, you've got {{numberOfTasks}} tasks<br/>
      <button ng-click="addTask()">Add task</button>
    </div>
  </div>
```

And *two* JavaScript files!

In `client/app/components/main/main-controller.js`:

```javascript
  'use strict';

  angular.module('erg')

  .controller('MainCtrl', function($scope, $log) {
    $scope.isAuthenticated = false;
    $scope.login = function() {
      $scope.isAuthenticated = true;
    };
  });
```

In `client/app/sections/task-list/task-list-controller.js`:

```javascript
  'use strict';

  angular.module('erg')

  .controller('TaskListCtrl', function($scope, $log) {
    $scope.numberOfTasks = 0;
    $scope.addTask = function() {
      $scope.numberOfTasks += 1;
    };
  });
```

## Oddities

Let's observe some inheritance oddities.

## The "Controller As" Pattern

Give controller's scope an name and refer to its properties using this name:

```html
  <div ng-controller="MainCtrl as main">

    <div ng-hide="main.isAuthenticated" ng-controller="LoginFormCtrl as loginForm">
      Enter username: <input ng-model="loginForm.username"/><br/>
      Password: <input type="password" ng-model="loginForm.password"/><br/>
      <div ng-show="main.errorMessage">{{ main.errorMessage}}</div>
      <button ng-click="main.login(loginForm.username, loginForm.password)">Login</button>
    </div>

    <div ng-show="main.isAuthenticated">
      Hello, {{main.username}}!
    </div>

    <div ng-show="main.isAuthenticated" ng-controller="TaskListCtrl as taskList">
      {{main.username}}, you've got {{taskList.numberOfTasks}} tasks<br/>
      <button ng-click="taskList.addTask()">Add task</button>
    </div>

  </div>
```

We'll also need to change our controllers. First, `MainCtrl`:

```javascript
  .controller('MainCtrl', function($log) {
    var scope = this;
    scope.isAuthenticated = false;
    scope.login = function() {
      scope.isAuthenticated = true;
    };
  });
```

Then `TaskListCtrl`:

```javascript
  .controller('TaskListCtrl', function($log) {
    var scope = this;
    scope.numberOfTasks = 0;
    scope.addTask = function() {
      scope.numberOfTasks += 1;
    };
  });
```

And a trivial `LoginFormCtrl`:

```javascript
  .controller('LoginFormCtrl', function() {
    // Let's do nothing for now.
  });
```

## What's in $scope Now?

Note that $scope is still injectable!

```javascript
  .controller('TaskListCtrl', function($scope, $log) {
    $log.debug('$scope:', $scope);
    var scope = this;
    $scope.numberOfTasks = 0;
    scope.addTask = function() {
      scope.numberOfTasks += 1;
    };
  });
```

Consider not using $scope, though.

## How Do Our Controllers Communicate Now?

How do we get data from one controller's scope into the others. One possibility:

```html
  <button ng-click="main.login(loginForm.username, loginForm.password)">Login</button>
```

But we'll see a better approach shortly.

## Iteration

When we have a list of items, we use `ng-repeat` to create identical DOM for
each item.

```html
  <table>
    <tr>
      <th>Owner</th>
      <th>Task description</th>
    </tr>
    <tr ng-repeat="task in taskList.tasks">
      <td>{{task.owner}}</td>
      <td>{{task.description}}</td>
    </tr>
  </table>
```

In the controller all we do is set `tasks` to an array:

```javascript
  scope.tasks = [
    {
      owner: 'alice',
      description: 'Build the dog shed.'
    },
    {
      owner: 'bob',
      description: 'Get the milk.'
    },
    {
      owner: 'alice',
      description: 'Fix the door handle.'
    }
  ];
```

## Next Steps

Enough controllers for now. That not where you code should go in most cases!
Our next step will be to look at how to organize our code with using services.
