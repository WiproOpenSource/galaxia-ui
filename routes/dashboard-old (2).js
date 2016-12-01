
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
		console.log("templatename",req.body.templatename);
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
										var req1 = http.request(options, function(res1) {
										  res1.setEncoding('utf8');
		 								  res1.on('data', function(chunk) {
										    console.log("BODY : ", JSON.parse(chunk));
										    response.push(
										    	{
									                name:(JSON.parse(chunk)).meter_name.name, 
									                value: new Array((JSON.parse(chunk)).result_list[0].time,parseFloat((JSON.parse(chunk)).result_list[0].value)),
									                widget:"",
									                dashboard:""
									            });
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
									callback();	
								}
							)
						},
						function (err, n) {	
							console.log("returning");
							console.log(JSON.stringify(response));
							//res.setEncoding('UTF-8')
							res.set('Content-Type', 'text/JSON');
							res.send(response);
						})
				}	
			});
	})

}

	//Following to be deleted
	/*app.post('/savedashboard/:entityname/:tags', function(req, res, next) {
    });*/	