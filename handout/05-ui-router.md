# Part 6: UI Router

Routing allows us to express some aspects of the app's state in the URL.
Unlike with server-side front-end solutions, this is optional - we can build
the full app without ever changing the URL. Adding routing, however, allows
the user to go straight into certain aspects of the app, which can be very
convenient.

## UI-Router

Angular's built in routing solution ('ng-route') has been de facto superceeded
by "ui-router". We'll be using that. To install UI-Router with Bower:

```bash
  bower install --save angular-ui-router
```

Then add `client/bower_components/angular-ui-router/release/angular-ui-router.js` to your `index.html`.

## Adding a "router" Module.

Let's start by adding our own "router" module which will serve as a wrapper
around ui-router. Our module will have a `.config()` section.

```javascript
  angular.module('ngcourse.router', [
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
        greeting: function($timeout) {
          return $timeout(function() {
            return 'Hello';
          }, 3000);
        }
      }
    });
```

The "resolve" property in a state configuration allows us to specify a set of
dependencies that will need to resolved prior to transitioning to the new
state. Those dependencies become injectable in the route's controller. In the
example above, `greeting` property of the resolve is set to a function that
returns a promise that resolves to 'Hello' after 3000 msec. (We generate this
property using `$timeout`.) The UI-Router will wait until the promise
resolves, then make the transition. The state's controller will be able to
dependency-inject 'greeting', which will be set to 'Hello' by the time the
controller is initialized.

This approach can simplify controller code, but does so at the cost of
terrible user experience: after the user clicks on a button, nothing happens
for 3 seconds, leaving the user wondering what happened.

A better approach is to not rely on "resolve" and instead make the transition
immediately. The receiving controller can then decide what parts of the view
can be displayed right away and what parts will need to be displayed with a
short delay. For example, if the state involves displaying a list of objects
that need to be retrieved from the server, the app can display everything
other than the list, then make add the list items when they arrive. This
usually produces a more natural experience for the user.

## Nesting Views

```javascript
  .state('parent', {
    url: '/parent',
    views: {
      'parent': {
        template: 'parent view <div ui-view="child@parent"></div>'
      }
    },
  })
  .state('parent.child1', {
    url: '/child1',
    views: {
      'child@parent': {
        template: 'child 1'
      }
    }
  })
  .state('parent.child2', {
    url: '/child2',
    views: {
      'child@parent': {
        template: 'child 2'
      }
    }
  });
```

Include the initial view using `<div ui-router="parent"/>`.

Nesting views allows sophisticated routing where parts of the view are defined
by the parent state and parts are defined (or, overridden) by child states.
Note that states get nested implicitly, based on names: "parent.child1" will be
a child of "parent". (UI-Router also provides a facility for nesting states
explicitly.) Child state's URL is understood to be relative to the parents.
So, since "parent.child1" is a child of "parent" and parent's URL is "/parent",
the URL for "child1" is "/parent/child1".

In the example above, the parent view provides part of the view (the text
"parent view") and a placeholder where child states would go. When we visit
child1 and child2, the parent's part of the view remains unchanged, while the
child's section changes.

Alternatively, however, the child can override the parent's part of the view:

```javascript
  .state('parent.child2.grandchild', {
    url: '/grandchild',
    views: {
      'child@parent': {
        template: 'parent overriden'
      }
    }
  })
```

In this case the "grandchild" overrides the view earlier defined by child2.

When overriding parents views we need to refer to them using the ..@.. which allows us to specify an absolute path to the view.

## Transition Using `ui-sref`

We can easily transition between states using `ui-sref` directive:

```html
  <button ui-sref="tasks">Go to tasks</button>
```

## Transitions Using `$state.go()`.

We can also transition using `$state.go()`:

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

If we want to change the value of the parameters _without_ triggering a state
transition, we need to update the values in thre three different places where
the UI route keeps them.

