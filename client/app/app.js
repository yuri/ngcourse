angular.module('erg', ['erg.server', 'erg.tasks'])
	
  .run(function($log) {
    $log.info('All ready!');
  });