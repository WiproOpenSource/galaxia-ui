var appmodule = angular.module('MyApp1', ['ngRoute','ngAnimate','ngMessages']);
appmodule.config([ '$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider){
		$routeProvider.when('/', {
					        templateUrl:'partials/dashboard.html'
					    }).when('/index',{
							templateUrl:'partials/entities.html'
						}).when('/dblink',{
							templateUrl:'partials/dashboardlink.html'
						}).when('/entity',{
							templateUrl:'partials/chart.html',
						}).when('/viewChart',{
							templateUrl:'partials/viewChart.html'	
						});
		}
	]);	
	
appmodule.controller('maincontroller', maincontroller);

appmodule.factory('dashboardservices',[function() {
		var type = null;
		var port=null;
		var link=null;
		var recmetrics;
		var dashboardData = {},
			defaultDashboardData = {
				"templatename": "",
				"widgets":[],
				"metrics":[]
			};
			function resetDashboardData(){
			dashboardData = angular.copy(defaultDashboardData);
		}
		function getDashboardData(){
			return dashboardData;
		}
		function setDashboardName(dashboardName){
			dashboardData.templatename = dashboardName;
		}
		function setDashboardWidget(widgetNames){
			dashboardData.widgets = widgetNames;
		}
		function addDashboardWidget(widgetName){
			dashboardData.widgets.push(widgetName);
		}
		function removeDashboardWidget(widgetName){
			if(dashboardData.widgets.indexOf(widgetName) != -1)
				return dashboardData.widgets.splice( dashboardData.widgets.indexOf(widgetName), 1);
		}
		function addMetric(metric){
			dashboardData["metrics"] = metric;
		}
		function removeMetric(metric){
			var metricPosition = dashboardData.metrics.map(function(m){return m.name;}).indexOf(metric.name);
			if(metricPosition!==-1)
				return dashboardData.metrics.splice(metricPosition, 1);
		}
			return{
				dshbrd: {
					resetDashboardData: resetDashboardData,
					getDashboardData: getDashboardData,
					setDashboardName: setDashboardName,
					setDashboardWidget: setDashboardWidget,
					addDashboardWidget: addDashboardWidget,
					removeDashboardWidget: removeDashboardWidget,
					addMetric: addMetric,
					removeMetric: removeMetric
				},
				
				add_type: function(x){
						type = x;
					},
				retrieve_type:function(){
					return type;
				},
				add_port:function(x){
					port = x;
				},
				retrieve_port:function(){
					return port;
				},add_recmetrics: function(x){
					recmetrics = x;
				},
				retrieve_recmetrics:function(){
					return recmetrics;
				},add_link: function(x) {
					link = x;
				},
				retrieve_link: function() {
					return link;
				}
				
			}
}]);


