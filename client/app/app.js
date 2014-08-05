angular.module('erg', [
  'erg-server'
])

.run(function($log) {
  $log.info('All ready!');
});

