angular.module('ngcourse.tasks', [
  'ngcourse.server'
])

.factory('tasks', function (server) {
  var service = {};

  var taskPromise;

  service.getTasks = function () {
    taskPromise = taskPromise || server.get('/api/v1/tasks');
    return taskPromise;
  };

  function filterTasks(list) {
    return list; // todo
  };

  service.getMyTasks = function () {
    return service.getTasks()
      .then(function(tasks) {
        return filterTasks(tasks, {
          owner: user.username
        });
      });
  };

  return service;
});