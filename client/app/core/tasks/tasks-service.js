'use strict';

angular.module('erg')
.factory('tasks', function($http, server) {
  var service = {};

  service.getTasks = function () {
    return server.get('/api/v1/tasks');
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