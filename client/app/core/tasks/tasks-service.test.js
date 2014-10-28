describe('tasks service', function () {

  beforeEach(module('ngcourse.tasks'));

  beforeEach(module(function($provide){
    // Mock 'server'.
    $provide.service('server', function() {
      var service = {};
      var data = [{
        owner: 'alice',
        description: 'Mow the lawn'
      }, {
        owner: 'bob',
        description: 'Wash the dishes'
      }];

      service.get = sinon.spy(function () {
        return Q.when(data);
        // or try this: Q.reject(new Error('Some Error'));
      });
      return service;
    });
    // Mock user
    $provide.service('user', function() {
      return {
        username: 'alice'
      };
    });
    // Mock $q.
    $provide.service('$q', function() {
      return Q;
    });
  }));

  // A "traditional" async test.
  it('should get tasks', function (done) {
    inject(function(tasks) {
      tasks.getTasks()
        .then(function(taskArray) {
          expect(taskArray.length).to.equal(2);
          done();   
        })
        .then(null, done);
    });
  });

  function getService(serviceName) {
    var serviceToRerturn;
    inject([serviceName, function(injectedService) {
      serviceToRerturn = injectedService;
    }]);
    return serviceToRerturn;
  }

  // An async test returning a promise.
  it('should get my tasks', function () {
    var tasks = getService('tasks');
    var server = getService('server');

    return tasks.getMyTasks()
      .then(function(taskArray) {
        expect(taskArray.length).to.equal(1);
        return tasks.getMyTasks()
          .then(function(anotherTaskArray) {
            server.get.should.have.been.calledOnce;
          });
      });
  });

});