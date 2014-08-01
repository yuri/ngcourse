'use strict';

angular.module('erg')

.controller('TaskListCtrl', function($scope) {
  $scope.numberOfTasks = 0;
  $scope.addTask = function() {
    $scope.numberOfTasks += 1;
  };
});