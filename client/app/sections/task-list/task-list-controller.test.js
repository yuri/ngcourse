xdescribe('tasks controller', 
  function () {
    // Load the angular module. Having smaller modules helps here.
    beforeEach(module('erg'));

    xit('testing the controller', function(done) {
      inject(function ($controller, $rootScope) {
        // Create a scope.
        var scope = {};
        // Instantiate a controller with the new scope.
        var ctrl = $controller('TaskListCtrl', {
          $scope: scope
        });
        // Wait for the controller to run.
        setTimeout(function() {
          expect(scope.tasks.length).to.equal(1);
          done();
        }, 100);
      });
    });
  }
);