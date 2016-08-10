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

          

function maincontroller($scope, $timeout, $http, $window, dashboardservices, $mdDialog){
	$scope.selectedName=[];
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
		  $scope.selectedMatrix=[];
		  
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

    /*  $scope.addSelectedContainers = function(rows) {
		  $scope.names_list = [];
		 console.log("Inside add");
       var str = rows.toString().split(",");console.log("selected ++++ "+str);
	   console.log("str",str[1],str[2]);
        var evenElements=str[2];
		console.log("even",evenElements);
		//console.log("av;fvmv",str[2]);

        for (i in str){
          if (i!=0 && i%2 == 0) evenElements = evenElements+","+str[i]
		  $scope.names_list.push(evenElements);
        }
        
		
		
		console.log('Selected items names array',JSON.stringify($scope.names_list));
        
      };*/
	 $scope.addSelectedContainers = function(rows) {
		//var full = '';
				var str = rows.toString().split(",");
				console.log('str name',str);
				var evenElements='';
              
					/*if(i!=0 && i%2 == 0)
						evenElements = evenElements+","+str[2]
					console.log("full",evenElements);
					console.log("full1",str[2]);
			}
			$scope.selectedName=[];
			$scope.selectedName.push(evenElements);
			dashboardservices.add_containers($scope.selectedName);
			console.log(" name rows "+JSON.stringify($scope.selectedName));*/
			//function longname(){
				var fullname = [],longstr=[],i=0;
				fullname = $scope.containers;
				for(i in fullname){
					longstr = fullname[i].Name;
					console.log("long name",longstr);
				}
				//return longstr;
			//}
			//function shortname(longstr){
				var j=0,shortstr=[];
				//for(j in str){
					shortstr = str[2];
					console.log("short name 1",shortstr);
					
					//console.log("short name",shortstr);
					
					//var res = longstr[j].includes(str[2]);
				
				//console.log("result",res);
					//if(res==true) {
						
							console.log("strtt",str[2]);
                       //  var res = longstr.includes(str[2]);
						// console.log("dklf",res);
						for(j in str){ 
						str[2] = longstr;
							console.log("res str",str[2]);
						}	
					//else {j=j+3;console.log("j value",j)}
			//}
				//}
	// }
}
      /*$scope.addSelectedMatrix = function(rows) {
        var str = rows.toString().split(",");
        var evenElements=[];

        for (i in str){
          if (i!=0 && i%2 == 0) evenElements = evenElements+","+str[i]
        }

        //$scope.selectedMatrix=[];
        $scope.selectedMatrix.push(evenElements);
        console.log(" metric rows "+JSON.stringify($scope.selectedMatrix));
      };*/
	  $scope.addSelectedMatrix = function(rows,ev) {
        
		$scope.selectedMatrix=[];
        console.log("addSelectedMatrix ",rows, ev);
        var str = rows.toString().split(",");
        var evenElements="";
 
        for (i in str){
          console.log(i,i%2);
          if (i==0) evenElements = str[i];
          else if (i%2 == 0) evenElements = evenElements+","+str[i]
        }
 
        $scope.selectedMatrix.push(evenElements);
		
	  };
	  
		$scope.myclick = function(clickevent){
			$timeout(function(){
				var $target = angular.element(clickevent.originalEvent.target);
				if($target.hasClass('checkboxCell') || $target.parents('.checkboxCell').length>0){
					var clickedTr = $target.parents('tr'),
						rowSelected = clickedTr.hasClass('selectedRow'),
						rowData = clickedTr.scope().rowData;
					console.log("checkbox clicked", clickedTr, rowSelected, rowData);
					if(rowSelected){
						$scope.openModal(rowData);
					}
				}				
			}, 100);
		}
	  
	  $scope.openModal = function(row){

		$mdDialog.show({
      controller: DialogController,
      templateUrl: 'partials/dialog.html',
      parent: angular.element(document.body),
      //targetEvent: ev,
      clickOutsideToClose:true,
      //fullscreen: useFullScreen
		});
	  
	  
	  }

      $scope.saveDashboard = function() {
        var json_obj = {};
        json_obj.name = $scope.dbname;
        json_obj.unit_type = "docker";
        json_obj.metrics_list = $scope.selectedMatrix;
        //json_obj.metrics_list = dashboardservices.retrieve_containers();
		console.log("matrix",json_obj.metrics_list);
        json_obj.names_list = dashboardservices.retrieve_containers();
	    //json_obj.names_list = $scope.selectedName;
		console.log("names",json_obj.names_list);
		
        $http.put("/savedashboard/",json_obj).success(function(data){
          alert("Dashboard Created Successfully");
          $window.location.href = '#';
        });
      };

	   $scope.label = [];
	  $http.get('getModalData').success(function(data){
		  $scope.label = data[0].labels;
		  console.log("Label",$scope.label);
	  });
	  }

function DialogController($scope){
	
}

