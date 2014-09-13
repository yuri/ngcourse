angular.module('erg.server', [])

.constant('API_BASE_URL', 'http://localhost:5000')

.factory('server', function($http, API_BASE_URL) {
    var service = {};
    console.log('yeah');
    service.get = function(path) {
        console.log('yo');
        return $http.get(API_BASE_URL + path)
            .then(function(response) {
                return response.data;
            });
    };

    service.post = function(path, data) {
        return $http.post(API_BASE_URL + path, data);
    }

    service.put = function(path, id, data) {
        return $http.put(API_BASE_URL + path + '/' + id, data);
    }

    return service;
});
