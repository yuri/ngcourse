'use strict';

import {TaskListCtrl} from 'sections/task-list/task-list-controller';
import {TaskEditCtrl} from 'sections/task-edit/task-edit-controller';
import {TaskAddCtrl} from 'sections/task-add/task-add-controller';
import {TasksService} from 'core/tasks/tasks-service';
import {UsersService} from 'core/users/users-service';

angular.module('ngcourse', [
  'ngcourse.main-ctrl',
  'ngcourse.tasks',
  'ngcourse.users',
  'ngcourse.router',
  'koast',
  'ngcourse-example-directives'
]);

angular.module('ngcourse.tasks', ['koast']).service('tasks', TasksService);
angular.module('ngcourse.users', ['koast']).service('users', UsersService);

angular.module('ngcourse')

.controller('TaskListCtrl', TaskListCtrl)
.controller('TaskEditCtrl', TaskEditCtrl)
.controller('TaskAddCtrl', TaskAddCtrl)

// .constant('API_BASE_URL', 'http://localhost:7000')
.constant('API_BASE_URL', 'http://ngcourse.herokuapp.com')

.run(function ($log, koast, API_BASE_URL) {
  $log.info('All ready!');

  koast.init({
    baseUrl: API_BASE_URL
  });
  koast.setApiUriPrefix('/api/v2/');
  koast.addEndpoint('tasks', ':_id', {
    useEnvelope: true
  });
  koast.addEndpoint('users', ':_id', {
    useEnvelope: true
  });
});