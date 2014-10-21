angular.module('erg', [
  'erg.main-ctrl',
  'erg.tasks',
  'erg.router',
  'koast'
])

.run(function ($log, koast) {
  $log.info('All ready!');

  koast.init({
    baseUrl: 'http://ngcourse.herokuapp.com'
    // baseUrl: 'http://localhost:7000'
  });
  koast.setApiUriPrefix('/api/v2/');
  koast.addEndpoint('tasks', ':taskId', {
    useEnvelope: true
  });
});
