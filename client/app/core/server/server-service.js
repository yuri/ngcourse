angular.module('erg.server', [])

.value('API_BASE_URL', 'http://ngcourse.herokuapp.com')

.factory('server', function($http, API_BASE_URL) {
    var service = {};

    service.put = function(path, data) {
        return $http.put(API_BASE_URL + path, data);
    }
    service.post = function(path, data) {
        return $http.post(API_BASE_URL + path, data);
    };

    service.get = function(path) {
        return $http.get(API_BASE_URL + path)
            .then(function(response) {
                return response.data;
            });
    };

    return service;
});
