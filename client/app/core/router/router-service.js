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
    .state('tasksDetail', {
      url: '/tasks/{_id}',
      controller: 'TaskDetailsCtrl as task',
      template: 'task details for {{task.taskId}}'
    })
  .state('account', {
      url: '/my-account',
      template: 'My account',
      resolve: {
        greeting: function($timeout) {
          return $timeout(function() {
            return 'Hello';
          }, 3000);
        }
      }
    })
  .state('parent', {
    url: '/parent',
    views: {
      'parent': {
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
        template: 'child 2'
      }
    }
  })
.state('parent.child2.grandchild', {
    url: '/grandchild',
    views: {
      'child@parent': {
        template: 'parent overriden  <button ui-sref="tasks">Go to tasks</button>'
      }
    }
  });  
})

.run(function($log){
	$log.debug("url router up");
})

.factory('router', function ($log, $state, $stateParams) {
  var service = {};

  return service;
});