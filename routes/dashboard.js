
module.exports = function(app) {
	app.get('/getdashboards/', function(req, res, next) {
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
			else if (result.length > 0){
			var metricscount=0;                
			var resp = [];
			var request = require ('request');
			var config = require('config');
				require("async").whilst(
					function(){
                        if (metricscount < result[0].metrics.length) return true;
					},
                    function(callback){
                    var labelcount = 0;
                        require("async").whilst(
                            function(){
                                if (labelcount < result[0].metrics[metricscount].labels.length) return true;
                            },
                            function(next){
                                var jsonObj2={};
								jsonObj2 ={unit_type:'container',sub_type:'docker'};
								jsonObj2.meter_name = {
									label : result[0].metrics[metricscount].labels[labelcount],
									name  : result[0].metrics[metricscount].name
                                }
								console.log("Request "+JSON.stringify(jsonObj2))
								request("http://"+config.server.dashboard_server_ip+":"+config.server.dashboard_server_port+'/v1/metrics',
									{             
													'method':"POST",               
													'body': JSON.stringify(jsonObj2),
													'headers':{
																	'Content-Type':"application/json"
													}
									},
								function(error,response,body) {
									console.log("Dashboard "+req.params.dashboardname+"\nContainer "+req.params.widget+"\nBODY : ", body);
									var jsonBody = JSON.parse(body);
									if (jsonBody.result_list.length > 0) {
										resp.push({
											"name":jsonBody.meter_name.label,
											"value": {x:jsonBody.result_list[0].time, y:jsonBody.result_list[0].value},
											"widget":req.params.widget,
											"dashboard":req.params.dashboardname
												})
									}
									labelcount++;
									next();
									});
                                },
								function(err,count){
												//callback for inner loop
												metricscount++;              
												callback();           
								}
                                )                                                                               
                                },
								function (err, n) {             
												console.log("returning");
												res.send(resp);
								})
                                }             
        })
    })

	app.get('/dashboard/metrics/:dashboardname', function(req, res, next) {
		var metric = app.get('metric');
		var condition = {};
		condition.where = {templatename:req.params.dashboardname};
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