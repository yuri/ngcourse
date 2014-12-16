'use strict';

function main_controller ($log, $window) {
  var vm = this;
  vm.username = 'Alice';

	vm.isAuthenticated = false;
  vm.login = function() {
    vm.isAuthenticated = true;
  };
}

angular.module('ngcourse')

.controller('MainCtrl', main_controller )

.controller('HeaderCtrl', function($scope){
	$scope.title="Angular App";
});
