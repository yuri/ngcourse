angular.module('ngcourse.tasks', [
  'ngcourse.server'
])

.factory('tasks', function (server) {
  var service = {};

  service.getTasks = function() {
    return server.get('/api/v1/tasks');
  }

  // function getMyTasks() {
  //   return getTasks()
  //     .then(function(tasks) {
  //       return filterTasks(tasks, {
  //         owner: user.username
  //       });
  //     });
  // }

  return service;
});