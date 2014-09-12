'use strict';

angular.module('erg')

.controller('TaskListCtrl', function($http, $log) {
    var scope = this;
    scope.tasks = [];


    $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
        .success(function(data, status) {
            $log.info(data);
            scope.tasks = data;
            scope.numberOfTasks = scope.tasks.length;
        })
        .error(function(data, status) {
            $log.error(status, data);
        });

    scope.addTask = function() {
        scope.numberOfTasks += 1;
    };
});
