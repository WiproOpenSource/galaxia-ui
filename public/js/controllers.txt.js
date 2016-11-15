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
                var str = data[obj].Name.split("_");
				console.log("split data",JSON.stringify(str));
                if(actionlabel =='container') data[obj].Name_short = str[1]+"_"+str[2];//only container names to be shortened
                else data[obj].container_short = data[obj].container;
                //dashboardservices.add_cshort(data[obj].container_short);
                console.log("Container123",data[obj].Name_short);
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
		console.log("actionlabel",actionlabel);
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
			  console.log("clicked search button");
            var id = $(this).attr("id");
            var val = $(this).attr("value");
			console.log("id val",id,val);
            dashboardservices.add_label(id);
            dashboardservices.add_value(val);
			//$scope.search(val,id);
          })
        });
		
		var input_value = $scope.dbname;  
		if (input_value == "") input_value=null;
		console.log('input val',input_value);
		
		$scope.search = function(){
		  var input_value = $scope.dbname;
		  console.log("input value",JSON.stringify($scope.dbname));
				console.log("inside search");
       //$scope.actionlabel = id;
        var actionlabel;
        if($scope.actionlabel == "Container" ) actionlabel = "container";
        else if($scope.actionlabel == "VM" ) actionlabel = "node";
		
		//$http.get('/search/'+actionlabel+input_value).success(function(data){
		$http.get('/search/'+actionlabel+'/'+input_value).success(function(data){
			for(obj in data){
                var str = data[obj].Name.split("_");
                if(actionlabel =='container') data[obj].Name_short = str[1]+"_"+str[2];//only container names to be shortened
                else data[obj].container_short = data[obj].container;
                //dashboardservices.add_cshort(data[obj].container_short);
                console.log("Container123",data[obj].Name_short);
              }
				$scope.search_data = data;
				$window.location.href = '#/searchcontainer';
				console.log("Filtered data",JSON.stringify(data));
			});
         
		}
		$scope.configureDashboard = function() {
        $window.location.href = '#/matrix'
		  };
      
			/*var data = $.param({
				$scope.dbname;
			});
			console.log("input value",$scope.dbname);
			$http.post('/search',data).success(function(data,headers){
				console.log("Data Posted",data,headers);
			})*/
			
}

function dashboardviewcontroller($scope, $timeout, $http, $sce, $window, $routeParams,dashboardservices){
  var load = function(){
    $scope.safeurl=$sce.trustAsResourceUrl(dashboardservices.retrieve_link());  //dashboardservices.retrieve_link();
  }
  load();
}
