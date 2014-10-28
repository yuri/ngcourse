'use strict';

angular.module('ngcourse.router', [
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
    .state('taskEdit', {
      url: '/tasks/{_id}',
      controller: 'TaskEditCtrl as taskEdit',
      templateUrl: '/app/sections/task-edit/task-edit.html'
    })
    .state('account', {
      url: '/my-account',
      template: 'my account'
    });
})

.factory('router', function ($log, $state, $stateParams) {
  var service = {};

  service.goToMyAccount = function() {
    $log.info('Going to account');
    $state.go('account');
  };

  service.goToTasks = function() {
    $log.info('Going to tasks');
    $state.go('tasks');
  };

  service.goToTaskEdit = function(id) {
    $state.go('taskEdit', {_id: id});
  };

  service.getTaskId = function() {
    return $stateParams._id;
  };

  return service;
});