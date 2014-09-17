'use strict';

angular.module('erg.tasks', ['erg.server'])
    .constant('API_BASE_PATH', '/api/v1/tasks/')
    .factory('tasks', function(server, API_BASE_PATH) {
        var service = {};

        service.getTasks = function() {
            return server.get(API_BASE_PATH);
        };

        service.updateTask = function(task) {
            return server.put(API_BASE_PATH + task._id, task);
        }

        service.getTask = function(taskId) {
            return server.get(API_BASE_PATH + taskId).then(function(response) {
                var task = response[0];
                return task;
            });
        }
        service.addTask = function(task) {
            return server.post(API_BASE_PATH, task);
        }

        service.getMyTasks = function() {
            return service.getTasks()
                .then(function(tasks) {
                    return filterTasks(tasks, {
                        owner: user.username
                    });
                });
        };

        return service;
    });
