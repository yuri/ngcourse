 angular.module('erg', ['erg.server'])
 	
 	.run(function($log, $rootScope) {
    	$log.info('STARTUP: All ready!');
    	$rootScope.title="Test App";
  	});