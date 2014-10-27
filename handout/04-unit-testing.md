# Part 4: Unit Testing

## The Rationale

Why bother with unit tests?

## The Toolchain

Let's talk about some of the available tools. Our preferred toolchain consists
of:

* Mocha - the actual test framework.
* Chai - an assertion library.
* Sinon - a spy library.
* Karma - a test "runner".
* Gulp - a task automation tool.
 
While we see this as the best combination of tools, a common alternative is
Jasmine, a somewhat older tool that combines features of Mocha, Chai and
Sinon.

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
not as we expect them to be. Chai has two styles: "TDD" and "BDD". We'll be
using the "BDD" style.

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

When mocking dependencies, wrap functions with `sinon.spy()`:

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
