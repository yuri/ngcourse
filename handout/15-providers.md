# Part 15: More Advanced Handling Using `.provider`

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
  routerProvider.addSectionMethod('tasks', 'getTaskId', function (router) {
    return router.getParam('taskId');
  });
...
});
```

We can then later use this method in a controller as follows:

```javascript
var taskId = router.tasks.getTaskId();
```