```javascript
  // Updates a state param without triggering a reload.
  function quietlyUpdateParam(key, value) {
    $state.params[key] = value;
    $stateParams[key] = value;
    $state.$current.params[key] = value;
  }
```

An example of where this would be useful is a Google Maps style UI, where the
URL is continuosly updated as the user moves around the map.

## More Advanced Handling Using `.provider`

Our `router` method is currently limited by the fact that it is instantiated
only _after_ the states are configured. Because of that, it cannot offer
methods that would facilitate the task of defining states.

When an Angular app is initialized, Angular goes through the following steps:

1. Set the constants.
2. Create the providers.
3. Run `.config()` blocks.
4. Create services.
5. Run `.run()` blocks.

As a result, a service such as our `router` cannot be injected into a
`.config()` block - it simply does not exist at that point. Instead, we have
so far configured our states by calling methods on `$stateProvider`, which is
a _provider_, that is a "factory factory". A provider offers configuration
methods that can be invoked in a `.config` block and can then create the
service in the service creation phase.

If we want to offer a higher level interface to act as an alternative to using
`$stateProvider` directly, we will need to create our own privider. A basic
provider is just a function that returns an object with a `$get()` method.
This method is later used to create a service.

```javascript
  .provider('router', function($stateProvider, $locationProvider, $urlRouterProvider) {

    // Creates the service.
    this.$get = ['$state', '$stateParams', '$window', '$location',
      function ($state, $stateParams, $window, $location) {
        var service = {};

        // Implement the router service as before.

        return service;
      }
    ];
  });
```

Note that `.provider()` can only inject other providers and constants. It
cannot inject services, since those are not yet available when the provider is
instantiated. However, when we define our service creation function using
`$get()` we can inject services.

## Adding Configuration Methods

A provider that just defines `$get()` is not going to be very useful - we
might as well just use `.factory` in this case. However, use of `.provider`
allows us to add configuration methods. In this case, let's add a method
`.addSection`, which will add a set of states that would all be appended to
the same parent, defining a section of the application. With this approach,
different section of our applcation can define their substates without
stomping on each other's states.

```javascript
  .provider('router', function($stateProvider, $locationProvider, $urlRouterProvider) {

    // Set defaults and create the main state.

    this.addSection = function (section) {
      ...
      section.substates.forEach(function(substate) {
        $stateProvider.state('main.' + section.name, substate);
      });
    };
```

This allows us to define section states in the `.config()` block of that
section's module:

```javascript
  .config(function('routerProvider') {
    routerProvider.addSection({
      name: 'tasks',
      substates: [...]
    });
  });
```

## Using `.provider` to add Custom Service Methods

We can further use `.provider` to customize the service that will be created
eventually.

```javascript
  .provider('router', function($stateProvider, $locationProvider, $urlRouterProvider) {
    var sectionMethods = [];

    this.addSectionMethod = function (sectionName, methodName, handler) {
      sectionMethods[sectionName] = sectionMethods[sectionName] || {};
      sectionMethods[sectionName][methodName] = handler;
    };

    // Creates the service.
    this.$get = ['$state', '$stateParams', '$window', '$location',
      function ($state, $stateParams, $window, $location) {
        var service = {};

        // Add configured section methods to the service
        _.keys(sectionMethods).forEach(function(section) {
          service[section] = {};
          _.keys(sectionMethods[section]).forEach(function(method) {
            service[section][method] = function() {
              var args = Array.prototype.slice.call(arguments, 0);
              args.unshift(service); // Add service as the first argument.
              return sectionMethods[section][method].apply({}, args);
            };
          });
        });

        // Implement the rest of the service.

        return service;
      }
    ];
  });
```

This allows us to define custom methods while defining a section in a
`.config()` block of that section's module:

```javascript
  .config(function('routerProvider') {
    routerProvider.addSectionMethod('tasks', 'getTaskId',
      function (router) {
        return router.getParam('taskId');
      }
    );
    ...
  })
```

We can then later use this method in a controller as follows:

```javascript
  var taskId = router.tasks.getTaskId();
```
