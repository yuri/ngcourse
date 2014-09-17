'use strict';

angular.module('erg')

.controller('TaskListCtrl', function($log, tasks) {

    var scope = this;
    scope.tasks = [];
    scope.numberOfTasks = 0;

    tasks.getTasks()
        .then(function(tasks) {
            $log.info(tasks);
            scope.tasks = tasks;
            scope.numberOfTasks = scope.tasks.length;
        })
        .catch($log.error);


}).controller("TaskAddCtrl", function(tasks, $state) {
    var scope = this;
    scope.addTask = function(newTask) {

        tasks.addTask(newTask).then(function(response) {
            $state.go('tasks', {}, {
                reload: true
            });
        });
    };
});
