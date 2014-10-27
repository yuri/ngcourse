'use strict';

angular.module('ngcourse')

.controller('MainCtrl', function ($log) {
  var vm = this;
  vm.username = 'alice';
  vm.userNameError = '';
  vm.isAuthenticated = true;

  vm.login = function(username, password) {
    if (password === 'banana') {
      vm.isAuthenticated = true;
    } else {
      vm.loginError = 'Bad password';
    }
  }

  function userNameIsGood(username) {
    return username === 'yuri' || username === 'alice';
  };
});