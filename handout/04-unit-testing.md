# Part 4: Unit Testing

## The Rationale

Why bother with unit tests?

## What is the difference between an Integration Test and a Unit Test?

A **unit test** is used to test individual components of the system. An **integration test** is a test which tests the system as a whole, and how it will run in production.

Unit tests contain knowledge about the behavior of  a single unit of code. If the unit's behavior is modified, then the unit test must be updated as well. Unit tests do not contain any knowledge or assumptions about other parts of your codebase. When other parts of your codebase are modified, your unit tests **should not fail**. If they do fail, you have written a test that relies on other components, it is therefore not a unit test. Unit tests are cheap to maintain, and should only be updated when the individual units are modified.

An integration test has no knowledge of how your system is broken down into individual components. Instead it it makes assumptions about how the entire system works together in production. Integration tests will test whether features are actually working.

Anything in between the two are considered hybrid tests. Hybrid tests are expensive to maintain as they rely on several components, and are tightly coupled to the way the system functions. Any modification to a component, or the way they interact with each other, will require a long process of updating a hybrid test.

## Best Practices for Unit Testing

(A quick summary of the article [Writing Great Unit Tests: Best and Worst Practices by Steven Sanderson](http://blog.stevensanderson.com/2009/08/24/writing-great-unit-tests-best-and-worst-practises/))

- Make each test independent of each other
- Mock out all external dependencies and state
  - If you have to write your tests in a certain order to test them, this is not a good sign
- Don't make unnecessary assertions
  - It is counter productive to assert anything that is tested by another test
- Test only one code unit at a time
  - Avoid overlaps between tests, one unit can cascade outwards and cause failures everywhere
- The architecture of your code will determine how testable it is
  - If you are having a hard time testing your code, you should consider refactoring it to make it more testable
- Avoid repeating setup code
- Name your unit tests clearly and consistently
  - Unit tests should be viewed as documentation, it allows other developers to clearly see how your code operates and what it is expected to perform
  - Maintenance is hard if you don't know what you are trying to maintain

## The Toolchain

Let's talk about some of the available tools. Our preferred toolchain consists
of:

* Mocha - the actual test framework.
* Chai - an assertion library.
* Sinon - a spy library.
* Karma - a test "runner".
* Gulp - a task automation tool.

## Why Mocha?

While we see this as the best combination of tools, a common alternative is Jasmine, a somewhat older tool that combines features of Mocha, Chai and Sinon.

Mocha provides better support for asynchronous testing by adding support for the `done()` function. If you use it, your test doesn't pass until the `done()` function is called. This is a nice to have when testing asynchronous code. Mocha also allows for use of any assertion library that throws exceptions on failure, such as Chai.

## Setup

We'll be mostly running our tools via Gulp, replying on our `rangle-gulp`
module. So, Gulp is the only tool we need to setup globally.

```bash
  sudo npm install -g gulp
  npm install
  bower install
```

However, let's install Mocha as well, so that we could try using it manually:

```bash
  sudo npm install -g mocha
```

Now we can proceed to writing tests.

## A Basic Mocha Test

First, let's write a simple test and run it just using Mocha. Put this code
into `client/app/simple_test.js`.

```javascript
  // Define a test suite.
  describe('tasks', function () {
    // Define a test.
    it('should have 2*2 be equal to 4', function () {
      var x;
      // Do something.
      x = 2 * 2;
      // Check that the results are what we expect and throw an error if something is off.
      if (x!==4) {
        throw new Error('Failure of basic arithmetics.');
      }
    });
  });
```

We can now run this code with:

```bash
  mocha client/app/simple_test.js
```

## Mocha with Karma and Gulp

Run Karma via Gulp using:

```bash
  gulp karma
```

This will run **all** tests under client.

See `gulpfile.js` on how to implement the `karma` task and `rangle-gulp` code
for more details. Karma configuration is in `client/testing/karma.conf.js`.

## Skipping Tests

You can skip the whole suite:

```javascript
  xdescribe('tasks', function () {
    // ...
  });
```

Or just an individual test:

  ```javascript
    xit('should have 2*2 be equal to 4', function () {
      // ...
    });
  ```

Alternatively, we can *only* run a specific test:

  ```javascript
    it.only('2*2 should equal 4', function () {
      // ...
    });
  ```

## Mocha with Chai

Chai is an assertion library. It makes it easy to throw errors when things are
not as we expect them to be. Chai has two styles: "[TDD](http://en.wikipedia.org/wiki/Test-driven_development)" and "[BDD](http://en.wikipedia.org/wiki/Behavior-driven_development)". We'll be
using the "[BDD](http://en.wikipedia.org/wiki/Behavior-driven_development)" style.

We have already installed Chai when we ran `bower install` and we are already
loading it when we run Karma via `gulp`. So, now we can go straight to using
it.

```javascript
  // Load Chai's expect library for assertions.
  var expect = chai.expect;
  describe('arithmetics', function () {
    it('should have 2*2 be equal to 4', function () {
      var x = 2 * 2;
      var y = 4;
      // Assert that x is defined.
      expect(x).to.not.be.undefined;
      // Assert that x equals to specific value.
      expect(x).to.equal(4);
      // Assert that x equals to y.
      expect(x).to.equal(y);
      // See http://chaijs.com/api/bdd/ for more assertion options.
    });
  });
```

## Testing Angular Services

For testing Angular code we need to load modules and inject services.

```javascript
  'use strict';

  var expect = chai.expect;
  // move expect definitin to client/testing/test-utils.js

  describe('tasks service', function () {
    // Load the angular module. Having smaller modules helps here.
    beforeEach(module('ngcourse.tasks'));
    it('should get loaded', function() {
      // Inject the service.
      inject(function(tasks) {
        // Notice that the service is available inside the closure.
        // We can assert that the service has loaded.
        expect(tasks).to.not.be.undefined;
        expect(tasks.getTasks()).to.not.be.undefined;
      });
    });
  });
```

Let's save this to `client/app/core/tasks/tasks-service.test.js`.

The sad truth, though, is that we have only established that
`tasks.getTasks()` does return a promise. We can't really judge the success of
this test until we know what that promise resolves to.

## An Asynchronous Test

So, we want to check what the promise resolves too, but this only will happen
*later*. One solution is to setup an asynchronous promise.

So, we need to use an asynchronous test that would wait for
the promise to resolve.

```javascript
  describe('tasks service', function () {
    // Load the angular module. Having smaller modules helps here.
    beforeEach(module('ngcourse.tasks'));
    it('should get tasks', function(done) {
      // Notice that we've specified that our function takes a 'done' argument.
      // This tells Mocha this is an asynchronous test. An asynchronous test will
      // not be considered 'successful' until done() is called without any
      // arguments. If we call done() with an argument the test fails, treating
      // that argument as an error.
      inject(function (tasks) {
        tasks.getTasks()
          // Attach the handler for resolved promise.
          .then(function (tasks) {
            // Assertions thrown here will result to a failed promise downstream.
            expect(tasks).to.be.an.array;
            // Remember to call done(), othewise the test will time out (and
            // fail).
            done();
          })
          // Attach the error handler. This is very important and easy to forget.
          .then(null, function(error) {
            done(error); // This can be simplified - see below.
          });
      });
    });
  });
```

Let's run. Oh-oh.

## Mocking a Service

Our tests are not really "unit tests" if they make use of many layers of
dependencies - and especially if they make server calls. So, we need to "mock"
our dependencies.

```javascript
  describe('tasks service', function () {
    // Load the angular module. Having smaller modules helps here.
    beforeEach(module('ngcourse.tasks'));
    beforeEach(module(function($provide){
      // Mock 'server'.
      $provide.service('server', function() {
        var service = {};
        var data = [{
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

    it('should get tasks', function(done) {
      // Notice that we've specified that our function takes a 'done' argument.
      // This tells Mocha this is an asynchronous test. An asynchronous test will
      // not be considered 'successful' until done() is called without any
      // arguments. If we call done() with an argument the test fails, treating
      // that argument as an error.
      inject(function (tasks) {
        tasks.getTasks()
          // Attach the handler for resolved promise.
          .then(function (tasks) {
            // Assertions thrown here will result to a failed promise downstream.
            expect(tasks.length).to.equal(1);
            // Remember to call done(), othewise the test will time out (and
            // fail).
            done();
          })
          // Attach the error handler. This is very important and easy to forget.
          .then(null, function(error) {
            done(error); // This can be simplified - see below.
          });
      });
    });
  });
```

## Why Mock `$q`?

Angular's `$q` service ties promise resolution to the digest cycle. This
creates some challenges in the context of testing. We can resolve them using
`$rootScope.$apply()`, but this method can be quite fragile and is hard to get
to work right. My approach is to mock $q using Q.

## A Simplified Use of done()

If all we want to do in case of error is to pass it to done, we don't
actually need to define a new function in the handler. We can just provide
`done` as the handler.

```javascript
  .then(null, function(error) {
    done(error);
  });
```

is equivalent to:

```javascript
  .then(null, done);
```

## Mocha's Support for Promises;

Mocha's tests can alternatively just accept a promise. In most case this is
what you want to use.

```javascript
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
```

## Decompose Tests

Everything you know about decomposition applies to tests too.

```javascript
  // Retrieves an injected service.
  function getService(serviceName) {
    var injectedService;
    inject([serviceName, function(serviceInstance) {
      injectedService = serviceInstance;
    }]);
    return injectedService;
  }

  it('should get tasks', function() {
    var tasks = getService('tasks');
    return tasks.getTasks()
      .then(function (receivedTasks) {
        expect(receivedTasks.length).to.equal(1);
      });
  });
```

You can put this implementation of `getService()` into a separate JavaScript
file, e.g., `client/testing/test-utils.js`. It's ok to be a bit more lax when
it comes to globals for tests.

## Spying with Sinon

A test spy is a function that records arguments, return value, the value of `this`, and exception thrown (if any) for all its calls. A test spy can be an anonymous function or it can wrap an existing function.

Test spies can be used to test callbacks, how certain functions are used throughout the system, and asset whether specific functions were called.

When spying on existing functions, the original function will behave as normal, but we will obtain access to data about the calls, for example, how many times a function was called.

We can use spies When mocking dependencies, wrap functions with `sinon.spy()`:

```javascript
  // Mock 'server'.
  $provide.service('server', function() {
    var service = {};
    var data = [{
      description: 'Mow the lawn'
    }];

    service.get = sinon.spy(function () {
      return Q.when(data);
    });
    return service;
  });
```

You can then check if they were called:

```javascript
  it('should get tasks', function() {
    var tasks = getService('tasks');
    var server = getService('server');
    return tasks.getTasks()
      .then(function (receivedTasks) {
        expect(receivedTasks.length).to.equal(1);
        server.get.should.have.been.calledOnce;
      });
  });
```

## Testing Controllers

Testing controllers is harder, so generally speaking you want to make
your controllers so simple that testing them is less of a priority.

If you do want to test controllers, you do so using the following steps:

```javascript
  it('testing the controller', function(done) {
    inject(function ($controller, $rootScope) {
      // Create a scope.
      var scope = {};
      // Instantiate a controller with the new scope.
      var ctrl = $controller('TaskListCtrl', {
        $scope: scope
      });
      // Wait for the controller to run.
      setTimeout(function() {
        expect(ctrl.tasks.length).to.equal(1);
        done();
      }, 100);
    });
  });
```
