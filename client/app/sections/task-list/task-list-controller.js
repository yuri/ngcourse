'use strict';

angular.module('erg')

.controller('TaskListCtrl', function($http, $log, tasks) {
  var scope = this;
  scope.tasks = [];

  tasks.getTasks()
    .then(function(tasks) {
      scope.tasks = tasks;
    })
    .then(null, $log.error);

  scope.numberOfTasks = 0;
  scope.addTask = function() {
    scope.numberOfTasks += 1;
  };
});