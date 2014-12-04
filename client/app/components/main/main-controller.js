'use strict';

angular.module('ngcourse')

.controller('MainCtrl', function ($log) {

  var vm = this;

  vm.username = 'alice';
  vm.isAuthenticated = true;
  vm.login = function(username, password) {
    if (username === 'alice' && password === 'x') {
      $log.info('The password is good.');
      vm.isAuthenticated = true;      
    } else {
      vm.errorMessage = 'Bad password';
    }
  };

  $log.info('MainCtrl loaded');
});