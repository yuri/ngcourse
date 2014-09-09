describe('tasks service 1', function () {
    // Load the angular module. Having smaller modules helps here.
    beforeEach(module('erg'));
    it('should get tasks', function(done) {
      // Notice that we've specified that our function takes a 'done' argument.
      // This tells Mocha this is an asynchronous test. An asynchronous test will
      // not be considered 'successful' until done() is called without any
      // arguments. If we call done() with an argument the test fails, treating
      // that argument as an error.
      inject(function (tasks, $rootScope, $httpBackend) {
        $httpBackend.expectGET('http://ngcourse.herokuapp.com/api/v1/tasks').respond([{ test: 'true' }]);
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
          $httpBackend.flush();
          $rootScope.$apply();
      });
    });
  });

describe('tasks service', function () {
    // Load the angular module. Having smaller modules helps here.
    beforeEach(module('erg'));
    beforeEach(module(function($provide){
      // Mock 'server'.
      $provide.service('server', function() {
        var service = {};
        var data = [{
          description: 'Mow the lawn'
        }];

        // service.get = function () {
        //   return Q.when(data);
        //   // or try this: Q.reject(new Error('Some Error'));
        // };

        service.get = sinon.spy(function () {
          return Q.when(data);
        });

        return service;
      });
      // Mock $q.
      $provide.service('$q', function() {
        return Q;
      });
    }));

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
    var server = getService('server');    
    return tasks.getTasks()
      .then(function (receivedTasks) {
        expect(receivedTasks.length).to.equal(1);
        server.get.should.have.been.calledOnce;        
      });
  });

    it('testing the controller', function(done) {
      inject(function ($controller, $rootScope) {
        // Create a scope.
        // var scope = {};
        // Instantiate a controller with the new scope.
        var ctrl = $controller('TaskListCtrl', {
          // $scope: scope
        });
        // Wait for the controller to run.
        setTimeout(function() {
          expect(ctrl.tasks.length).to.equal(1);
          done();
        }, 100);
      });
    });
  

});