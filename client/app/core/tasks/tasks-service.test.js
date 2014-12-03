describe('tasks service', function () {

  beforeEach(module('ngcourse.tasks'));

  beforeEach(module(function($provide){
    // Mock 'server'.
    $provide.factory('server', function() {
      var service = {};
      var data = [{
        owner: 'alice',
        description: 'Mow the lawn'
      }, {
        owner: 'bob',
        description: 'Cook dinner'
      }, {
        owner: 'alice',
        description: 'Mow the lawn'
      }, {
        owner: 'bob',
        description: 'Mow the lawn'
      }];

      service.get = sinon.spy(function () {
        return Q.when(data);
        // or try this: Q.reject(new Error('Some Error'));
      });
      return service;
    });
    // Mock user.
    $provide.factory('user', function() {
      var service = {};
      service.getUsername = function () {
        return 'alice';
      };
      return service;
    });
    // Mock $q.
    $provide.service('$q', function() {
      return Q;
    });
  }));

  function getService(serviceName) {
    var serviceToReturn;
    inject([serviceName, function(injectedService) {
      serviceToReturn = injectedService;
    }]);
    return serviceToReturn;
  }

  it('should get loaded', function() {
    var tasks = getService('tasks');
    var server = getService('server');
    // Notice that the service is available inside the closure.
    // We can assert that the service has loaded.
    return tasks.getTasks()
      .then(function(taskArray) {
        expect(taskArray.length).to.equal(4);
        return tasks.getTasks();
      })
      .then(function() {
        server.get.should.have.been.calledOnce;
      });
  });




  it('should filter my tasks', function() {
    // Inject the service.
    var tasks = getService('tasks');

    // Notice that the service is available inside the closure.
    // We can assert that the service has loaded.
    return tasks.getMyTasks()
      .then(function(taskArray) {
        expect(taskArray.length).to.equal(2);
        expect(taskArray[0].owner).to.equal('alice');
        expect(taskArray[1].owner).to.equal('alice');
      });
  });
});