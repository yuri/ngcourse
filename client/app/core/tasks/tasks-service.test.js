describe('tasks service', function () {
  // Load the angular module. Having smaller modules helps here.
  beforeEach(module('erg.tasks'));
  beforeEach(module(function($provide){
    // Mock 'koast'.
    $provide.service('server', function() {
      var service = {};
      var data = [{
        description: 'Mow the lawn'
      }];

      service.get = sinon.spy(function () {
        var deferred = Q.defer();
        deferred.resolve(data);
        // deferred.reject(new Error('Some Error'));
        return deferred.promise;
      });
      return service;
    });
    // Mock $q. More on this later.
    $provide.service('$q', function() {
      return Q;
    });
  }));

  it('should get tasks', function() {
    var tasks = getService('tasks');
    var server = getService('server');
    return tasks.getTasks()
      .then(function (receivedTasks) {
        expect(receivedTasks.length).to.equal(1);
        server.get.should.have.been.calledOnce;
      });
  });
});