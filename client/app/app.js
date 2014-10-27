angular.module('ngcourse', [
  'ngcourse.server',
  'ngcourse.tasks'
])

.run(function ($log) {
  $log.info('All ready!');
});
