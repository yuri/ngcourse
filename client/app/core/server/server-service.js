angular.module('ngcourse.server', [])

.constant('API_BASE_URL', 'http://ngcourse.herokuapp.com')

.factory('server', function($http, API_BASE_URL, $timeout, $log) {
  var service = {};
  var delay = 0; // increase to fake slow server

  service.get = function (path) {
    return $timeout(function() {
        return $http.get(API_BASE_URL + path)
      }, delay)
      .then(function(response) {
        $log.debug('got response, extracting data');
        return response.data;
      });
  };

  return service;
});