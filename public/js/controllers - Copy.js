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
        $http.post("/savedashboard/",json_obj).success(function(data){
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

function DialogController($scope,$http,$mdDialog,dashboardservices){
	$scope.dialogContent = [];
	$scope.keyspace = [];
	$scope.name = [];
	$scope.labelscope = [];
	$scope.dataarray = [{keyspace: null, name: null, scope: null}];
	$http.get('/getModalData').success(function(data){
		$scope.dialogContent = data;
		console.log("dialogContent",JSON.stringify($scope.dialogContent));
		//console.log("dialog",JSON.stringify(data[0].label.keyspace));
		for(i=0;i<$scope.dialogContent.length;i++){
			$scope.keyspace.push($scope.dialogContent[i].label.keyspace);
			console.log("keyspace",JSON.stringify($scope.keyspace));
			$scope.name.push($scope.dialogContent[i].label.name);
			console.log("name",JSON.stringify($scope.name));
			$scope.labelscope.push($scope.dialogContent[i].label.scope);
			console.log("scope",JSON.stringify($scope.labelscope));
			//console.log("keyspace,name,labelscope",JSON.stringify($scope.keyspace),JSON.stringify($scope.name),JSON.stringify($scope.labelscope));
		}
		
	});
	 $scope.cancel = function() {
			$mdDialog.cancel();
			console.log()
		};
	//var label = {"keyspace":}
	$scope.saveLabel = function(){
		//$http.post('/savedashboard', {data: $scope.dataarray}).success(function(data,headers){
			//console.log("Status",headers);
			dashboardservices.add_metricLabel($scope.dataarray[0]);
			dashboardservices.retrieve_metricLabel();
			console.log('selected key',JSON.stringify($scope.dataarray[0]));
		
	}
	
	$scope.addrow = function(){
		$scope.dataarray.push({keyspace: null, name: null, scope: null});
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
	//$scope.templatename = [];
	$scope.seriesLabel = [];
	$scope.seriesData = [];
	var index = 11;
	var index1 =11;
	var index2 =11;
	
	$scope.dashboards = [];
	$http.get("/dashboard/templates").success(function(data){
		for(i=0;i<data.length;i++){
			//$scope.templatename.push(data[i].instance.templatename);
			getDashboardDetails(data[i]);
		}
		$scope.dashboards = data;
		console.log("templatename",JSON.stringify($scope.templatename));
	});
	
	//$scope.myInterval = 5000;
  $scope.noWrapSlides = false;
  $scope.active = 0;
  
	
	var getDashboardDetails = function(dashboard){
		///dashboard/templatedetails/:
		///dashboard/chartdata/:templatename/:widget
		$http.get('/dashboard/templatedetails/'+dashboard.instance.templatename).success(function(data){
			dashboard.widgets = data;
			//for(i=0;i<data.length;i++){
				
			getLabel(dashboard.instance.templatename,dashboard.widgets);
		
			//}
		})
	};
	
	      var getLabel = function(template,widgets){
				
		$('#dashboard').highcharts({
            chart: {
				zoomType: 'x',
                type: 'spline',
               // animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function () {

                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function () {
							$http.get('/dashboard/chartdata/'+template+'/cas1/'+index++).success(function(data){
								console.log("data is"+JSON.stringify(data));
									var x = data[0].value[0].x, // current time
										y = data[0].value[0].y
									series.addPoint([x, y], true, true);
							})
						}, 5000);
						var series1 = this.series[1];
                        setInterval(function () {
							$http.get('/dashboard/chartdata/'+template+'/cas1/'+index1++).success(function(data){
								console.log("data is"+JSON.stringify(data));
									var x = data[0].value[0].x, // current time
										y = data[0].value[0].y+Math.random();
									series1.addPoint([x, y], true, true);
							})
						}, 5000);
						var series2 = this.series[2];
                        setInterval(function () {
							$http.get('/dashboard/chartdata/'+template+'/cas1/'+index2++).success(function(data){
								console.log("data is"+JSON.stringify(data));
									var x = data[0].value[0].x, // current time
										y = data[0].value[0].y * Math.random();
									series2.addPoint([x, y], true, true);
							})
						}, 5000);
                    }
					}
				},
            title: {
                text: 'USD to EUR exchange rate over time'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            legend: {
                enabled: false
            },
			/*plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },*/
			series:[{
			  name: 'Tokyo',
			  data: (function () {
                    // generate an array of random data
													var data = 	[{x:1370131200000, y:0.9695},
                                                                {x:1370217600000, y:0.9648},
                                                                {x:1370304000000, y:0.9645},
                                                                {x:1370390400000, y:0.9638},
                                                                {x:1370476800000, y:0.9549},
                                                                {x:1370563200000, y:0.9562},
                                                                {x:1370736000000, y:0.9574},
                                                                {x:1370822400000, y:0.9543},
                                                                {x:1370908800000, y:0.9519},
                                                                {x:1370995200000, y:0.9498}]
                        
                    console.log(data)
                    return data;
                    
                }())
			  },{
            name : 'Delhi',
            data : (function () {
                // generate an array of random data
                var data2 = [{x:1370131200000, y:0.7695},
                                                                {x:1370217600000, y:0.7648},
                                                                {x:1370304000000, y:0.7645},
                                                                {x:1370390400000, y:0.7638},
                                                                {x:1370476800000, y:0.6549},
                                                                {x:1370563200000, y:0.6562},
                                                                {x:1370736000000, y:0.7574},
                                                                {x:1370822400000, y:0.7543},
                                                                {x:1370908800000, y:0.7951},
                                                                {x:1370995200000, y:0.8498}]
				console.log(data2);
                return data2;
            }())
        },{
            name : 'NewYork',
            data : (function () {
                // generate an array of random data
                var data3 = [{x:1370131200000, y:0.6695},
                                                                {x:1370217600000, y:0.5648},
                                                                {x:1370304000000, y:0.6645},
                                                                {x:1370390400000, y:0.5638},
                                                                {x:1370476800000, y:0.4549},
                                                                {x:1370563200000, y:0.6562},
                                                                {x:1370736000000, y:0.7574},
                                                                {x:1370822400000, y:0.6543},
                                                                {x:1370908800000, y:0.6951},
                                                                {x:1370995200000, y:0.7498}]
				console.log(data3);
                return data3;
            }())
        }]
	});
	}
    


          /* series:[{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: 'New York',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            }, {
                name: 'Berlin',
                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
            }, {
                name: 'London',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }] */
			
			  
                //type: 'line',
                //name: 'USD to EUR',
                //data: data
		 //});
				
			
		//});
		
	//},5000);
	
	
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
	
	/*$timeout(function(){
	//$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
	$http.get('/getchart').success(function(data){
		$scope.labels = data.labels;
		$scope.series = data.series;
		$scope.data = data.data;
		console.log($scope.labels,$scope.series,$scope.data);
	});
  //$scope.series = ['Series A', 'Series B'];
  /*$scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
	},1000);*/
	//$http.get('/getchart').success(function(data){
		//console.log("chartdata",data);
		
        //});
	
	
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
  }	
	
}