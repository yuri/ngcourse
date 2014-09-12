'use strict';

angular.module('erg')

.controller('MainCtrl', function() {
        var scope = this;
        scope.isAuthenticated = false;

        scope.login = function(username, password) {
            scope.isAuthenticated = true;
            scope.username = username;
        }
    });

