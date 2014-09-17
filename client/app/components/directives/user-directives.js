angular.module('erg.components', [])

	.directive('ergUser',
    function ($log,$parse) {
      var directive = {
        restrict: 'E', // vs 'A', 'AE'
        replace: true,
        template:'<span>{{username}}, cost: {{cost}}</span>'
      };

	  directive.scope = {
    		user: '=user'
  		};
      
	directive.link = function(scope, element, attrs) {
	var user= scope.user;
    var getCost = $parse(attrs.cost);

    scope.username=user.username;
    scope.cost = getCost({
      rate: user.rate,
      hours: user.hours,
    });
  };
      return directive;
    }
  )