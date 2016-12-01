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
	
	$scope.vminfocus = false;
	$scope.containerinfocus = false;
	//$scope.containers=[1,2,3,4,5,6];
	$scope.vms = [];
	$scope.vm_colors=["#cb2025","#f8b334","#97bf0d","#00a096"]; 
	$scope.vminfo = [];
	$scope.curPage = 0;
	$scope.pageSize = 3;
	$scope.containerPageSize = 5;
	$scope.containerdata = [];
	$scope.vmcount = 0;
	$scope.containercount = 0;
	$scope.appcount = 0;
	$scope.selectedcontainers = [];
	$http.get("/getnodes/node").success(function(data){
		console.log("inside getnodes",data);
		$scope.vminfo = data;
		//console.log("vminfo",$scope.vminfo);
		//for(i=0;i<data.length;i++){
			         var keys = Object.keys(data);
		 //console.log(dta)

									var i=0;
									//var mod_response=[];
									for(var key in keys){
													var obj={};                                                                                                                                                                                                                                           //console.log(Object.keys(response)[i]);
													obj.ip = keys[i]; //console.log(response[Object.keys(response)[i]]);
													obj.name = data[keys[i]];
													$scope.vms.push(obj);
													i=i+1;
									}
									console.log(JSON.stringify($scope.vms));
			/*for( i in data){
			$scope.vms.push(data[i]);
			console.log("vms",data[i]);)*/
			getvmcontainerinfo($scope.vms[0]);
			
		
	})
	
	$scope.selectedVMforCompare = function(){
		var count = 0;
		for(var i=0,j=$scope.vms.length;i<j;i++){
			if($scope.vms[i].compareselected){
				count++;
			}
		}
		$scope.vmcount = count;
	}
	$scope.dashboardname;
	var containerJson = {
						"templatename":$scope.dashboardname,
						"widgets": [],
						"metrics": []
						} 
							containerJson.metrics.push(JSON.parse('{"name": "container_cpu_system_seconds_total","labels": [{"name": "cadvisor"}]}'));
					
	$scope.selectedContainerforCompare = function(containerdata){

			var count = 0;
			$scope.selectedcontainers = [];
			for(var i=0,j=containerdata.length;i<j;i++){
				if(containerdata[i].compareselected){
					count++;
					containerJson.widgets.push(containerdata[i].Name);
				}
				
			}
			$scope.containercount = count;		
				
	}
	$scope.viewContainerDashboard = function(){
		dashboardservices.setTemplateSelected($scope.dashboardname);
		console.log("dashboard is"+$scope.dashboardname);
		
		containerJson.templatename = $scope.dashboardname;

		console.log("widgets are "+JSON.stringify(containerJson));
		$http.post("/savedashboard/",containerJson).success(function(data){
          alert("Dashboard Created Successfully");
		  $window.location.href = '#/dblink';
	})
	}
	function getvmcontainerinfo(vm){
		$http.get("/getnodes/container").success(function(cdata){
				vm.containers = cdata;
				$scope.containerdata = cdata;
			})
	}
	
	$scope.numberOfvmPages = function() {
		return Math.ceil($scope.vm.containers.length / $scope.pageSize);
		};
        
	$scope.numberOfcontainerPages = function() {
		return Math.ceil($scope.containerdata.length / $scope.containerPageSize);
		};	
	
	$scope.vms = [
		//{"ip": "1.1.1.1", "containers": [ {"name": "container 1"} ]	}
		
	];
	
	$scope.compare = function(evt){
		
		if(evt == "vm"){
			$scope.vmcount++;
			console.log("vm count",$scope.vmcount++);
			return;
		}else if(evt == "docker"){
			$scope.containercount++;
			return;
		}else if(evt == "application"){
			$scope.appcount++;
			return;
		}
	
	}
	$scope.openChartModal = function(containerName){
		$scope.tempName = "dashboard_"+ containerName.Name;
        dashboardservices.setTemplateSelected($scope.tempName);
	
	var containerJson = {
		"templatename": "dashdahsfdfdfdf",
		"widgets": [],
		"metrics": []
	} 
	
	containerJson.templatename = "dashboard_"+ containerName.Name;
	containerJson.widgets.push(containerName.Name);
	containerJson.metrics.push(JSON.parse('{"name": "container_cpu_system_seconds_total","labels": [{"name": "cadvisor"}]}'));
		
		$http.post("/savedashboard/",containerJson).success(function(data){
          alert("Dashboard Created Successfully");
           $mdDialog.show({
				controller: DialogChartController,
				templateUrl: 'partials/dialogchart.html',
				parent: angular.element(document.body),
				//locals: {
				//	row: row
				//},
      //targetEvent: ev,
		clickOutsideToClose:true,
      //fullscreen: useFullScreen
		});
        });
		
		$scope.cancel = function() {	
			$mdDialog.cancel();
			console.log()
		};
	  
	  }
	  
	  
	$scope.focusVM = function(vm){
		console.log('focusVM', vm);
		$scope.vminfocus = vm;
	};
	
	$scope.focusContainer = function(container){
		console.log('container', container);
		$scope.containerinfocus = container;
	};
	
	$scope.dashboardConfigData = {
		"templatename": "",
		"widgets": [],
		"metrics": []
	};
	$scope.selectedName=[];

      $scope.retrieveNodes = function(){
        $scope.actionlabel = dashboardservices.retrieve_label();
        $scope.val = dashboardservices.retrieve_value();

        console.log($scope.actionlabel+" jjjj")
        var actionlabel;
        if($scope.actionlabel == "Container_Node" || $scope.actionlabel == "Create_Container" ) actionlabel = "container";
        else if($scope.actionlabel == "VM_Node" || $scope.actionlabel == "Create_VM") actionlabel = "node";
        else if($scope.actionlabel == "Create_app") actionlabel = "mysql";

        if (actionlabel != "node" || actionlabel != "container"){
        	$http.get("/getapp/"+actionlabel).success(function(data){
	          console.log("applications "+JSON.stringify(data));
	          $scope.appdata = data;
	        });
        }
        else{
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
      }
	  
	  
      $scope.retrieveMetrics = function(){
		  $scope.selectedMatrix=[];
		  
        $scope.actionlabel = dashboardservices.retrieve_label();
        var actionlabel;
        if($scope.actionlabel == "Container_Node" || $scope.actionlabel == "Create_Container" ) actionlabel = "container";
        else if($scope.actionlabel == "VM_Node" || $scope.actionlabel == "Create_VM") actionlabel = "node";
        else if($scope.actionlabel == "Create_app") actionlabel = "app";
		
		console.log("actionlabel",actionlabel);
        $http.get("/getmetrics/"+actionlabel).success(function(data){
          $scope.metrics_list = data;
          console.log("Metrics "+JSON.stringify($scope.metrics_list));
        });
      }

	  if(window.location.hash === "#/containers"){
		dashboardservices.dshbrd.resetDashboardData();
	  }
				  
	  $scope.selectWidgets = function(rows){
		  //console.log('selectWidgets',arguments, $scope.searchItems);
		  dashboardservices.dshbrd.setDashboardWidget(rows.map(function(row){ return row[2]; }));
	  }
	  
		  $scope.configureDashboard = function() {
			console.log("dashboardservices", dashboardservices);
			  
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
		 
		 $scope.dashboardConfigData.widgets
		 
		 for(var i=0,j=rows.length;i<j;i++){
			 
		 }
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
		
		dashboardservices.add_metricLabel(row);
		
		$mdDialog.show({
      controller: DialogController,
      templateUrl: 'partials/dialog.html',
      parent: angular.element(document.body),
	  locals: {
		  row: row
	  },
      //targetEvent: ev,
      clickOutsideToClose:true,
      //fullscreen: useFullScreen
		});
	  }

      $scope.saveDashboard = function() {
		  /*{"templatename":"mydashboard3",
		  "widgets":"Cassandra2",
		  "metrics":[{"name":"org_apache_cassandra_metrics_table_value",
		  "labels":[{"keyspace":"system","name":"AllMemtablesHeapSize","scope":"IndexInfo"}]},
		  {"name":"org_apache_5555","labels":[{"keyspace":"system","name":"AllMemtablesHeapSize","scope":"IndexInfo"}]}]}*/
        var json_obj = {};
        json_obj.name = $scope.dbname;
        json_obj.unit_type = "docker";
        json_obj.metrics_list = $scope.selectedMatrix;
		//json_obj.labels = {};
		json_obj.labels = dashboardservices.retrieve_metricLabel();
		console.log("retrieved labels",JSON.stringify(json_obj.labels));
        //json_obj.metrics_list = dashboardservices.retrieve_containers();
		console.log("matrix",json_obj.metrics_list);
        json_obj.names_list = dashboardservices.retrieve_containers();
	    //json_obj.names_list = $scope.selectedName;
		console.log("names",json_obj.names_list);
		console.log("POST OBJ",JSON.stringify(json_obj));
		
		dashboardservices.dshbrd.setDashboardName($scope.dbname);
		
		var data = dashboardservices.dshbrd.getDashboardData();
		
        $http.post("/savedashboard/",data).success(function(data){
          alert("Dashboard Created Successfully");
          $window.location.href = '#';
        });
      };

	   /*$scope.label = [];
	  $http.get('getModalData').success(function(data){
		  $scope.label = data[0].labels;
		  console.log("Label",$scope.label);
	  });*/
	  }
	  
