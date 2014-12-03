angular.module('ngcourse.tasks', [
  'ngcourse.server'
])

.factory('tasks', function (server, user, $q) {
  var service = {};

  var taskPromise;

  service.getTasks = function () {
    taskPromise = server.get('/api/v1/tasks');
    return taskPromise;
  };

  function filterUsersTasks(tasks) {
    return _.filter(tasks, function(task) {
      return task.owner === user.getUsername();
    });
  }

  service.getMyTasks = function () {
    return service.getTasks()
      .then(filterUsersTasks);
  };

  return service;
});

