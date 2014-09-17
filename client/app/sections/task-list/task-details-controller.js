'use strict';

  angular.module('erg')

  .controller('TaskDetailsCtrl', function($stateParams) {

	var scope = this;
  scope._id = $stateParams._id;

  });