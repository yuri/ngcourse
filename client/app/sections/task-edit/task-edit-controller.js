'use strict';

angular.module('ngcourse')

.controller('TaskEditCtrl', function ($log, router, $timeout) {
  var vm = this;
  var id = router.getTaskId();
  // if (/^[0-9]*$/.test(id)) {
  //   vm.id = id;
  // } else {
  vm.id = id;
  // $timeout(function() {
  //     vm.id = id;
  //   }, 3000);
});