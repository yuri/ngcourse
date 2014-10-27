angular.module('ngcourse.tasks', [
  'koast'
])

.factory('tasks', function (koast) {
  var service = {};

  function makeAuthenticatedMethod(functionToDelay) {
    return function () {
      var myArgs = arguments;
      return koast.user.whenAuthenticated()
        .then(function () {
          return functionToDelay.apply(service, myArgs);
        });
    };
  }

  service.getTasks = makeAuthenticatedMethod(function () {
    return koast.queryForResources('tasks');
  });

  service.addTask = makeAuthenticatedMethod(function (task) {
    return koast.createResource('tasks', task)
  });

  service.updateTask = makeAuthenticatedMethod(function (task) {
    return task.save();
  });

  service.getTask = makeAuthenticatedMethod(function (id) {
    return koast.getResource('tasks', {
      _id: id
    });
  });

  return service;
});