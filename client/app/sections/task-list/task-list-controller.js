'use strict';

angular.module('ngcourse')

.controller('TaskListCtrl', function ($log, tasks) {
  var vm = this;

  tasks.getTasks()
    .then(function(taskArray) {
      $log.info(taskArray);
      vm.tasks = taskArray;
    })
    .then(null, $log.error);
});