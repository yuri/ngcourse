'use strict';

  angular.module('erg')

  .controller('TaskListCtrl', function($log) {
    var scope=this;
    scope.numberOfTasks = 0;
    scope.addTask = function() {
      scope.numberOfTasks += 1;
    };

	scope.tasks = [
	    {
	      owner: 'alice',
	      description: 'Build the dog shed.'
	    },
	    {
	      owner: 'bob',
	      description: 'Get the milk.'
	    },
	    {
	      owner: 'alice',
	      description: 'Fix the door handle.'
	    }
	  ];
    
  });