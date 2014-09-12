angular.module('erg.tasks', [
  'erg.server',
  'koast'
])

.factory('tasks', function($http, server, koast) {
  var service = {};

  service.getTasks = function () {
    return server.get('/api/v1/tasks')
    //return koast.queryForResources('tasks-plus');
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