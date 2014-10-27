'use strict';

angular.module('ngcourse')

.controller('TaskAddCtrl', function ($log, tasks, router) {
  var vm = this;

  vm.cancel = router.goToTaskList;

  vm.save = function (task) {
    tasks.addTask(task)
      .then(function () {
        router.goToTaskList();
      })
      .then(null, $log.error);
  }
});