'use strict';

angular.module('erg')

.controller('MainCtrl', function() {
  var $scope = this;
  $scope.isAuthenticated = false;
  $scope.login = function(username, password) {
    console.log('hello', username, password);
    if (password==='banana') {
      $scope.isAuthenticated = false;
      $scope.errorMessage = 'Wrong password!';
      $scope.username = null;
    } else {
      $scope.isAuthenticated = true;
      $scope.username = username;
    }
  };
});
