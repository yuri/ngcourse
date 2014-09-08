describe('tasks controller', 
  function () {
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
    

    it('testing the controller', function(done) {
      inject(function ($controller, $rootScope) {
        var ctrl = $controller('TaskListCtrl', {
        });
        // Wait for the controller to run.
        setTimeout(function() {
          expect(ctrl.tasks.length).to.equal(1);
          done();
        }, 100);
      });
    });
  }
);