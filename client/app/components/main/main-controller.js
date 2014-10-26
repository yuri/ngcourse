'use strict';

angular.module('ngcourse.main-ctrl', [
  'koast'
])

.controller('MainCtrl', function ($log, koast) {
  var vm = this;
  vm.user = koast.user;
  vm.login = function (form) {
    $log.info('logging in');
    koast.user.loginLocal(form)
      .then(function (response) {
        $log.info('response:', response);
        $log.info('koast:', koast.user);
      })
      .then(null, $log.error);
  };
  vm.logout = function () {
    koast.user.logout()
      .then(null, $log.error);
  };
});