'use strict';

angular.module('erg.router', [
  'ui.router'
])

.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.otherwise('/tasks');

  $locationProvider.html5Mode(false);

  $stateProvider
      .state('tasks', {
        url: '/tasks',
        controller: 'TaskListCtrl as taskList',
        templateUrl: '/app/sections/task-list/task-list.html'
      })
      .state('tasksDetail', {
        url: '/tasks/{_id}',
        template: 'task details'
      })
      .state('foo', {
        url: '/foo',
        views: {
          'foo': {
            template: 'foo <div ui-view="bar@main"></div> +'
          }
        },
      })
      .state('foo.bar', {
        url: '/bar',
        views: {
          'bar@main': {
            template: 'bar'
          }
        }
      })
      .state('account', {
        url: '/my-account',
        template: 'My account',
        resolve: {
          timeout: function($timeout) {
            return $timeout(function() {}, 3000);
          }
        }
      });
})

.factory('router', function($log, $state, $stateParams) {
  var service = {};

  service.goToTask = function(taskId) {
    $state.go('tasks.details', {_id: taskId});
  };

  return service;
});