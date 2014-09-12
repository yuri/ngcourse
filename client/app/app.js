angular.module('erg', [
  'erg.main-ctrl',
  'erg.tasks',
  'koast'
])

.run(function($log, koast) {
  $log.info('All ready!');
  koast.init({
    baseUrl: 'http://localhost:3001'
  });
  koast.setApiUriPrefix('/api/v1/');
  koast.addEndpoint('tasks-plus', ':taskId',{useEnvelope: true});
});

