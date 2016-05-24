
function maincontroller($scope, $timeout, $http, $window, dashboardservices){
      $scope.retrieveNodes = function(){
        $scope.actionlabel = dashboardservices.retrieve_label();
        $scope.val = dashboardservices.retrieve_value();

        console.log($scope.actionlabel+" jjjj")
        var actionlabel;
        if($scope.actionlabel == "Container_Node" || $scope.actionlabel == "Create_Container" ) actionlabel = "container";
        else if($scope.actionlabel == "VM_Node" || $scope.actionlabel == "Create_VM") actionlabel = "node";

        $http.get("/getnodes/"+actionlabel).success(function(data){

              for(obj in data){
                var str = data[obj].container.split("_");
                if(actionlabel =='container') data[obj].container_short = str[1]+"_"+str[2];//only container names to be shortened
                else data[obj].container_short = data[obj].container;
                //dashboardservices.add_cshort(data[obj].container_short);
                console.log("Container123",data[obj].container_short);
              }
          $scope.containers = data;
          console.log("CONTAINERS "+JSON.stringify($scope.containers));
        });
      }

      $scope.retrieveMetrics = function(){
        $scope.actionlabel = dashboardservices.retrieve_label();
        var actionlabel;
        if($scope.actionlabel == "Container_Node" || $scope.actionlabel == "Create_Container" ) actionlabel = "container";
        else if($scope.actionlabel == "VM_Node" || $scope.actionlabel == "Create_VM") actionlabel = "node";

        $http.get("/getmetrics/"+actionlabel).success(function(data){
          $scope.metrics_list = data;
          console.log("Metrics "+JSON.stringify($scope.metrics_list));
        });
      }

		  $scope.configureDashboard = function() {
        $window.location.href = '#/matrix'
		  };

      $scope.addSelectedContainers = function(rows) {
        var str = rows.toString().split(",");console.log(str);
        var evenElements=str[0];

        for (i in str){
          if (i!=0 && i%2 == 0) evenElements = evenElements+","+str[i]
        }
        console.log(evenElements);
        dashboardservices.add_containers(evenElements);
      };

      $scope.addSelectedMatrix = function(rows) {
        var str = rows.toString().split(",");
        var evenElements=str[0];

        for (i in str){
          if (i!=0 && i%2 == 0) evenElements = evenElements+","+str[i]
        }

        $scope.selectedMatrix=[];
        $scope.selectedMatrix.push(evenElements);
        console.log("rows "+evenElements);
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
function dashboardviewcontroller($scope, $timeout, $http, $sce, $window, $routeParams,dashboardservices){
  var load = function(){
    $scope.safeurl=$sce.trustAsResourceUrl(dashboardservices.retrieve_link());  //dashboardservices.retrieve_link();
  }
  load();
}
