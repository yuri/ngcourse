angular.module('ngcourse.tasks', [
  'ngcourse.server'
])

.factory('tasks', function (server) {
  var service = {};

  var taskPromise;

  service.getTasks = function() {
    taskPromise = taskPromise || server.get('/api/v1/tasks');
    return taskPromise;
  }

  service.getTaskById = function(id) {
    return service.getTasks()
      .then(function(allTasks) {
        var foundTask;
        allTasks.forEach(function(task) {
          if (task._id === id) {
            foundTask = task;
          }
        });
        return foundTask;
      });
  }

  // service.getMyTasks = function () {
  //   return service.getTasks()
  //     .then(function(taskArray) {
  //       var myTasks = [];
  //       taskArray.forEach(function(task) {
  //         if (task.owner === user.username) {
  //           myTasks.push(task);
  //         }
  //       })
  //       return myTasks;
  //     });
  // }

  return service;
});