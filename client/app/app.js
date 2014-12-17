angular.module('ngcourse', [
  'ngcourse.server',
  'ngcourse.tasks',
  'ngcourse.router'
])

.run(function ($log, $rootScope) {
  $log.info('All ready!');
  $rootScope.title="Root Title";
});
