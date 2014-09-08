'use strict';

  angular.module('erg')

  .controller('TaskListCtrl', function($log,$http, tasks) {
var scope = this;
    scope.tasks = [];

    tasks.getTasks()
      .then(function(tasks) {
        scope.tasks = tasks;
	    scope.numberOfTasks = tasks.length;
      })
      .then(null, $log.error);

    scope.addTask = function() {
      scope.numberOfTasks += 1;
    };
  });