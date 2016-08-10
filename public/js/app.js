/*
# Copyright 2016 - Wipro Limited
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
*/

var appmodule = angular.module('MyApp', ['ngRoute','ngAnimate','ngMaterial','ngMessages','mdDataTable','material.svgAssetsCache','chart.js']);
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
					    }).when('/searchcontainer', {
					        templateUrl: 'partials/searchcontainer.html',
					        controller: 'searchcontroller'
					    }).when('/delete', {
					        templateUrl: 'partials/deletedashboard.html',
					        controller: 'dashboardcontroller'
					    }).when('/dblink', {
					        templateUrl: 'partials/dashboardlink.html',
					        controller: 'dashboardviewcontroller'
					    }).when('/', {
					        templateUrl: 'partials/trial.html',
							controller:'myController'
					    }).when('/dash', {
					        templateUrl: 'partials/dashboard.html',
							controller: 'myController'
					    }).when('/trial',{
							templateUrl:'partials/trial.html',
							controller:'myController'
						}).when('/demo',{
							templateUrl:'partials/demo.html',
							controller:'myController'
						}).when('/chart',{
							templateUrl:'partials/canvas.html',
							controller:'chartctrl'
						}).when('/check',{
							templateUrl:'partials/check.html',
							controller:'Checkcontroller'
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
appmodule.controller('Checkcontroller',Checkcontroller)
appmodule.controller('myController',myController)

/*appmodule.controller('chartctrl',function($scope,$timeout,$http){
	/*$scope.selectedtiles = [];
	$http.get('/getTiles').success(function(data){
	$scope.selectedtiles = data;
	});
	$scope.showtile = function(tile){
		for( x=0;x<$scope.selectedtiles.length;x++){
			if($scope.selectedtiles[x] == tile) return true;
		}
	}
	
	$timeout(function(){
	$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
	},1000);
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right'
        }
      ]
    }
  };
})*/


appmodule.filter('toArray', function () {
  return function (obj, addKey) {
    if (!(obj instanceof Object)) {
      return obj;
    }
  };
});
appmodule.factory('dashboardservices', [function() {
		var containers = [];
		var label = null;
		var value = null;
		var link = null;
		var cshort = null;
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
				},
				add_cshort: function(x)	{
					cshort = x;
				},
				retrieve_cshort:function(x){
					return cshort;
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
appmodule.directive('hcChart', function () {
                return {
                    restrict: 'E',
                    template: '<div></div>',
                    scope: {
                        options: '='
                    },
                    link: function (scope, element) {
                        Highcharts.chart(element[0],scope.options);
                    }
                };
            })
appmodule.directive('hcPieChart', function () {
                return {
                    restrict: 'E',
                    template: '<div></div>',
                    scope: {
                        title: '@',
                        data: '='
                    },
                    link: function (scope, element) {
                        Highcharts.chart(element[0], {
                            chart: {
                                type: 'pie',
								height:250,
								width:250
                            },
                            title: {
                                text: scope.title
                            },
                            plotOptions: {
                                pie: {
                                    allowPointSelect: true,
                                    cursor: 'pointer',
                                    dataLabels: {
                                        enabled: true,
                                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                                    }
                                }
                            },
                            series: [{
                                data: scope.data
                            }]
                        });
                    }
                };
            });
			
