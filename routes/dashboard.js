
module.exports = function(app) {

	app.get('/getdashboards/', function(req, res, next) {
		res.redirect("/dashboard/templates/");
	});

	app.get('/dashboard/metrics/:appname', function(req, res, next) {
		var metric = app.get('metric');
		var condition = {name:req.params.appname};
		var fields = {};
		condition.where ={};  
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
		attributes = {appname:req.body.widgets, metrics: req.body.metrics}; 
		console.log("template is "+JSON.stringify(attributes));
		
		metric.save(attributes,function(err,result){ 
			if(err){
			console.log(err+"error");
				next(err);}
			else {
				res.send(result);
			}
		});
	});

	app.post('/updatedashboard/', function(req, res, next) {
    	res.redirect(307,'/dashboard/templatesave/');
	});

	app.post('/dashboard/updatemetrics/', function(req, res, next) {
		console.log("inside update metrics");
		var metric = app.get('metric');
		var condition = {};
		condition = {appname:req.body.widgets};		
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

	
}