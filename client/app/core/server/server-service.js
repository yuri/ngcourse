angular.module('ngcourse.server', [])

.constant('BASE_URL', 'http://ngcourse.herokuapp.com')

.factory('server', function($http, BASE_URL) {
  var service = {};

  service.get = function (path) {
    return $http.get(BASE_URL + path)
      .then(function(response) {
        return response.data;
      });
  };

  return service;
});