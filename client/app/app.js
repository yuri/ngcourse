angular.module('ngcourse', [
  'ngcourse.server',
  'ngcourse.tasks',
  'ngcourse.router'
])

.run(function ($log) {
  $log.info('All ready!');
});


