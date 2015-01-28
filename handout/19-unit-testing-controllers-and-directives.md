# Part 19: Unit Testing Controllers and Directives

In part 9, we talked about unit testing services.  Most of your code should live
in services, in part because they are easy to unit test.

However, there may be times when you need to unit test logic that lives in
a controller or a directive;  this is a little more trickier to set up.

## Unit Testing Controllers

Let's try to write some unit tests for `TaskListCtrl` in
`client/sections/task-list`.

```javascript
var expect = chai.expect;

describe('TaskAddCtrl', function() {
  beforeEach(module('ngcourse'));

  var taskAddController;
  var mockTasks = {};
  var mockRouter = {};

  beforeEach(inject(function($controller, $log) {
    taskAddController = $controller('TaskAddCtrl', {
      $log: $log,
      tasks: mockTasks,
      router: mockRouter
    });
  }));

  it('gets instantiated correctly', function() {
    expect(taskAddController).to.be.ok();
  });
});
```

Copy-and-paste the code above to
`client/app/sections/task-add/task-add-controller.test.js` and run the unit
tests with `gulp karma`.

The test above shows an example of how to set up a controller with mock
dependencies in the unit tests.  The main difference with services is that
we need to use Angular's `$controller` service to instantiate our controller.

We can then pass an object containing named mock versions of all
`TaskAddCtrl`'s dependencies.  Here we're using `console` as a stand-in for
`$log` and empty objects as stand-ins for the TasksService and RouterService.

The actual test is trivial - it just checks that we instantiated the controller
successfully.  Let's try writing something more useful.

```javascript
describe('TaskAddCtrl', function() {
  beforeEach(module('ngcourse'));

  var taskAddController;
  var mockTasks;
  var mockRouter;

  beforeEach(inject(function($controller, $log) {
    mockTasks = {
      addTask: sinon.spy(function() {
        return Q.when();
      })
    };

    mockRouter = {
      goToTaskList: sinon.spy()
    };

    taskAddController = $controller('TaskAddCtrl', {
      $log: $log,
      tasks: mockTasks,
      router: mockRouter
    });
  }));

  it('cancel sends you back to the task list', function() {
    taskAddController.cancel();
    mockRouter.goToTaskList.should.have.been.calledOnce;
  });

  it('save adds a task and takes you back to the task list', function() {
    var newTask = {
      owner: 'bob',
      description: 'a new task'
    };

    return taskAddController.save(newTask)
      .then(function() {
        mockTasks.addTask.should.have.been.calledOnce;
        mockRouter.goToTaskList.should.have.been.calledOnce;
      });
  })
});
```

Although we strongly encourage the use of the `Controller As` pattern to keep
`$scope` out of your controllers, if you need to test legacy code it may be
useful to inject  a mock `$scope` into your tests.  It works the same way
as any other dependency:

```javascript
describe('OldStyleController with $scope')
  var $scope, controller;

  beforeEach(function() {
    $scope = {};
    controller = $controller('OldStyleController', { $scope: $scope });
  });

  // ...
```

## Unit Testing Directives

Unit testing directives is much trickier, mostly due to the need to handle the
HTML templates.  This is why we so strongly encourage writing directives that
offload most of their logic to services.

However, you may need to know how to unit test legacy directives that contain
lots of code.  Here are some examples.

Consider the following simple directive (go ahead and copy it to
`client/app/ngc-user-directive.js`):

```javascript
angular.module('ngcourse-directives', [])
  .directive('ngcUser', function () {
    return {
      restrict: 'E',
      scope: {
        user: '='
      },
      template:'<span>Hello, {{ user.name }}.</span>'
    };
  });
```

A unit test for it might look like this (copy this to
`client/app/ngc-user-directive-test.js`):

```javascript
var expect = chai.expect;

describe('ngcUser directive', function() {
  beforeEach(module('ngcourse-directives'));

  var compile;
  var rootScope;

  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    rootScope = $rootScope;
  }));

  it('generates the appropriate HTML', function() {
    var scope = rootScope.$new();
    scope.aUser = { name: 'Alice' };

    var element = compile('<ngc-user user="aUser"></ngc-user>')(scope);
    scope.$digest();

    expect(element.html()).to.contain('Hello, Alice.');
  });
});
```

There's a lot going on here, so let's break it down a bit.

First, we're using `inject()` to get access to two Angular services:

* $compile - used for evaluating the directive's template HTML.
* $rootScope - used to create a $scope object for passing test data into the directive.

In the test itself, we:

1. Create a `$scope` and assign some data to it.  This represents the scope of the
  page in which the directive would be used.
2. Create the directive using its HTML form, the way it would be used in real code.
3. Tell Angular to evaluate the template HTML based on the $scope we constructed.
4. Manually trigger Angular's digest cycle, which causes any angular expressions
  (`{{ }}` blocks) in the directive's template HTML to be evaluated.
5. Verify that the expected markup was generated by the directive.
