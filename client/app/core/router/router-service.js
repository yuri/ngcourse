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
      templateUrl: '/app/sections/task-list/task-list.html',
      controller: 'TaskListCtrl as taskList'
    })
    .state('taskDetail', {
      url: '/tasks/:id',
      template: 'task {{task.id}}. <span ui-sref="tasks">go back</span>',
      controller: 'TaskEditCtrl as task'
    })
    .state('account', {
      url: '/account',
      template: 'my account'
    })
    .state('parent', {
      url: '/parent',
      views: {
        'parent@main': {
          template: 'parent view <div ui-view="child@parent"></div>'
        }
      },
    })
    .state('parent.child1', {
      url: '/child1',
      views: {
        'child@parent': {
          template: 'child 1'
        }
      }
    })
    .state('parent.child2', {
      url: '/child2',
      views: {
        'child@parent': {
          template: 'child 2 <span ui-view="grandchild@child"/>'
        }
      }
    })
    .state('parent.child2.grandchild1', {
      url: '/grandchild1',
      views: {
        'grandchild@child': {
          template: 'grandchild1'
        }
      }
    })
    .state('parent.child2.grandchild2', {
      url: '/grandchild2',
      views: {
        'parent@main': {
          template: 'grandchild2'
        }
      }
    });
})

.factory('router', function ($log, $state, $stateParams) {
  var service = {};

  service.getTaskId = function() {
    return $stateParams.id;
  };

  return service;
});