function DialogChartController($scope,$http,$mdDialog,dashboardservices){
	$scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
} 


function DialogController($scope,$http,$mdDialog,dashboardservices){
	$scope.dialogContent = [];
	$scope.labelkey = [];
	var keys = []
	$scope.key1=[];
	$scope.name = [];
	$scope.labelscope = [];
	$scope.index=0;
	 $scope.selectedval = [];
	 $scope.selectedrow = [];
	//$scope.dataarray = [{keyspace: null, name: null, scope: null}];
	$scope.dataarray = [{}];

	$http.get('/getModalData').success(function(data){
		$scope.dialogContent = data[0].labels;
		console.log("dialogContent",JSON.stringify($scope.dialogContent));
		//console.log("dialog",JSON.stringify(data[0].label.keyspace));
		$scope.key1 =[];
		 //$scope.selectedval = [];
		 //$scope.selectedrow = [];
		for(i=0;i<$scope.dialogContent.length;i++){
			var keys = [];
			keys.push($scope.dialogContent[i]);
			console.log("keys",JSON.stringify(keys),keys[0].label.length);
			for(j=0;j<keys[0].label.length;j++){
				//var key1 = [];
				var nextKey = Object.keys(keys[0].label[j]).toString();
				console.log("nextkey",nextKey);
				if (!($scope.key1.indexOf(nextKey) > -1)){
				$scope.key1.push(nextKey);
				}
			}
			console.log('key1',JSON.stringify($scope.key1),$scope.key1.length);
		}
		$scope.values = [];
		var nextval = [];
	
		 $scope.x = [];
		
		for (k=0;k<$scope.key1.length;k++){
				$scope.duparray = [];
				 
			//var nextval = $scope.dialogContent,"//"+$scope.key1[k];
			//if($scope.dialogContent)
			nextval = (JSON.search($scope.dialogContent,"//"+$scope.key1[k]));
			console.log(nextval);
			for(l=0;l<nextval.length;l++){
		    if(!($scope.duparray.indexOf(nextval[l]) > -1)){
				$scope.duparray.push(nextval[l]);
				console.log("nextval",nextval[l]);
			}
			}
			$scope.x.push($scope.duparray)
		} 
		console.log('values',$scope.x);
		//console.log("keys",JSON.stringify(keys));
		//	for(j=0;j<keys.length;j++){
			//	var key1=[];
			//	key1.push(Object.keys(keys[j].label[j]));
				//console.log("key1",JSON.stringify(key1));
			//}
			
			
			
			//$scope.labelkey.push($scope.dialogContent[i].label.image);
			//console.log("keyspace",JSON.stringify($scope.keyspace));
			//$scope.name.push($scope.dialogContent[i].label.name);
			//console.log("name",JSON.stringify($scope.name));
			//$scope.labelscope.push($scope.dialogContent[i].label.scope);
			//console.log("scope",JSON.stringify($scope.labelscope));
			//console.log("keyspace,name,labelscope",JSON.stringify($scope.keyspace),JSON.stringify($scope.name),JSON.stringify($scope.labelscope));
		
		
	});
	 $scope.cancel = function() {
			$mdDialog.cancel();
			console.log()
		};
	//var label = {"keyspace":}
	$scope.saveLabel = function(){
		//$http.post('/savedashboard', {data: $scope.dataarray}).success(function(data,headers){
			//console.log("Status",headers);
			//dashboardservices.add_metricLabel($scope.dataarray[0]);
			//dashboardservices.retrieve_metricLabel();
			var keys = ['job', 'id', 'instance', 'name', 'image'];
			var metric = {name: '', labels: []};
			var metriclabel = dashboardservices.retrieve_metricLabel();
			var metricdataarray = $scope.dataarray;
			metric.name = metriclabel.data[0];
			debugger;
			$.each(metricdataarray, function(k, metricdata){
				metric.labels[k] = [];
				var d = {};
				$.each(metricdata.selectedval, function(i,j){
					d[keys[i]] = j;
				});				
				metric.labels[k] = d;			
			});


			console.log('selected key', metric);
			dashboardservices.dshbrd.addMetric(metric);
		
	}
	
	$scope.addrow = function(){ 
		//var targetarray = [];
		console.log("select val",$scope.selectedval);
		//angular.copy($scope.selectedval,targetarray)
	$scope.dataarray.push({});
		//$scope.selectedval = [];
		console.log("dataarray",JSON.stringify($scope.dataarray));
	}
	
	
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

          console.log("ID iS "+id)
 
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
              case "Create_app":
                $window.location.href="#/applications";
                $route.reload();
                break;  
            }
          }
      })
    });
}

