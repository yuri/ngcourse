'use strict';

angular.module('ngcourse')

.controller('TaskListCtrl', function ($log) {
  var vm = this;
  vm.numberOfTasks = 0;
  vm.username = 'bob';
  vm.data = {
    username: 'bob'
  };
  // vm.data.username = 'bob';

  vm.addTask = function() {
    $log.debug(vm.numberOfTasks);
    vm.numberOfTasks += 1;
  };

  vm.tasks = [
    {
      owner: 'alice',
      description: 'Build the dog shed.'
    },
    {
      owner: 'bob',
      description: 'Get the milk.'
    },
    {
      owner: 'alice',
      description: 'Fix the door handle.'
    }
  ];
});