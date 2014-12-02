'use strict';

angular.module('ngcourse')

.controller('TaskListCtrl', function ($log) {
  var vm = this;

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

});