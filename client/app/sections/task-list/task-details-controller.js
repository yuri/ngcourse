'use strict';

angular.module('erg')
.factory('user', function(server) {
	var service = {};
	service.getUser= function(){
		return {
			username: 'Alice',
			rate: 10,
			hours: 50
		};
	};
	return service;
})
.controller('TaskDetailsCtrl', function($stateParams, user) {
	var scope = this;
	scope._id = $stateParams._id;
	scope.user= user.getUser();
});