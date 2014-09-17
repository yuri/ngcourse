angular.module('erg', [
    'erg.server',
    'erg.tasks',
    'erg.components',
    'ui.router'
])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {


    $locationProvider.html5Mode(false);

    $urlRouterProvider.otherwise('/tasks');

    $stateProvider
        .state('tasks', {
            url: '/tasks',
            views: {
                '': {
                    controller: 'TaskListCtrl as taskList',
                    templateUrl: '/app/sections/task-list/task-list.html'
                },
                'taskDetail@tasks': {
                    template: '<button ui-sref="tasks.add">Add Task</button>'
                }
            }
        }).state('tasks.detail', {
            url: '/{_id:[0-9a-fA-F]{24}}',
            views: {
                'taskDetail@tasks': {
                    controller: 'TaskDetailsCtrl as taskDetails',
                    templateUrl: '/app/sections/task-list/task-details.html'
                }
            }

        })
        .state('tasks.add', {
            url: '/add',
            views: {
                'taskDetail@tasks': {
                    controller: 'TaskAddCtrl as newTask',
                    templateUrl: '/app/sections/task-list/task-add.html'
                }
            }
        })
        .state('account', {
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