function dashboardcontroller($scope, $timeout, $http, $window, $location,dashboardservices){
 
      $scope.handleaction = function(label,dbname){
        switch(label) {
          case "view":
                dashboardservices.add_link(dbname);
                                                 $window.location.href = "#/dblink";
              break;
          case "modify":
              $window.location.href = '#/matrix';
              break;
          case "delete":
              $http.delete("/deletedashboard/"+dbname);
 
                  $http.get("/getdashboards/").success(function(data){
                      $scope.dashboards = data;
                      alert("Dashboard Deleted Successfully");
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
                                                //console.log("DASH",JSON.stringify($scope.dashboards));
          });
                                  //console.log("DASH DATA",data1);
                                  $http.post("/reload/",data1).success(function(data,header){
                                                  //console.log("UPDATED",header);
                                  });
      }

	

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
		//var defaultselectednames = [];
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
		/*$scope.selected = [];
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
		});*/

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
function DialogDashboardController($scope,$mdDialog, dashboard,dashboardservices){
	$scope.dashboard = dashboard;
}

function myController($scope, $timeout,$http,$mdDialog, dashboardservices) {
    //$scope.templatename = [];
    $scope.seriesLabel = [];
    $scope.seriesData = [];

    //$scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    $scope.whereami = "line";
    //$scope.templatename = "ABCD";
  
    $scope.selectedtiles = [];
	$scope.allwidgets;	
    
    $scope.setTemplate = function(){
                    $scope.templatename = dashboardservices.getTemplateSelected(); 
                    console.log(" Template Is "+$scope.templatename)
                    //$scope.dashboards = JSON.search($scope.dashboards,"//*[templatename='"+$scope.templatename+"']");
                    var jsonobj = JSON.stringify({
                                                    templatename:$scope.templatename
                                    }
                    )
                    getDashboardDetails(JSON.parse(jsonobj));
    }

    $scope.hereiam = function(page){
                    $scope.whereami = page;
    }

    $scope.cancel = function() {
                    $mdDialog.cancel();
                    //console.log()
    };

    var getDashboardDetails = function(dashboard){
                    $http.get('/dashboard/metrics/'+dashboard.templatename).success(function(data){       
                                    dashboard.widgets = data;
									$scope.allwidgets = data;
                                    ////console.log("widgets",JSON.stringify(data));
                                    plotChart(dashboard.templatename,data); 
        })
    };

                function plotChart(dashboardname, metricdata){
                                    var allCharts = [];
                                    for (x=0;x<metricdata.length;x++){
                                            console.log(JSON.stringify(metricdata[x]));
                                            //var ctx = $('#'+$scope.whereami+"_"+dashboardname+"_"+metricdata[x].widget)
											var ctx = $('#'+"temp"+x)
											console.log(ctx)
                                            var config = new Object({
                                                                        type: 'line',
                                                                        data: {
                                                                            labels: [],
                                                                            datasets: []
                                                                        },
                                                            options: {
                                                                title:{
                                                                    display:true,
                                                                    text:metricdata[x].widget
                                                                },
                                                                tooltips: {
                                                                    mode: 'label',
                                                                },
                                                                scales: {
                                                                    xAxes: [{
                                                                        scaleLabel: {
                                                                            show: true,
                                                                            labelString: 'Month'
                                                                        }
                                                                    }],
                                                                    yAxes: [{
                                                                        scaleLabel: {
                                                                            show: true,
                                                                            labelString: 'Value'
                                                                        },
                                                                    }]
                                                                }
                                               }             
                                                                                });
                                                                                //add as many datasets as number of labels
                                                                                var metrics = JSON.search(metricdata[x],"//metrics");
                                                                                for(mtrx=0;mtrx<metrics.length;mtrx++){
                                                                                                var alllabels = metrics[mtrx].labels; //console.log(JSON.stringify(metrics[mtrx]))
                                                                                                for(lbls=0;lbls<alllabels.length;lbls++){
                                                                                                                config.data.datasets.push({
                                                                                            label: metrics[mtrx].name,
                                                                                            data: [],
                                                                                            backgroundColor: [
                                                                                                randomColor(0.9)
                                                                                            ],
                                                                                            borderColor: [
                                                                                                randomColor(0.9)
                                                                                            ],
                                                                                            borderWidth: 2,
                                                                                            fill: false
                                                                                                    })
                                                                                                }
                                                                                }
                                   allCharts.push(new Chart(ctx, config));
                                                                                console.log("length of charts "+allCharts.length)
 
                        }
		               setInterval(function(){
		                            $.each(allCharts, function(i, chart) {
		                    $http.get('/dashboard/chartdata/'+dashboardname+'/'+chart.options.title.text).success(function(result){
		                    //console.log("result "+JSON.stringify(result))
		                        for(h=0;h<result.length;h++){
		                             if (h==0) chart.data.labels.push(dhm(result[h].value.x)); //if (chart.data.labels.length > 8) chart.data.labels.shift();
		                                            chart.data.datasets[h].data.push(result[h].value.y);//if (chart.data.length > 8) dataset.data.shift();
		                                             console.log(chart.options.title.text);
		                        }
		                        chart.update();                                                   
		                              })
		                })
		            },5000)                           
                }
 
                function dhm(t){
                                var date = new Date(t);
                    var cleanDate = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                                return cleanDate
                }
 
    var randomColorFactor = function() {
        return Math.round(Math.random() * 255);
    };
    var randomColor = function(opacity) {
 
        return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
    };
                                                                               
                $scope.showtile = function(tile){
                                for( x=0;x<$scope.selectedtiles.length;x++){
                                                if($scope.selectedtiles[x] == tile) return true;
                                }
                }
               
                $scope.onClick = function (points, evt) {
    //console.log(points, evt);
                };
}