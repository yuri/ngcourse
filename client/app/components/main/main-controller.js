'use strict';

angular.module('ngcourse')

.controller('MainCtrl', function ($log, router) {
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

  vm.goToMyAccount = router.goToMyAccount;
  vm.goToTasks = router.goToTasks;

  function userNameIsGood(username) {
    return username === 'yuri' || username === 'alice';
  };
});