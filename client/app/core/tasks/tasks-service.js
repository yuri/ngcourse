angular.module('ngcourse.tasks', [
  'ngcourse.server'
])

.factory('tasks', function (server, user) {
  var service = {};

  var taskPromise;

  service.getTasks = function() {
    taskPromise = taskPromise || server.get('/api/v1/tasks');
    return taskPromise;
  }

  service.getMyTasks = function () {
    return service.getTasks()
      .then(function(taskArray) {
        var myTasks = [];
        taskArray.forEach(function(task) {
          if (task.owner === user.username) {
            myTasks.push(task);
          }
        })
        return myTasks;
      });
  }

  return service;
});