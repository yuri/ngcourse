angular.module('erg', 
  [
   'erg.server', 
   'erg.tasks',
   'erg.components',
   'ui.router'
  ])

.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {


  $locationProvider.html5Mode(false);

  $urlRouterProvider.otherwise('/tasks');

  $stateProvider
  .state('tasks', {
    url: '/tasks',
    controller: 'TaskListCtrl as taskList',
    templateUrl: '/app/sections/task-list/task-list.html'
  })
  .state('tasksDetail', {
    url: '/tasks/{_id}',
    controller: 'TaskDetailsCtrl as taskDetails',
    templateUrl: '/app/sections/task-list/task-details.html'
  })      .state('account', {
    url: '/my-account',
    template: 'my account',
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
        template: 'parent overriden<button ui-sref="tasks">Go to tasks</button>'
      }
    }
  });
})

.run(function($log) {
  $log.info('All ready!');
});