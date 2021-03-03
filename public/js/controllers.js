function maincontroller($scope,$http,$window,dashboardservices,$route){
	$scope.type;
	$scope.res;
	$scope.val;
	$scope.instances = true;


	$scope.count=[];

	$http.get('/getOptions').success(function(data){
		$scope.leftnav = data;
	})

	$(document).ready(function(){
		$('[data-toggle="tooltip"]').tooltip();
	});

	$(document).ready(function(){
		$('[data-toggle="popover"]').popover();
	});

	$scope.getCount = function(val,index){
		$http.get('/getEntities?unit_type=generic&sub_type='+val).success(function(data){
			$scope.count[index] = data.result_list.length;
		})
	}

	$scope.getDisplayData = function(option){
		dashboardservices.add_type(option);
		$scope.option = option;
		if($scope.option == null){
			$scope.option = 'notfound';
		}
		$http.get('/getEntities?unit_type=generic&sub_type='+option).success(function(data){
			$scope.display = [];
			$scope.nextfield = [];
			for(i=0;i<data.result_list.length;i++){
				var x = data.result_list[i].service || data.result_list[i].container || data.result_list[i].node ||data.result_list[i].application ||data.result_list[i].datacenter ||data.result_list[i].framework;
				$scope.display.push(x);
			}
			$scope.nextfield = data.nextfields;
			$window.location.href ='#/index';
		})
	}

	$scope.nextval;
	$scope.clickedval;
	$scope.oldval;

	$scope.getNextField = function(service,field,val){
			$scope.display2 = [];
			$scope.nextfield2 = [];
			$scope.clickedval = service;
			$scope.nextval = field;
			if(val =='prev'){
				$scope.type = dashboardservices.retrieve_type();
			}
			else{
				$scope.type = $scope.oldval;
			}
			
			var unit_type = 'generic';
				$http.get('/getEntities'+'?unit_type=generic&'+$scope.type+'='+$scope.clickedval+'&sub_type='+$scope.nextval).success(function(data){
					$scope.nextfield2 = data.nextfields;
					$scope.oldval = $scope.nextval;
					for(i=0;i<data.result_list.length;i++){
						var x = data.result_list[i].service || data.result_list[i].container || data.result_list[i].node ||data.result_list[i].application ||data.result_list[i].datacenter ||data.result_list[i].framework;
						$scope.display2.push(x);
					}
					if($scope.display2 == null){
						$scope.instances = false;
					}
					$window.location.href = '#/entity';
					$route.reload();
				})
		}

		$scope.selectedMetric = {metric:null};
		$scope.selected1Metric = {metric:null};
		$scope.metricDataMap = {
			x:[],
			y:[]
		};

		var idval,id;
		$scope.OpenViewChart = function(val){
			$scope.value = val;
			$scope.recmetricsViewChart =[];
			dashboardservices.add_port(val);
			$http.get('/getrecmetrics/'+val).success(function(data){
				if(data.length == 0){
					$http.get('/getrecmetrics/'+$scope.option).success(function(data){
					var metric_names = [];
					for(i=0;i<data[0].metrics.length;i++){
						if(data[0].metrics[i].label.hasOwnProperty('instance'));
						data[0].metrics[i].label.instance = dashboardservices.retrieve_port();
						metric_names.push(data[0].metrics[i].name);
					}
						data[0].widgets = metric_names;
						$scope.recmetricsViewChart.push(data[0]);
						$window.location.href = '#viewChart';
						$scope.plotChart($scope.recmetricsViewChart);
					})
					}else{
						var metric_names = [];
						for(i=0;i<data[0].metrics.length;i++){
							if(data[0].metrics[i].label.hasOwnProperty('instance'))
							data[0].metrics[i].label.instance = dashboardservices.retrieve_port();
							metric_names.push(data[0].metrics[i].name);
						}
						data[0].widgets = metric_names;
						$scope.recmetricsViewChart.push(data[0]);
						$window.location.href = '#viewChart';
					}
				})
			}
		$scope.mergemetric=[];
		$scope.OpenChart = function(x,y){
			console.log(x,y);
			console.log($scope.nextval,$scope.type);
			$scope.recmetricsleft=[];
			$scope.recmetricsright=[];
			var entities=[];
			$scope.info = x;
			dashboardservices.add_port($scope.clickedval);
					$http.get('/getrecmetrics/'+x).success(function(data){
						if( data.length == 0){
									$http.get('/getrecmetrics/'+$scope.nextval).success(function(data){
										var metric_names = [];
										for(j=0;j<data[0].metrics.length;j++){
											if(data[0].metrics[j].label.hasOwnProperty('instance'))
											data[0].metrics[j].label.instance = dashboardservices.retrieve_port();
											metric_names.push(data[0].metrics[j].name);
										}
											data[0].widgets = metric_names;
											$scope.recmetricsright.push(data[0]);
											console.log("recmetricsright",$scope.recmetricsleft);
											$scope.mergemetric = $scope.recmetricsright;
									})
						}else{
								var metric_names = [];
								for(j=0;j<data[0].metrics.length;j++){
									if(data[0].metrics[j].label.hasOwnProperty('instance'))
										data[0].metrics[j].label.instance = dashboardservices.retrieve_port();
										metric_names.push(data[0].metrics[j].name);
								}
								data[0].widgets = metric_names;
								$scope.recmetricsright.push(data[0]);
								console.log("recmetricsright",JSON.stringify($scope.recmetricsright));
								$scope.mergemetric = $scope.recmetricsright;
						}
					});
					
					$http.get('/getrecmetrics/'+y).success(function(data){
						if( data.length == 0){
									$http.get('/getrecmetrics/'+$scope.type).success(function(data){
										var metric_names = [];
										for(j=0;j<data[0].metrics.length;j++){
											if(data[0].metrics[j].label.hasOwnProperty('instance'))
											data[0].metrics[j].label.instance = dashboardservices.retrieve_port();
											metric_names.push(data[0].metrics[j].name);
										}
											data[0].widgets = metric_names;
											$scope.recmetricsleft.push(data[0]);
											console.log("recmetricsleft",$scope.recmetricsleft);
											$scope.mergemetric = $scope.recmetricsright.concat($scope.recmetricsleft);
									})
						}else{
								var metric_names = [];
								for(j=0;j<data[0].metrics.length;j++){
									if(data[0].metrics[j].label.hasOwnProperty('instance'))
										data[0].metrics[j].label.instance = dashboardservices.retrieve_port();
										metric_names.push(data[0].metrics[j].name);
								}
								data[0].widgets = metric_names;
								$scope.recmetricsleft.push(data[0]);
								console.log("recmetricsleft",JSON.stringify($scope.recmetricsleft));
								$scope.mergemetric = $scope.recmetricsright.concat($scope.recmetricsleft);
						}
					});
				console.log("mergemetric",$scope.mergemetric);
		}
				
		
		var myInterval = 0;
		$scope.plotChart = function(metricdata){
			console.log("Inside Plotchart");
			console.log("METRICDATA",JSON.stringify(metricdata,metricdata.length));
			$scope.stopInterval();
			var chartJSON = {};
			for(i=0;i<metricdata.length;i++){
					for (x=0;x<metricdata[i].metrics.length;x++){
							var ctx = $('#'+metricdata[i].metrics[x].name)
							console.log(ctx);
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
													text:metricdata[i].widgets[x]
												},
                                      			tooltips: {
          											callbacks: {
                                                        x:Number,
                                                        y:Number,
                                                        point:function(){
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
							config.data.datasets.push({
							  label: metricdata[i].widgets[x],
								data: [],
								backgroundColor: [
									bkcolor = randomColor(0.9)
								],
								borderColor: [
									bkcolor
								],
								borderWidth: 0,
								fill: false})
							chartJSON[metricdata[i].metrics[x].name] = new Chart(ctx, config);
					}
			}

			// at this stage charts have been created for individual metrics
			// now get the data fro every metric, locate the corresponding chart with chartJSON
			// and plot the graph.

       myInterval = setInterval(function(){
					
					    $.each(metricdata, function(i, rec) {
							console.log("rec",JSON.stringify(rec));
                $http.post('/dashboard/chartdata',rec).success(function(result1){
									for(h=0;h<result1.length;h++){
										  var dtnow = new Date(result1[h].value.x*1000);
										  var value = parseFloat(result1[h].value.y);
										  var chart = chartJSON[result1[h].name];
										  chart.data.labels.push(dtnow.getMinutes()+":"+dtnow.getSeconds());
									  	  chart.data.datasets[0].data.push(value);
										  chart.update(2);
										  if (chart.data.datasets[0].data.length > 5){
											  chart.data.datasets[0].data.shift();
											  chart.data.labels.shift();
										  }
									}
							})
            })
        	$scope.currPath = $window.location.hash;
				},5000) 

	} 
	
		$scope.stopInterval = function(){
				var intervalval = myInterval;
				if(myInterval != 0){
					clearInterval(myInterval);
				}
			} 

	var randomColorFactor = function() {
        return Math.round(Math.random() * 255);
    };

    var randomColor = function(opacity){

        return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
    };
}
