'use strict';

angular.module('erg')

.controller('MainCtrl', function($scope) {
  $scope.isAuthenticated = false;
  $scope.login = function() {
    $scope.isAuthenticated = true;
  };
});
