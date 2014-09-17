'use strict';

angular.module('erg')
    .factory('user', function(server) {
        var service = {};
        service.getUser = function() {
            return {
                username: 'Alice',
                rate: 10,
                hours: 50
            };
        };
        return service;
    })
    .controller('TaskDetailsCtrl', function($stateParams, $state, user, tasks) {
        var scope = this;
        scope._id = $stateParams._id;
        scope.user = user.getUser();
        scope.task = {};
        tasks.getTask(scope._id).then(function(response) {
            scope.task = response;
        });
        scope.updateTask = function(task) {
            tasks.updateTask(task).then(function(response) {
                $state.go('tasks', {}, {
                    reload: true
                });
            });
        }

    });
