'use strict';

angular.module('ngcourse')

.controller('TaskListCtrl', function ($log, tasks, router) {
  var vm = this;

  vm.goToTaskEdit = router.goToTaskEdit;

  tasks.getTasks()
    .then(function(taskArray) {
      $log.info(taskArray);
      vm.tasks = taskArray;
    })
    .then(null, $log.error);
});