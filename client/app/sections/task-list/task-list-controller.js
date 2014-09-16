'use strict';

  angular.module('erg')

  .controller('TaskListCtrl', function($log, $http) {

	var scope = this;
    scope.tasks = [];
	scope.numberOfTasks =0;

    var successFn= function(data, status) {
        $log.info(data);
        scope.tasks = data;
	    scope.numberOfTasks = scope.tasks.length;
      };

      var errorFn= function(data, status) {
        $log.error(status, data);
      };

    $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
      .success(successFn)
      .error(errorFn);

    scope.addTask = function() {
      scope.numberOfTasks = scope.tasks.length + 1;
    };
  });