
module.exports = function(app) {
	app.get('/getdashboards/', function(req, res, next) {
		//console.log(req.params.i);
		//res.send(req.params.i);
		res.redirect("/dashboard/templates/");
	});
	app.get('/dashboard/metrics/:appname', function(req, res, next) {
		var metric = app.get('metric');
		var condition = {};
		var fields = {};
		condition.where ={templatename:req.params.appname};  
		fields = 
					{'_id':0};

				metric.find(condition,fields,null,function(err,result){ 
					if(err)
						console.log("Error is : " +  err);
					else{
						var results = [];
						for(i in result){						
					    	results.push(result[i]);
					    }
						res.send(result);								
						}
				});
	});	
	app.post('/savedashboard/', function(req, res, next) {
    	res.redirect(307,'/dashboard/templatecreate/');
	});
	app.post('/dashboard/createmetrics/', function(req, res, next) {
		console.log("inside create metrics");
		var metric = app.get('metric');
		var attributes = {}
		//console.log("template is "+JSON.stringify(attributes));
		for (i=0;i<req.body.widgets.length;i++){
			attributes = {templatename:req.body.templatename, widget:req.body.widgets[i], metrics: req.body.metrics}; 
			metric.save(attributes,function(err,result){ 
				if(err){
				console.log(err+"error");
					next(err);}
				else {
					//res.send(result);
				}
			});
		}
		res.send("created");
	});
	app.post('/updatedashboard/', function(req, res, next) {
    	res.redirect(307,'/dashboard/templatesave/');
	});
	app.post('/dashboard/updatemetrics/', function(req, res, next) {
		console.log("inside update metrics");
		var metric = app.get('metric');
		var condition = {};
		condition = {templatename:req.body.templatename, appname:req.body.widgets};		
		var attributes = {}
		attributes = {metrics: req.body.metrics}; 
		//console.log("template is "+JSON.stringify(attributes));
		
		metric.update(condition,attributes,function(err,result){ 
			if(err){
				console.log(err+"error");
				next(err);}
			else {
				res.send(result);
			}
		});
	});
	app.delete('/deletedashboard/:dbname', function(req, res, next) {
		res.redirect('/dashboard/remove/'+req.params.dbname);
	});
	app.get('/dashboard/chartdata/:dashboardname/:widget', function(req, res, next) {
		var metric = app.get('metric');
		var condition = {};
		condition.where = {templatename:req.params.dashboardname, widget:req.params.widget};
		var fields = {};
		fields = 
			{'_id':0, metrics:1};
			metric.find(condition,fields,null,function(err,result){ 
				if(err)
					console.log("Error is : " +  err);
				else{
					var metricscount=0; 
						//console.log("metrics length "+JSON.stringify(result[0].metrics.length));//total number of metrics
					var response = [];
					var http = require ("http");
					var config = require('config');
					var options = {
							hostname: config.server.dashboard_server_ip,
							port: config.server.dashboard_server_port,
							path: '/v1/metrics',
							method: 'POST',
					  	    headers: {
							    'Content-Type': 'application/json'
							}						
					};		

					require("async").whilst(
						function(){
							if (metricscount < result[0].metrics.length) return true;
						},
						function(callback){
							var labelcount = 0;
								//console.log("label length "+JSON.stringify(result[0].metrics[metricscount].labels.length));
							require("async").whilst(
								function(){
									if (labelcount < result[0].metrics[metricscount].labels.length) return true;
								},
								function(next){
									//console.log("label is "+JSON.stringify(result[0].metrics[metricscount].labels[labelcount]));
									var jsonObj2={};
									jsonObj2 ={unit_type:'container',sub_type:'docker'};
									jsonObj2.meter_name = {
										label : result[0].metrics[metricscount].labels[labelcount], 
										name  : result[0].metrics[metricscount].name
									}

									console.log("Options "+ JSON.stringify(options)+" JSON ", JSON.stringify(jsonObj2));									
										//var req1 = http.request(options, function(res1) {
										  //res1.setEncoding('utf8');
		 								  //res1.on('data', function(chunk) {
										    //console.log("BODY : ", JSON.parse(chunk));
										    var time = new Date().getTime();
										    response.push(
										    	{
									                "name":"label1", 
									                "value": [{x:time,y:0.78*Math.random()}],
									                "widget":req.params.widget,
									                "dashboard":req.params.dashboardname
									            });
										    /*response.push(
										    	{
									                "name":"label1", 
									                "value": [{x:time,y:0.78*Math.random()}],
									                "widget":req.params.widget,
									                "dashboard":req.params.dashboardname
									            });*/
										    console.log("Response "+JSON.stringify(response))
										    labelcount++;
										    next();
										 // });
										 // res1.on('end', function(){
										    //console.log('No more data in response.');
										 // });
										//});

										// req1.on('error', function(e) {
										// 	console.log("problem with request: "+e.message);
										// });
										// 	// write data to request body
										// req1.write(JSON.stringify(jsonObj2));
										// req1.end();
								},
								function(err,count){
									//callback for inner loop
									metricscount++;	
									//console.log("metricscount "+metricscount);
									callback();	
								}
							)
						},
						function (err, n) {	
							console.log("returning");
							//console.log(response)
							//res.setEncoding('utf8');
							//res.set('Content-Type', 'application/json');
							res.send(response);
						})
				}	
			});
	})
	app.get('/dashboard/chartdata/:dashboardname', function(req, res, next) {
		var metric = app.get('metric');
		var condition = {};
		condition.where = {templatename:req.params.dashboardname};
		var fields = {};
		fields = 
			{'_id':0, metrics:1, widget:1};
			metric.find( condition,fields,null,function(err,result){ 
				if(err)
					console.log("Error is : " +  err);
				else{
					//console.log("Result is "+JSON.stringify(result))
					var widgetcount = 0;
					var response = [];
					var http = require ("http");
					var config = require('config');
					var options = {
							hostname: config.server.dashboard_server_ip,
							port: config.server.dashboard_server_port,
							path: '/v1/metrics',
							method: 'POST',
					  	    headers: {
							    'Content-Type': 'application/json'
							}						
					};
					require("async").whilst(
						function(){
							if (widgetcount < result.length) return true;
						},
						function(cb1){
							var metricscount=0; 
							require("async").whilst(
								function(){
									if (metricscount < result[widgetcount].metrics.length) return true;
								},
								function(cb2){
									var labelcount = 0;
										//console.log("label length "+JSON.stringify(result[0].metrics[metricscount].labels.length));
									require("async").whilst(
										function(){
											if (labelcount < result[widgetcount].metrics[metricscount].labels.length) return true;
										},
										function(next){
											//console.log("label is "+JSON.stringify(result[0].metrics[metricscount].labels[labelcount]));
											var jsonObj2={};
											jsonObj2 ={unit_type:'container',sub_type:'docker'};
											jsonObj2.meter_name = {
												label : result[widgetcount].metrics[metricscount].labels[labelcount], 
												name  : result[widgetcount].metrics[metricscount].name
											}
											console.log("Request Sent to Prometheus : ", JSON.stringify(jsonObj2));									
											var req1 = http.request(options, function(res1) {
											  res1.setEncoding('utf8');
			 								  res1.on('data', function(chunk) {
			 								  	var responseJSON = JSON.parse(chunk);
											  	console.log("Response Recieved : ", responseJSON);
											  	//Response contains multiple instances matching the labels. Hence the following loop
											  	for(var instance_count=0; 
											  		instance_count < responseJSON.result_list.length;
											  		instance_count++) {
													    response.push(
													    	{
												                "meter_name" : jsonObj2.meter_name.name,
												                "label_name" : jsonObj2.meter_name.label,
												                "value" : [
												                			{ 
												                				x:responseJSON.result_list[instance_count].time,
												                			  	y: Math.random()//responseJSON.result_list[instance_count].value
												                			}
												                		  ],
												                "instance_name" : result[widgetcount].widget,//responseJSON.result_list[instance_count].instance_key,
												                "dashboard" : req.params.dashboardname
												            }
												        );	
												}
											    labelcount++;
											    next();
											  });
											  res1.on('end', function(){
											 	//console.log('No more data in response.');
											  });
											});

											req1.on('error', function(e) {
												console.log("problem with request: "+e.message);
											});
												// write data to request body
											req1.write(JSON.stringify(jsonObj2));
											req1.end();
										},
										function(err,count){
											//callback for inner loop
											metricscount++;	
											//console.log("metricscount "+metricscount);
											cb2();	
										}
									)
								},
								function (err, n) {	
									widgetcount++;
									cb1();
								})
						},
						function(){
							//console.log("returning");
							res.send(response);
						})	
				}
			})
	})
	app.get('/dashboard/metrics/:dashboardname/:widget', function(req, res, next) {
		var metric = app.get('metric');
		var condition = {};
		condition.where = {templatename:req.params.dashboardname,widget:req.params.widget};
		var fields = {};
		fields = 
			{'_id':0, metrics:1,widget:1};
			metric.find( condition,fields,null,function(err,result){ 
				if(err)
					console.log("Error is : " +  err);
				else{

					res.send(result);
				}
			})
	})

}
	//Following to be deleted
	/*app.post('/savedashboard/:entityname/:tags', function(req, res, next) {
    });*/	