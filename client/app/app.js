angular.module('erg', [
  'erg.tasks'
])

.run(function($log) {
  $log.info('All ready!');
});

