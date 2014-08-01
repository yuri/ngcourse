'use strict';

angular.module('erg')

.controller('TaskListCtrl', function() {
  var $scope = this;
  $scope.tasks = [
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
  $scope.numberOfTasks = 0;
  $scope.addTask = function() {
    $scope.numberOfTasks += 1;
  };
});