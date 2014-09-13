angular.module('erg', [
  'erg.main-ctrl',
  'erg.tasks',
   'erg.router',
  'koast'
])

.run(function($log, koast) {
  $log.info('All ready!');
  // local
  /*
  koast.init({
    baseUrl: 'http://localhost:3001'
  });
  koast.setApiUriPrefix('/api/v1/');*/
  // hosted
  
  koast.init({
    baseUrl: 'http://ngcourse.herokuapp.com'
  });
  koast.setApiUriPrefix('/api/v1/');

  koast.addEndpoint('tasks-plus', ':taskId',{ useEnvelope: true });
});

