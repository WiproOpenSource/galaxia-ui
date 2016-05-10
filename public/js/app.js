var appmodule = angular.module('MyApp', ['ngRoute','ngAnimate','ngMaterial','ngMessages','mdDataTable','material.svgAssetsCache']);
appmodule.config([ '$routeProvider', '$locationProvider', '$mdThemingProvider', 
					function($routeProvider, $locationProvider,$mdThemingProvider) {
						$routeProvider.when('/containers', {
					        templateUrl: 'partials/hostcontainers.html',
					        controller: 'maincontroller'
					    }).when('/matrix', {
					        templateUrl: 'partials/matrix.html',
					        controller: 'maincontroller'
					    }).when('/dashboards', {
					        templateUrl: 'partials/dashboardlist.html',
					        controller: 'dashboardcontroller'
					    }).when('/searchnodes', {
					        templateUrl: 'partials/searchnodes.html',
					        controller: 'searchcontroller'
					    }).when('/delete', {
					        templateUrl: 'partials/deletedashboard.html',
					        controller: 'dashboardcontroller'
					    }).when('/dblink', {
					        templateUrl: 'partials/dashboardlink.html',
					        controller: 'dashboardviewcontroller'
					    }).when('/', {
					        templateUrl: 'partials/home.html'
					    });
					 
					    $mdThemingProvider.theme('default')
					      .primaryPalette('blue')
					      .accentPalette('red');
					}
]);

appmodule.controller('maincontroller', maincontroller)
appmodule.controller('menucontroller', menucontroller)
appmodule.controller('dashboardcontroller', dashboardcontroller)
appmodule.controller('searchcontroller', searchcontroller)
appmodule.controller('dashboardviewcontroller', dashboardviewcontroller)

appmodule.factory('dashboardservices', [function() {
		var containers = null;
		var label = null;
		var value = null;
		var link = null;
		return{
				add_containers: function(x) {
					containers = x;
				},
				retrieve_containers: function() {
					return containers;
				},
				add_label: function(x) {
					label = x;
				},
				retrieve_label: function() {
					return label;
				},
				add_value: function(x) {
					value = x;
				},
				retrieve_value: function() {
					return value;
				},
				add_link: function(x) {
					link = x;
				},
				retrieve_link: function() {
					return link;
				}				
		}
}])
appmodule.filter('keyboardShortcut', function($window) {
	    return function(str) {
	      if (!str) return;
	      var keys = str.split('-');
	      var isOSX = /Mac OS X/.test($window.navigator.userAgent);

	      var seperator = (!isOSX || keys.length > 2) ? '+' : '';

	      var abbreviations = {
	        M: isOSX ? '' : 'Ctrl',
	        A: isOSX ? 'Option' : 'Alt',
	        S: 'Shift'
	      };

	      return keys.map(function(key, index) {
	        var last = index == keys.length - 1;
	        return last ? key : abbreviations[key];
	      }).join(seperator);
	    };
});



