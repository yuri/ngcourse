'use strict';

  angular.module('erg')

  .controller('MainCtrl', function($log) {
  	var scope=this;
    scope.isAuthenticated = false;
    scope.login = function(username, password) {
      scope.isAuthenticated = true;
      scope.username = username;
      scope.password= password;
    };    
  })
  .controller('LoginFormCtrl', function(){
  	
  });