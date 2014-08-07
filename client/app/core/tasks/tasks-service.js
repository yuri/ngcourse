angular.module('erg.tasks', [
  'erg.server',
  'koast'
])

.factory('tasks', function($http, server, koast) {
  var service = {};

  service.getTasks = function () {
    return koast.user.whenAuthenticated()
      .then(function() {
        return koast.queryForResources('tasks-plus');
      })
      .then(function(tasks) {
        tasks.forEach(function(task) {
          console.log(task, task.can.edit);
        });
        return tasks;
      });
  };

  // service.getMyTasks = function () {
  //   return service.getTasks()
  //     .then(function(tasks) {
  //       return filterTasks(tasks, {
  //         owner: user.username
  //       });
  //     });
  // };

  return service;
});