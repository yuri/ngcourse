'use strict';

  angular.module('erg')

  .controller('TaskListCtrl', function($log, tasks) {

	var scope = this;
    scope.tasks = [];
	scope.numberOfTasks =0;

	 tasks.getTasks()
      .then(function(tasks) {
        $log.info(tasks);
        scope.tasks = tasks;
        scope.numberOfTasks = scope.tasks.length;
      })
      .catch($log.error);

    scope.addTask = function() {
      scope.numberOfTasks = scope.tasks.length + 1;
    };
  });