function menucontroller($route,$scope, $timeout, $http, $window, $mdDialog, dashboardservices){
	$scope.customize = function(){
		$window.location.href='#/check';
	}
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
		  var data1='';
          $http.get("/getdashboards/").success(function(data){
            $scope.dashboards = data;
			data1=data;
			console.log("DASH",JSON.stringify($scope.dashboards));
          });
		  console.log("DASH DATA",data1);
		  $http.post("/reload/",data1).success(function(data,header){
			  console.log("UPDATED",header);
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

function Checkcontroller($scope,$http) {
	$scope.items = [];
	$scope.selected = [];
	$scope.defaultselected = [];
	var defaultselectednames = [];
	$scope.selectstatus=[];
	$scope.url;
	var res = [];

	function getItem(name, items){
		for(var i=0, j=items.length;i<j;i++){
			if(items[i].name===name){
				return items[i];
			}
		}
	}
	
  $http.get('/getCheckbox').success(function(data){
	  console.log("dbdata",JSON.stringify(data));
//		for(i in data){
//			$scope.items.push(data[i].name);
//			$scope.selectstatus.push(data[i].selected);
//			console.log($scope.selectstatus);
//		}
		var defaultselectednames = [];
		for(var i=0;i<data.length;i++){
			//$scope.items.push(data[i].name);
			$scope.items.push(data[i]);
			if(data[i].selected){
				$scope.selected.push(data[i]);
				defaultselectednames.push(data[i].name);
				console.log("selected",JSON.stringify($scope.selected));
				$scope.defaultselected.push(data[i]);
				console.log("default selected",JSON.stringify($scope.defaultselected));
				//$scope.url = data[i].templateUrl;
				//console.log("URL",JSON.stringify($scope.url));
			}
		}

		$http.get('/getTiles').success(function(data){
			console.log("tile data",JSON.stringify(data));
			if(data && data.length>0 && data[0].checkboxLabel.length>0){
				var selectedtiles = data[0].checkboxLabel;
				for(var i=0;i<selectedtiles.length;i++){
					if(defaultselectednames.indexOf(selectedtiles[i].name) == -1){
						$scope.selected.push( getItem(selectedtiles[i].name, $scope.items));
					}
				}
			}
		});

		//$scope.items = res;
	  //console.log('data',JSON.stringify($scope.items));
	  
  })	
  //$scope.items = ['Running Containers','Dashboards','CPU Utilization','Memory Utilization','Running VM\'s'];
  
  
  $scope.toggle = function (item, list) {
	  //console.log($scope.defaultselected,item);
	  if(defaultselectednames.indexOf(item.name) != -1){
		  return;
	  }
	  
	  var idx = list.indexOf(item);
	  if(idx > -1)
		  list.splice(idx,1);
	  else {
      list.push(item);
    }
	  /*for( x=0;x<$scope.selectstatus.length;x++){
	  if($scope.selectstaus == true){
		  //$scope.selected = $scope.selectstatus[x];
		  return;
	  }
	  }*/
   // var idx = list.indexOf(item);
   // if (idx > -1) {
    //  list.splice(idx, 1);
    //}
    
  };

  $scope.exists = function (item, list) {
    return list.indexOf(item) > -1;
  };

  $scope.isIndeterminate = function() {
    return ($scope.selected.length !== 0 &&
        $scope.selected.length !== $scope.items.length);
  };

  $scope.isChecked = function() {
    return $scope.selected.length === $scope.items.length;
  };

  $scope.toggleAll = function() {
    if ($scope.selected.length === $scope.items.length) {
	//$scope.selected = ["Dashboards"];
     $scope.selected = $scope.defaultselected;
	 
	  console.log("default",JSON.stringify($scope.selected));
	  
    } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
      $scope.selected = $scope.items.slice(0);
	 //$scope.selected = $scope.defaultselected;
	  console.log("non-default",JSON.stringify($scope.selected));
    }
  };
   $scope.savedb = function(){
	 var selectval =[];
	var selectval = $scope.selected;
	 console.log("select",selectval);
	 $http.post('/savedb/true',selectval).success(function(data,headers){
		 console.log("Data saved",headers);
		 if(headers == 200){
			 alert("Data saved successfully!")
		 }
 });
}
}


function myController($scope, $timeout,$http) {
	
	$scope.getAlert = [];
	$http.get("/alerts").success(function(data){
		//for(i=0;i<)
		$scope.getAlert.push(data[0].Alert);
		console.log("Alerts",JSON.stringify($scope.getAlert[0]));
	});

	$scope.selectedtiles = [];
	$http.get('/getTiles').success(function(data){
		//for(obj in data){
		//$scope.selectedtiles = data[obj].checkboxLabel;
		//}
		console.log('getTiles', JSON.stringify(data));
		if(data.length>0){
			for(i=0;i<data[0].checkboxLabel.length;i++){
				$scope.selectedtiles.push(data[0].checkboxLabel[i]);
				console.log("tile data",data[0].checkboxLabel[i]);
			}
		}
	});
	$scope.showtile = function(tile){
		for( x=0;x<$scope.selectedtiles.length;x++){
			if($scope.selectedtiles[x] == tile) return true;
		}
	}
	
	
	/*copied from chartctrl 
{
  $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  $scope.data = [300, 500, 100];
});
	*/
	$timeout(function(){
		$http.get('/getPie').success(function(data){
			$scope.labels = data.labels;
			$scope.data = data.data;
			console.log("Pie",$scope.labels,$scope.data);
		});
	},1000);
	
	$timeout(function(){
	//$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
	$http.get('/getcanvas').success(function(data){
		$scope.labels = data.labels;
		$scope.series = data.series;
		$scope.data = data.data;
		console.log($scope.labels,$scope.series,$scope.data);
	});
  //$scope.series = ['Series A', 'Series B'];
  /*$scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];*/
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
	
  }