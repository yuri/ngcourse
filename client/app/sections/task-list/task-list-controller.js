'use strict';

angular.module('ngcourse')

.controller('TaskListCtrl', function ($log, tasks, $state) {
  var vm = this;

  tasks.getTasks()
    .then(function(tasks) {
      $log.debug('Got tasks.');
      vm.tasks = tasks;
    })
    .then(null, $log.error);

  vm.addTask = function() {
    $log.info('Adding a new task');
    vm.tasks.push({
      owner: 'alice',
      description: 'new task'
    });
  };

  vm.removeTask = function(index) {
    vm.tasks.splice(index, 1);
  };

  vm.goToTask = function(taskId) {
    $state.go('taskDetail', {id: taskId});
  };

});