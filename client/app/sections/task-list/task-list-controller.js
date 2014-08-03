'use strict';

angular.module('erg')

.controller('TaskListCtrl', function($http, $log) {
  var scope = this;
  scope.tasks = [];

  $http.get('http://localhost:5000/api/v1/tasks')
    .then(function(response) {
      $log.info(response);
      scope.tasks = response.data;
    })
    .then(null, $log.error);

  scope.numberOfTasks = 0;
  scope.addTask = function() {
    scope.numberOfTasks += 1;
  };
});