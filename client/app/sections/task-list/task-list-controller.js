'use strict';

angular.module('erg')

.controller('TaskListCtrl', function($scope, $log) {
    $log.debug('$scope:', $scope);
    var scope = this;
    scope.tasks = [{
        owner: 'alice',
        description: 'Build the dog shed.'
    }, {
        owner: 'bob',
        description: 'Get the milk.'
    }, {
        owner: 'alice',
        description: 'Fix the door handle.'
    }];

    scope.numberOfTasks = scope.tasks.length;
    scope.addTask = function() {
        scope.numberOfTasks += 1;
    };
});
