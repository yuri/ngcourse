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