angular.module('ngcourse', [
  'ngcourse.server',
  'ngcourse.tasks'
])

.run(function ($log, $rootScope) {
  $log.info('All ready!');
  $rootScope.title="Root Title";
});
