# UI Router

Routing allows us to express some aspects of the app's state in the URL.
Unlike with server-side front-end solutions, this is optional - we can build
the full app without ever changing the URL. Adding routing, however, allows
the user to go straight into certain aspects of the app, which can be very
convenient. convenient.

## UI-Router

Angular's built in routing solution ('ng-route') has been de facto superceeded
by "ui-router". We'll be using that. To install UI-Router with Bower:

```bash
  bower install --save angular-ui-router
```

Then add `client/bower_components/angular-ui-router/release/angular-ui-router.js` to your `index.html`.

## Adding a "router" module.

Let's start by adding our own "router" module which will serve as a wrapper around ui-router. Our module will have a `.config()` section.

```javascript
  angular.module('erg.router', [
    'ui.router'
  ])

  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/tasks');

    $locationProvider.html5Mode(false);

    $stateProvider
      .state('tasks', {
        url: '/tasks',
        template: 'my tasks'
      });
  });
```

We'll also need to add a a placeholder to our template:

```html
  <div ui-view ng-show="main.user.isAuthenticated"></div>
```

Let's talk about why this need to happen in the "config" section.

## More States

```javascript
  $stateProvider
    .state('tasks', {
      url: '/tasks',
      template: 'my tasks'
    })
    .state('tasksDetail', {
      url: '/tasks/details',
      template: 'task details'
    })
    .state('account', {
      url: '/my-account',
      template: 'my account'
    });
```

## States with Parameters

```javascript
  .state('tasksDetail', {
    url: '/tasks/{_id}',
    template: 'task details'
  })
```

This can include regular expressions:

```javascript
  .state('tasksDetail', {
    url: '/tasks/{_id:[A-Za-z0-9-_]{0,}}',
    template: 'task details'
  })
```

## Controllers and Template URLs

```javascript
  $stateProvider
    .state('tasks', {
      url: '/tasks',
      controller: 'TaskListCtrl as taskList',
      templateUrl: '/app/sections/task-list/task-list.html'
    })
    .state('tasksDetail', {
      url: '/tasks/{_id}',
      template: 'task details'
    })
    .state('account', {
      url: '/my-account',
      template: 'my account'
    });
```

## Adding "Resolves"

```javascript
  .state('account', {
      url: '/my-account',
      template: 'My account',
      resolve: {
        timeout: function($timeout) {
          return $timeout(function() {}, 3000);
        }
      }
    });
```

I am not a bit fan of "resolves", but some people like them.

## Nesting Views

```javascript
  .state('foo', {
    url: '/foo',
    views: {
      'foo': {
        template: 'foo <div ui-view="bar@main"></div> +'
      }
    },
  })
  .state('foo.bar', {
    url: '/bar',
    views: {
      'bar@main': {
        template: 'bar'
      }
    }
  })
```

Include the initial view using `<div ui-router="foo"/>`.

## Transition Using `ui-sref`

```html
  <button ui-sref="tasks">Go to tasks</button>
```

## Transitions Using `$state.go()`.

We can transition using `$state.go()`:

```javascript
  $state.go('tasks.details', {_id: taskId});
```

However, let's wrap this in a service:

```javascript
  .factory('router', function($log, $state, $stateParams) {
    var service = {};

    service.goToTask = function(taskId) {
      $state.go('tasks.details', {_id: taskId});
    };

    return service;
  });
```

## Accessing Parameters Using `$stateParams`

```javascript
  $stateParams._id
```

But again, let's wrap it:

```javascript
  service.getTaskId = function() {
    return $stateParams._id;
  };
```

## Update Param Without a Reload

```javascript
  // Updates a state param without triggering a reload.
  function quietlyUpdateParam(key, value) {
    $state.params[key] = value;
    $stateParams[key] = value;
    $state.$current.params[key] = value;
  }
```

## More Advanced Handling Using `.provider`

```javascript
  .provider('router', function($stateProvider, $locationProvider, $urlRouterProvider) {

    // Set defaults and create the main state.

    this.addSection = function (section) {
      ...
      sections.push(section);
      $stateProvider.state('main.' + section.name, sectionStateConfig);
    };

    // Creates the service.
    this.$get = ['$state', '$stateParams', '$window', '$location',
      function ($state, $stateParams, $window, $location) {
        var service = {};

        // Implement the service.

        return service;
      }
    ];
  }
]);