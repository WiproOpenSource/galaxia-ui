function maincontroller($scope, $timeout, $http, $window, dashboardservices){
      $scope.retrieveNodes = function(){
        $scope.actionlabel = dashboardservices.retrieve_label();
        $scope.val = dashboardservices.retrieve_value();

        $http.get("/getnodes/"+$scope.actionlabel).success(function(data){
          $scope.containers = data;
        });
      }

      $scope.retrieveMetrics = function(){
        $scope.actionlabel = dashboardservices.retrieve_label();

        $http.get("/getmetrics/"+$scope.actionlabel).success(function(data){
          $scope.metrics_list = data;
        });
      }

		  $scope.configureDashboard = function() {
        $window.location.href = '#/matrix'
		  };
	
      $scope.addSelectedContainers = function(rows) {
        dashboardservices.add_containers(rows);
      };
		
      $scope.addSelectedMatrix = function(rows) {
        $scope.selectedMatrix = rows;
      };

      $scope.saveDashboard = function() {
        var json_obj = {};
        json_obj.name = $scope.dbname;
        json_obj.unit_type = "docker";
        json_obj.metrics_list = $scope.selectedMatrix;
        json_obj.names_list = dashboardservices.retrieve_containers();
        
        $http.put("/savedashboard/",json_obj).success(function(data){
          alert("Dashboard Created Successfully");
          $window.location.href = '#';                
        });
      };
}
function menucontroller($route,$scope, $timeout, $http, $window, $mdDialog, dashboardservices){
    $scope.actionlabel = "View";
    $(document).ready(function(){
      $("button").click(function(){
          var id = $(this).attr("id"); 
          var val = $(this).attr("value"); 
          dashboardservices.add_label(id);
          dashboardservices.add_value(val);

          if( id != undefined){
            switch(id) {
              case "view":
                $scope.actionlabel = id;
                $window.location.href = '#/dashboards';
                break;
              case "modify":
              case "delete":
                $scope.actionlabel = id;
                $window.location.href = '#/delete';
                break;
              case "Container":
              case "VM":
                $scope.actionlabel = id;
                $window.location.href = '#/searchnodes';
                break;
              case "Create_Container":
              case "Create_VM":
              case "Container_Node":
              case "VM_Node":
                $window.location.href="#/containers";
                $route.reload();
                break;
            }
          }
      })
    });
}
function dashboardcontroller($scope, $timeout, $http, $window, $location,dashboardservices){
    
      $scope.handleaction = function(label,link,dbname){
        switch(label) {
          case "view":
              dashboardservices.add_link(link);
      			  $window.location.href = "#/dblink/";				
              break;
          case "modify":
              $window.location.href = '#/matrix';
              break;
          case "delete":
              $http.delete("/deletedashboard/"+dbname);
                  alert("Dashboard Deleted Successfully");
                  
                  $http.get("/getdashboards/").success(function(data){
                      $scope.dashboards = data;
                      $window.location.href = '#/delete';
                  
                  })      
              break;                            
        }
      }

      $scope.loaddashboards = function() {
          $http.get("/getdashboards/").success(function(data){
            $scope.dashboards = data;
          });
      }
}
function searchcontroller($scope, $timeout, $http, $window, dashboardservices){

        $(document).ready(function(){
          $("button").click(function(){
            var id = $(this).attr("id"); 
            var val = $(this).attr("value"); 
            dashboardservices.add_label(id);
            dashboardservices.add_value(val);
          })
        });
}
function dashboardviewcontroller($scope, $timeout, $http,$sce, $window, $routeParams,dashboardservices){
  var load = function(){
    $scope.safeurl=$sce.trustAsResourceUrl(dashboardservices.retrieve_link());  //dashboardservices.retrieve_link();
  }
  load();
}
