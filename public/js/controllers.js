function maincontroller($scope, $timeout, $http, $window, dashboardservices, $mdDialog){
	console.log("maincontroller init")
	$scope.vminfocus = false;
	$scope.searchfilters = {vmquery: "", containerquery: ""};
	$scope.containerinfocus = false;
	$scope.vms = [];
	//$scope.vm_colors=["#cb2025","#f8b334","#97bf0d","#00a096"]; 
	$scope.vm_colors=["#2196f3"];
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
		var keys = Object.keys(data);
		var i=0;
			for(var key in keys){
				var obj={};                                                                                                                                                                                                                                           //console.log(Object.keys(response)[i]);
				obj.ip = keys[i]; 
				obj.name = data[keys[i]];
				$scope.vms.push(obj);
				i=i+1;
				}
				console.log(JSON.stringify($scope.vms));
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
	
	$scope.selectedappforCompare = function(appdata){
		var count = 0;
			if(appdata.compareselected){
				count++;
			}
		$scope.appcount = count;
	}
	
	$scope.viewContainerDashboard = function(){
		dashboardservices.setTemplateSelected($scope.dashboardname);
		console.log("dashboard is"+$scope.dashboardname);
		containerJson.templatename = $scope.dashboardname;
		console.log("widgets are "+JSON.stringify(containerJson));
		$http.post("/savedashboard/",containerJson).success(function(data){
			$window.location.href = '#/dblink';
		})
	}
	
	function getvmcontainerinfo(vm){
		$http.get("/getnodes/container").success(function(cdata){
			vm.containers = cdata;
			$scope.containerdata = cdata;
		})
	}
	
	$scope.numberOfvmPages = function(){
		return Math.ceil($scope.vm.containers.length / $scope.pageSize);
	};
        
	$scope.numberOfcontainerPages = function() {
		return Math.ceil($scope.containerdata.length / $scope.containerPageSize);
	};	
	
	$scope.vms = [
		//{"ip": "1.1.1.1", "containers": [ {"name": "container 1"} ]	}
		
	];
		$scope.curPage = 0;
		$scope.pageSize = 3;

		$scope.numberOfPages = function() 
		 {
		 return Math.ceil($scope.vms.length / $scope.pageSize);
		 };
	
	$scope.openChartModal = function(containerName){
		$scope.tempName = "dashboard_"+ containerName.Name;
        dashboardservices.setTemplateSelected($scope.tempName);
			var containerJson = {
			"templatename": "dashdahsfdfdfdf",
			"unit_type":"container",
			"sub_type":"docker",
			"widgets": [],
			"metrics": []
			} 
	
			containerJson.templatename = "dashboard_"+ containerName.Name;
			containerJson.unit_type = "container";
			containerJson.sub_type = "docker";
			containerJson.widgets.push(containerName.Name);
			containerJson.metrics.push(JSON.parse('{"name": "container_cpu_system_seconds_total","labels": [{"name": "cadvisor"}]}'));
		
			$http.post("/savedashboard/",containerJson).success(function(data){
				$mdDialog.show({
					controller: DialogChartController,
					templateUrl: 'partials/dialogchart.html',
					parent: angular.element(document.body),
					clickOutsideToClose:true,
				});
				$scope.cancel = function() {	
					$mdDialog.cancel();
					console.log()
				};
	        })
	}
	
	$scope.openVMChartModal = function(vm){
		$scope.tempName = "dashboard_"+ vm.name;
        dashboardservices.setTemplateSelected($scope.tempName);
		var containerJson = {
			"templatename": "dashdahsfdfdfdf",
			"unit_type":"node",
			"sub_type":"node",
			"widgets": [],
			"metrics": []
		} 
	
		containerJson.templatename = "dashboard_"+ vm.name;
		containerJson.widgets.push(vm.name);
		containerJson.metrics.push(JSON.parse('{"name": "node_cpu","labels": [{"cpu": "cpu3"},{"mode":"idle"}]}'));
		
		$http.post("/savedashboard/",containerJson).success(function(data){
            $mdDialog.show({
				controller: DialogVMChartController,
				templateUrl: 'partials/dialogchart.html',
				parent: angular.element(document.body),
				clickOutsideToClose:true,
			});
        });
		
		$scope.cancel = function() {	
			$mdDialog.cancel();
			console.log()
		};
	  
	}
	  
	$scope.openAppChartModal = function(app){
		$scope.tempName = "dashboard_"+ app.Name;
        dashboardservices.setTemplateSelected($scope.tempName);
		var containerJson = {
			"templatename": "dashdahsfdfdfdf",
			"unit_type":"app",
			"sub_type":"tomcat",
			"widgets": [],
			"metrics": []
		} 
		containerJson.templatename = "dashboard_"+ app.Name;
		containerJson.widgets.push(app.Name);
		containerJson.metrics.push(JSON.parse('{"name": "java_lang_runtime_uptime","labels": [{"job":"prometheus"}]}'));
		
		$http.post("/savedashboard/",containerJson).success(function(data){
            $mdDialog.show({
				controller: DialogVMChartController,
				templateUrl: 'partials/dialogchart.html',
				parent: angular.element(document.body),
				clickOutsideToClose:true,
		    });
        });

		$scope.cancel = function() {	
			$mdDialog.cancel();
			console.log()
		};
	  
	}
	$scope.application=[];
	$scope.unit_type;
	var unit;
	 $scope.runningApp = function(appname){
	 	 $scope.appnameis = appname;
		 $scope.unit_type = dashboardservices.retrieve_label();
		 console.log("asdd",$scope.unit_type);
		 var appType = appname;
		  dashboardservices.add_appname(appType);
		  //console.log(dashboardservices.retrieve_appname()); 

		 if($scope.unit_type == 'Create_APP') unit = 'app';
		 console.log("inside running app",appname,unit);
		 //console.log(appname,unit_type);
		 
		 $http.get('/getAppInstances/'+unit+'/'+appname).success(function(data){
			 console.log(JSON.stringify(data));
			 $scope.application = data;
			 console.log("GGGGGGGGGGGGGG "+JSON.stringify($scope.application),unit);
			 dashboardservices.add_instances($scope.application)
			 console.log("labels added",JSON.stringify(dashboardservices.retrieve_instances()));
			 $window.location.href = "#/application";
		});
		  console.log(JSON.stringify($scope.application));
	 }
	$scope.appinstance = ['mysql','cassandra','postgres','mongodb','tomcat','jboss','db2','SQLserver'];
	
	$scope.opendiv = function(){
		console.log("clicked*****");
		$scope.ifselected = true;
	}

	$scope.closediv = function(){
	 $scope.ifselected = false;
	 }
	 $scope.instancearray = [];
	 $scope.clickInstance = function(ev){
			console.log("Inside click instance")
			$timeout(function(){
				var $target = angular.element(ev.originalEvent.target);
				if($target.hasClass('checkboxCell') || $target.parents('.checkboxCell').length>0){
					var clickedTr = $target.parents('tr'),
						rowSelected = clickedTr.hasClass('selectedRow'),
						rowData = clickedTr.scope().rowData;
						console.log("checkbox clicked", JSON.stringify(rowData.data[1]));
						//dashboardservices.add_selected_matrics(rowData.data[0]);	
						dashboardservices.add_instances(rowData.data);
						console.log(JSON.stringify(dashboardservices.retrieve_instances()));
						//if(rowSelected){
						//	$scope.openModal(rowData);
						//}
						$scope.instancearray.push(rowData.data[1]);
						dashboardservices.add_instancearray($scope.instancearray);
						console.log("host",JSON.stringify($scope.instancearray));
				}				
			}, 100);
		}
	 
	$scope.selectLabel = function(){
		console.log('inside label');
		$window.location.href = '#/label';
	}
		 
	$scope.toggle = function (appname) {
		if(appname != null){return true;}
		else return false;
	}

	 $scope.getInstaces = function(){
	 	$scope.applicationinstances = dashboardservices.retrieve_instances()
		console.log("app instances", JSON.stringify($scope.applicationinstances));
	 }
	  
	$scope.focusVM = function(vm){
		console.log('focusVM', vm);
		$scope.vminfocus = vm;
	};
	
	$scope.focusContainer = function(container){
		console.log('container', container);
		$scope.containerinfocus = container;
	};
	
	$scope.touchApp = function(container){
		console.log('container touch', container);
		$scope.containerinfocus = container;
	}
	
	$scope.dashboardConfigData = {
		"templatename": "",
		"widgets": [],
		"metrics": []
	};
	$scope.selectedName=[];
	
    $scope.retrieveNodes = function(){
        $scope.actionlabel = dashboardservices.retrieve_label();
        $scope.val = dashboardservices.retrieve_value();
        var actionlabel;
		if($scope.actionlabel == "Container_Node" || $scope.actionlabel == "Create_Container" ) actionlabel = "container";
		else if($scope.actionlabel == "VM_Node" || $scope.actionlabel == "Create_VM") actionlabel = "node";
		console.log("actionlabel",actionlabel);
		dashboardservices.add_appname(actionlabel);
        $http.get("/getnodes/"+actionlabel).success(function(data){
			console.log("container data",JSON.stringify(data));
            for(obj in data){
				//var str = data[obj].Name.split("_");
				//var str = data[obj].Name.split("_");
				//console.log("split data",JSON.stringify(str));
              //if(actionlabel =='container') data[obj].Name_short = str[1]+"_"+str[2];//only container names to be shortened
               // else
					data[obj].container_short = data[obj].container;
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
        //if($scope.actionlabel == "Container_Node" || $scope.actionlabel == "Create_Container" ) actionlabel = "container";
        if($scope.actionlabel == "Container_Node" || $scope.actionlabel == "Create_Container" ) actionlabel = "container";
        else if($scope.actionlabel == "VM_Node" || $scope.actionlabel == "Create_VM") actionlabel = "node";
		console.log("actionlabel",actionlabel);
        $http.get("/getmetrics/"+actionlabel ).success(function(data){
			$scope.metrics_list = data;
            console.log("Metrics "+JSON.stringify($scope.metrics_list));
        });
    }

	$scope.retrieveAppMetrics = function(){

		$scope.actionlabel = dashboardservices.retrieve_label();
		var app_name = dashboardservices.retrieve_appname();
		console.log("appname",app_name);
		var actionlabel;
		if($scope.actionlabel == "Container_Node" || $scope.actionlabel == "Create_Container" ) actionlabel = "container",app_name="docker";
        else if($scope.actionlabel == "VM_Node" || $scope.actionlabel == "Create_VM") actionlabel = "node",app_name="docker";
		if($scope.actionlabel == "Create_APP") actionlabel = "app";
		$http.get('/getmetrics/'+actionlabel+'/'+app_name).success(function(data){
			$scope.metrics_list = data;
            console.log("Metrics "+JSON.stringify($scope.metrics_list));
        });
	}

	if(window.location.hash === "#/containers"){
		dashboardservices.dshbrd.resetDashboardData();
	}
				  
	$scope.selectWidgets = function(rows){
		//dashboardservices.dshbrd.setDashboardWidget(rows.map(function(row){ return row[2]; }));
		dashboardservices.add_selectedinstances(rows)
		console.log("selected rows",dashboardservices.retrieve_selectedinstances());
	}
	  
	$scope.configureDashboard = function() {
		console.log("dashboardservices", dashboardservices);
		$window.location.href = '#/matrix'
	};

	$scope.configureAppDashboard = function() {
		//console.log("dashboardservices", dashboardservices);
		$window.location.href = '#/appmetrix'
	};

	$scope.addSelectedContainers = function(rows){
		$scope.dashboardConfigData.widgets
			for(var i=0,j=rows.length;i<j;i++){
			 
			}
		
		var str = rows.toString().split(",");
		console.log('str name',str);
		var evenElements='';
		var fullname = [],longstr=[],i=0;
		fullname = $scope.containers;
			for(i in fullname){
				longstr = fullname[i].Name;
				console.log("long name",longstr);
			}
				
		var j=0,shortstr=[];
		shortstr = str[2];
		console.log("short name 1",shortstr);
		console.log("strtt",str[2]);
		for(j in str){ 
			str[2] = longstr;
			console.log("res str",str[2]);
		}	
	}
		$scope.addSelectedMatrix = function(rows,ev) {
			$scope.selectedMatrix=[];
			console.log("addSelectedMatrix ",rows, ev);
			var str = rows.toString().split(",");
			var evenElements="";
			for (i in str){
			console.log(i,i%2);
			if (i==0) evenElements = str[i];
			//else if (i%2 == 0) evenElements = evenElements+'\"'+','+'\"'+str[i];
			else if (i%2 == 0) evenElements = evenElements+","+str[i];
			}
			$scope.selectedMatrix.push(evenElements.split(','));
			console.log("ccdccccc",JSON.stringify($scope.selectedMatrix));
			dashboardservices.add_recmetrics($scope.selectedMatrix[0]);
			console.log(JSON.stringify($scope.selectedMatrix));
			console.log("normal flow metrics",JSON.stringify(dashboardservices.retrieve_recmetrics()));
	    };
	  
		$scope.myclick = function(clickevent){
			console.log("Inside myclick")
			$timeout(function(){
				var $target = angular.element(clickevent.originalEvent.target);
				if($target.hasClass('checkboxCell') || $target.parents('.checkboxCell').length>0){
					var clickedTr = $target.parents('tr'),
						rowSelected = clickedTr.hasClass('selectedRow'),
						rowData = clickedTr.scope().rowData;
						console.log("checkbox clicked", JSON.stringify(rowData.data[0]));
						dashboardservices.add_selected_matrics(rowData.data[0]);	
						//if(rowSelected){
						  //$scope.openModal(rowData);
						//}
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
				clickOutsideToClose:true,
			});
		}
		
		var recmetricsnames=[];
		var buttontext;
		$scope.getmetrics = function(ev){
			var recmetrics = {metrics:[]};
			var selectedapp = dashboardservices.retrieve_appname();
			console.log("appname",selectedapp);
			//if (selectedapp == null)  {selectedapp = "container"; dashboardservices.add_appname("docker")}
			$http.get('/getrecmetrics/'+selectedapp).success(function(data){
				console.log(JSON.stringify(data));
				//console.log(JSON.stringify(data[0].metrics.length));
				console.log("438 "+dashboardservices.retrieve_selectedinstances());
				for (h=0;h<dashboardservices.retrieve_selectedinstances().length;h++){
					for(i=0;i<data[0].metrics.length;i++){
						//recmetricsnames[i] = data[0].metrics[i].name + dashboardservices.retrieve_selectedinstances()[h];
						recmetricsnames[i] = data[0].metrics[i].name;
						if (selectedapp == "container") {
							data[0].metrics[i].label.name = dashboardservices.retrieve_selectedinstances()[h];
						}else{
							data[0].metrics[i].label.instance = dashboardservices.retrieve_selectedinstances()[h];
						}
						var x = data[0].metrics[i];
						console.log("++++",JSON.stringify(x));
						recmetrics.metrics.push(new Array(x));
					}
				}
				console.log("modified data "+JSON.stringify(recmetrics))
				console.log("rec metrics name",JSON.stringify(recmetricsnames));
				dashboardservices.add_recmetrics(recmetricsnames);	
			//	console.log("recmetrics name",JSON.stringify(dashboardservices.retrieve_recmetrics));
			   	dashboardservices.dshbrd.addMetric(recmetrics);
			});
		}
		
		$scope.label_obj = [{"host":[],
								"smetrics":[]
								}];
								
		$scope.showLabel = function(){
			var mname;
			var mlabel;
			console.log("inside showlabel");
			//$scope.label_obj = [{"host":[],
				//				"smetrics":[]
				//				}];
			//$scope.label_obj[0].host = dashboardservices.retrieve_instancearray();
			console.log($scope.label_obj[0].host);
			var metricdata = dashboardservices.retrieve_recmetrics();
			console.log(metricdata);
			var metricjson = {"name":'',"label":[]};
			var metricjson = [];
			for(i=0;i<metricdata.length;i++){
				console.log(metricdata[i]);
				metricjson[i] = {"name":'',"label":[]};
				filldata(metricjson[i],metricdata[i]);	
			}
				console.log("metricjson",JSON.stringify(metricjson));
			// $scope.label_obj[0].smetrics[0]=metricjson;
			//$scope.label_obj[0].smetrics = dashboardservices.dshbrd.getDashboardData();
			//console.log("final json",JSON.stringify($scope.label_obj));
		}
		
		function filldata(mdata,metric){
			var unittype = dashboardservices.retrieve_label();
			if(unittype == "Create_APP"){
			app = "app";
			}
			else { var app = dashboardservices.retrieve_appname();}
			console.log(app)
			$http.get('/getModalData/'+metric+"/"+app).success(function(data){
				mdata = {"name":'',"label":[]};
					console.log("metric label",JSON.stringify(data));
					//console.log("length",data.labels.length);
						mdata.name = data.name;
						//if( data.labels.length == 0){alert("Metric has no label");}
					for(i=0;i<data.labels.length;i++){
							mdata.label.push(data.labels[i].label);
							//mdata.label=data.labels[i].label;
						
					}
					
					console.log(JSON.stringify(mdata));
					dashboardservices.add_labeldata(mdata);
					
				console.log(mdata);
				$scope.label_obj[0].host = dashboardservices.retrieve_instancearray();
				console.log($scope.label_obj[0].host);
				console.log("service data",JSON.stringify(dashboardservices.retrieve_labeldata()));
				$scope.label_obj[0].smetrics.push(dashboardservices.retrieve_labeldata());
				console.log("data",JSON.stringify($scope.label_obj[0].smetrics[0].name));
				$scope.key = $scope.label_obj[0].smetrics[0].label;
				console.log("fkvdfk",$scope.key);
				//for(i=0;i<$scope.label_obj[0].smetrics[0].label.length;i++){
				//	$scope.key.push(JSON.stringify(Object.keys($scope.label_obj[0].smetrics[0].label[i])));
				//}
				console.log("data",JSON.stringify($scope.label_obj));
				console.log("key",JSON.stringify($scope.key));
			});
		}
		
		/*var labelarray=[];
		$scope.labelpush = function(){
			console.log("checked");
			console.log("checkbox value",$scope.labelcheck);
			labelarray.push($scope.labelcheck);
			dashboardservices.add_attachlabel(labelarray);
			console.log("attach label data",dashboardservices.retrieve_attachlabel());
		}
		console.log("LABELARRAY",labelarray);
		*/
		$scope.checkedDataArray = [{"name":''}];
		var attachmetric;
		$scope.updateChecked = function(el,d,i){
		console.log('updateChecked', el, d,i);
		$scope.checkedDataArray = [{"name":'',"label":[]}];
			if(d.isChecked){
					$scope.checkedDataArray[0].label.push(d);
					$scope.checkedDataArray[0].name = i;
					attachmetric = dashboardservices.add_recmetrics(i);
					dashboardservices.add_instances(d)
			}
			else{
			$scope.checkedDataArray.splice($scope.checkedDataArray.indexOf(d), 1);
			}
			dashboardservices.dshbrd.addMetric(attachmetric);
			console.log("checked array",JSON.stringify($scope.checkedDataArray));
			console.log("services", JSON.stringify(dashboardservices.retrieve_recmetrics()));
			console.log("services", JSON.stringify(dashboardservices.retrieve_instances()));
			
		};
  
		$scope.saveAttachedLabel = function(){
			/*var metricdata = dashboardservices.retrieve_recmetrics();
			console.log("attach label metric",metricdata);
			var attach_obj = {"metrics":[{}]};
			for(i=0;i<metricdata.length;i++){
				attach_obj.metrics[0].name = metricdata[i];
			}*/
			$window.location.href = '#/appmetrix';
		}
		
		$scope.saveDashboard = function(){
			var json_obj = {};
			json_obj.name = $scope.dbname;
			console.log("db name",json_obj.name);
	        json_obj.unit_type = "docker";
	        //json_obj.metrics_list = $scope.selectedMatrix;
	        json_obj.metrics_list = dashboardservices.retrieve_recmetrics();
			console.log("metrics...",JSON.stringify(dashboardservices.retrieve_recmetrics()));
			//json_obj.labels = dashboardservices.retrieve_metricLabel();
			json_obj.labels = dashboardservices.retrieve_instances();
			console.log("retrieved labels",JSON.stringify(json_obj.labels));
			//console.log("matrix",json_obj.metrics_list);
	       // json_obj.names_list = dashboardservices.retrieve_containers();
	        json_obj.names_list = dashboardservices.retrieve_instances();
			console.log("names",json_obj.names_list);
			console.log("POST OBJ",JSON.stringify(json_obj));
			console.log("dbanme",$scope.dbname);			

			dashboardservices.dshbrd.setDashboardName($scope.dbname);
			
			var data = dashboardservices.dshbrd.getDashboardData();
			console.log(JSON.stringify(data));
			//data["widgets"] = recmetricsnames;
			data["widgets"]=dashboardservices.retrieve_recmetrics();
			//data["widgets"] = dashboardservices.retrieve_recmetrics();
			var appnameX = dashboardservices.retrieve_appname();
			if (appnameX == 'node') { data["type"] = "node"; data["subtype"] = "node" }
			else if (appnameX == 'container') { data["type"] = "container"; data["subtype"] = "docker" }
			else { data["type"] = "app"; data["subtype"] = appnameX }

			//data["type"] = 'app'; if (dashboardservices.retrieve_appname() == "docker") { data["type"] = "container"}
			//data["subtype"] = dashboardservices.retrieve_appname();			
			console.log(JSON.stringify(data));
				$http.post("/savedashboard/",data).success(function(data){
					alert("Dashboard Created Successfully");
					$window.location.href = '#/dashboards';
				});
		};
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

function DialogVMChartController($scope,$http,$mdDialog,dashboardservices){
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
	var actionlabel;
	var selectedmtrx = dashboardservices.retrieve_selected_matrics();
	//$scope.dataarray = [{keyspace: null, name: null, scope: null}];
	$scope.dataarray = [{}];
	if($scope.actionlabel == "Container_Node" || $scope.actionlabel == "Create_Container" ) actionlabel = "container";
		else if($scope.actionlabel == "VM_Node" || $scope.actionlabel == "Create_VM") actionlabel = "node";
		else if($scope.actionlabel == "Create_APP") actionlabel = "app"
	$http.get('/getModalData/'+selectedmtrx+"/"+"app").success(function(data){
		$scope.dialogContent = data.labels;
		console.log("dialogContent",JSON.stringify($scope.dialogContent));
		$scope.key1 =[];
		for(i=0;i<$scope.dialogContent.length;i++){
			var keys = [];
			keys.push($scope.dialogContent[i]);
			console.log("keys",JSON.stringify(keys),keys[0].label.length);
			for(j=0;j<keys[0].label.length;j++){
				var nextKey = Object.keys(keys[0].label[j]).toString();
				console.log("nextkey",nextKey);
				if (!($scope.key1.indexOf(nextKey) > -1)){
				$scope.key1.push(nextKey);
				}
			}
			console.log('key1',JSON.stringify($scope.key1),$scope.key1.length);
		}
		//Bala - 01Dec - Start
		dashboardservices.add_label_keys($scope.key1);
		//Bala - 01Dec - End
		$scope.values = [];
		var nextval = [];
		$scope.x = [];
		for (k=0;k<$scope.key1.length;k++){
			$scope.duparray = [];
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
	});
	$scope.cancel = function() {
		$mdDialog.cancel();
		console.log()
	};
	$scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
	$scope.savemetric=[];
	/*$scope.saveLabel = function(){
		//Bala - 01Dec - Start
		//var keys = ['job','instace_key','instance'];
		var keys = dashboardservices.retrieve_label_keys();
		//Bala - 01Dec - End
		var metric = {name: '', label: {}};
		var metriclabel = dashboardservices.retrieve_metricLabel();
		var metricdataarray = $scope.dataarray;
		metric.name = metriclabel.data[0];
		
		$.each(metricdataarray, function(k, metricdata){
			console.log("selected val",JSON.stringify(metricdata));
			metric.label[k] = [];
			var d = {};
			$.each(metricdata.selectedval, function(i,j){
				d[keys[i]] = j;
			});				
			metric.label[k] = d;			
		});
		console.log("data array",JSON.stringify(metricdataarray));
		metric.label = metric.label[0];//to be removed
		console.log('selected key',JSON.stringify(metric));
		$scope.savemetric.push(metric);
		console.log("savemetric",JSON.stringify($scope.savemetric));
		dashboardservices.dshbrd.addMetric(new Array(metric));
	}*/
	
	$scope.addrow = function(){ 
		console.log("select val",$scope.selectedval);
		
		$scope.dataarray.push({});
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
					//case "Container":
					case "Create_VM":
					$scope.actionlabel = id;
					$window.location.href = '#/VM';
					break;
					case "Create_Container":
					//case "Create_VM":
					//case "Container_Node":
					//case "VM_Node":
					$window.location.href="#/containers";
					$route.reload();
					break;
					case "Create_APP":
					$window.location.href="#/selectapp";
					break;
				}
			}
        })
    });
	$scope.showPrompt = function(ev){
		console.log("prompt");
		$mdDialog.show({
		  controller: AppDialogController,
		  templateUrl: 'partials/appdialog.html',
		  parent: angular.element(document.body),
		  targetEvent: ev,
		  clickOutsideToClose:false,
		  fullscreen: $scope.customFullscreen 
		})
		
	}
}

function AppDialogController($scope, $mdDialog) {
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
 
    $scope.loaddashboards = function(){
        var data1='';
        $http.get("/getdashboards/").success(function(data){
            $scope.dashboards = data;
            data1=data;
        });
                                  
        $http.post("/reload/",data1).success(function(data,header){
            console.log("UPDATED",header);
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
	    })
	});
		
	var input_value = $scope.dbname;  
	if (input_value == "") input_value=null;
	console.log('input val',input_value);
		
	$scope.search = function(){
		var input_value = $scope.dbname;
		console.log("input value",JSON.stringify($scope.dbname));
		console.log("inside search");
        var actionlabel;
        if($scope.actionlabel == "Container" ) actionlabel = "container";
        else if($scope.actionlabel == "VM" ) actionlabel = "node";
		$http.get('/search/'+actionlabel+'/'+input_value).success(function(data){
			for(obj in data){
                var str = data[obj].Name.split("_");
                if(actionlabel =='container') data[obj].Name_short = str[1]+"_"+str[2];//only container names to be shortened
                else data[obj].container_short = data[obj].container;
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
		for(var i=0;i<data.length;i++){
			$scope.items.push(data[i]);
			if(data[i].selected){
				$scope.selected.push(data[i]);
				defaultselectednames.push(data[i].name);
				console.log("selected",JSON.stringify($scope.selected));
				$scope.defaultselected.push(data[i]);
				console.log("default selected",JSON.stringify($scope.defaultselected));
			}
		}
	  
	})	
  
  
	$scope.toggle = function (item, list){
	    if(defaultselectednames.indexOf(item.name) != -1){
			return;
		}
	  
		var idx = list.indexOf(item);
		if(idx > -1)
		  list.splice(idx,1);
		else {
		list.push(item);
		}
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
		$scope.selected = $scope.defaultselected;
		console.log("default",JSON.stringify($scope.selected));
		} else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
			$scope.selected = $scope.items.slice(0);
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

function myController($scope, $timeout,$http,$mdDialog,$interval,$window, dashboardservices) {
               
	$scope.seriesLabel = [];
	$scope.seriesData = [];
    $scope.noWrapSlides = false;
    $scope.active = 0;
    $scope.whereami = "line";
    $scope.templatename = "";
	$scope.selectedtiles = [];

	$scope.setTemplate = function(){
        //$scope.templatename = dashboardservices.getTemplateSelected(); 
        $scope.templatename = dashboardservices.retrieve_link();
		console.log(" Template Is "+$scope.templatename)
        var jsonobj = JSON.stringify({
            templatename:$scope.templatename
        })
        getDashboardDetails(JSON.parse(jsonobj));
    }
 
	$http.get('/getTiles').success(function(data){
		if(data.length>0){
			for(i=0;i<data[0].checkboxLabel.length;i++){
				$scope.selectedtiles.push(data[0].checkboxLabel[i]);
			}
		}
	});
 
    $scope.hereiam = function(page){
        $scope.whereami = page;
    }
 
    $scope.load = function(page){
		$scope.whereami = page;
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
				
	$scope.allwidgets;
    var getDashboardDetails = function(dashboard){
        $http.get('/dashboard/metrics/'+dashboard.templatename).success(function(data){       
			dashboard.widgets = data;
			$scope.allwidgets = data;
			plotChart(dashboard.templatename,data); 
        })
    };
	var myInterval;
	function plotChart(dashboardname, metricdata){
         console.log("Inside plotChart "+dashboardname+" "+metricdata)
        var allCharts = [];

                        for (x=0;x<metricdata.length;x++){
                console.log(JSON.stringify(metricdata[x]));
                var ctx = $('#'+"temp"+x)
                                console.log(ctx)
                var config = new Object({
                                        type: 'line',
                                        
                                        data: {
                                                labels: [],
                                                datasets: []
										},
                                        options: {
                                                showTooltip:true,
                                                responsive:true,
                                                title:{
                                                display:true,
                                                text:metricdata[x].widget
                                        },
                                        tooltips: {

                                                callbacks: {
                                                        //label: function(tooltipItem, data) {
                                                        x:Number,
                                                        y:Number,
                                                        point:function(){
                                                                console.log("inside point");
                                                        }
                                                }
                                        },
                                        hover:{
                                                mode:'point'
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
                                var bkcolor;
                                for(mtrx=0;mtrx<metrics.length;mtrx++){
                                        config.data.datasets.push({
                                                label: metrics[mtrx].name,
                                                data: [],
                                                backgroundColor: [
                                                    bkcolor = randomColor(0.9)
                                                ],
                                                borderColor: [
                                                    bkcolor
                                                ],
                                                borderWidth: 0,
                                                fill: false
                                        })
                                }
                        allCharts.push(new Chart(ctx, config));
                        console.log("length of charts "+allCharts.length)
                         }
        
        var myInterval = setInterval(function(){
            $.each(allCharts, function(i, chart) {
                    $http.get('/dashboard/chartdata/'+dashboardname+'/'+chart.options.title.text).success(function(result){
                          //console.log("Recieved "+JSON.stringify(result))
                        for(h=0;h<result.length;h++){
                          var dtnow = new Date(result[h].value.x*1000);
                          //if (chart.data.labels.length > 5) chart.data.labels.shift();
                            chart.data.labels.push(dtnow.getHours()+":"+dtnow.getMinutes()+":"+dtnow.getSeconds()); 
                            //if (chart.data.datasets[h].data.length > 15) chart.data.datasets[h].data.shift(); 
                            var value = parseInt(result[h].value.y);
                            //if (value >= 1000) value = value + "K";
                            chart.data.datasets[h].data.push(value);
                            console.log(chart.options.title.text);
                        }
                        chart.update();                                                   
                    })
            })
        	$scope.currPath = $window.location.hash;
			console.log("currPath",$scope.currPath);
			if($scope.currPath != '#/dblink'){
				stopInterval();
			}
		
		},5000)

		function stopInterval(){
				 clearInterval(myInterval);
				 console.log("STOPPED");
		}
     //   console.log("id............."+id)
    }
	
	
   /* function plotChart(dashboardname, metricdata){
    	console.log("Inside plotChart "+dashboardname+" "+metricdata)
        var allCharts = [];
		showTooltips:true; 
			for (x=0;x<metricdata.length;x++){
                console.log(JSON.stringify(metricdata[x]));
				
                var ctx = $('#'+"temp"+x)
				console.log(ctx)
                var config = new Object({
					type: 'line',
					data: {
						labels: [],
						datasets: []
                    },
					options: {
						
						responsive:true,
						title:{
							display:true,
							text:metricdata[x].widget
					},
					tooltips: {
						callbacks: {
							//label: function(tooltipItem, data) {
								x:Number,
								y:Number,
							    point:function(){
								console.log("inside point");
						}
					}
						},
					hover: {
                    mode: 'point'
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
						}
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
      myInterval = setInterval(function(){
		   var count = 0;
            $.each(allCharts, function(i, chart) {
	            $http.get('/dashboard/chartdata/'+dashboardname+'/'+chart.options.title.text+'/'+count++).success(function(result){
	            	console.log("Recieved "+result)
	                for(h=0;h<result.length;h++){
	                if (h==0) chart.data.labels.push(dhm(result[h].value.x)); 
	                    chart.data.datasets[h].data.push(result[h].value.y);
	                    console.log(chart.options.title.text);
	                }
	                chart.update();                                                   
	            })
            })
			$scope.currPath = $window.location.href;
			console.log("currPath",$scope.currPath);
			if($scope.currPath != 'http://localhost:3300/#/dblink'){
				stopInterval();
			}
        },5000)   
		function stopInterval(){
				 clearInterval(myInterval);
				 console.log("STOPPED");
		}
		
    }*/
	
    function dhm(t){

        var date = new Date(t); 	
		console.log(date);
        var cleanDate = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		console.log("Date is",cleanDate);
        return cleanDate
    }
 
    var randomColorFactor = function() {
        return Math.round(Math.random() * 255);
    };
	
    var randomColor = function(opacity){
 
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