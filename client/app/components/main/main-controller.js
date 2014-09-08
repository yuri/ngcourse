'use strict';

  angular.module('erg')
    .controller('MainCtrl', function($log) {
      var scope=this;

      scope.isAuthenticated = false;
      scope.login = function(username,password) {
        scope.username= username;
        scope.isAuthenticated = true;
      };
    })
    .controller('LoginFormCtrl', function() {
      // Let's do nothing for now.
    });  