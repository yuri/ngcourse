'use strict';

angular.module('ngcourse')

.controller('TaskEditCtrl', function ($log, tasks, router) {
  var vm = this;
  vm.taskId = router.getTaskId();
  tasks.getTaskById(vm.taskId)
    .then(function(task) {
      vm.task = task;
    })
    .then(null, $log.error);
});