module.exports = function(app) {
	app.get('/retrieveblueprint',function(req,res,next){
		var bp = app.get('blueprint');
		//output array of bluprints json
		var condition = {};
		var fields = {};
		condition.where = {};
		fields = 
					{'_id':0};
		console.log("condition "+JSON.stringify(condition));			
		bp.find(condition,fields,null,function(err,result){ 
				if(err)
					console.log("Error is : " +  err);
				else{
					res.send(result);	
					console.log("blueprint "+JSON.stringify(result));
				}
			});
	});

	app.post('/savebundle',function(req,res,next){
		//input applicationbundle.json
		var appbundle = app.get('appbundle');
		var bundledata = req.body;
		var condition = {'projectName':bundledata.projectName};
		var attributes = bundledata;
		console.log("condition "+JSON.stringify(condition));
		console.log("attributes" + JSON.stringify(attributes));
			appbundle.update(condition,attributes,function(err,result){
						console.log("updated",result);
						res.send("success");
					});
					//console.log("appbundle "+JSON.stringify(result));
	
			});
	
	app.post('/deploymentprofile',function(req,res,next){
		//input applicationbundle.json
		var dp = app.get('deploymentprofile');
		var dpdata = req.body;
		var condition = {};
		var attributes = dpdata;
		var fields ={};
		condition = {'id':dpdata.id};
		fields = {'_id':0};
		console.log("condition "+JSON.stringify(condition));
		console.log("attributes" + JSON.stringify(attributes));

						console.log("updating",condition, attributes);
						dp.update(condition,attributes, function(err, result){
								console.log("updated",err, result);
								res.send("success");
						});
	});
	
	app.get('/retrieve/:project_id',function(req,res,next){
		//output applicationbundle
		var appbundle = app.get('appbundle');
		var project_id = req.params.project_id;
		var condition = {};
		var fields = {};
		condition.where = {"projectName":{$eq:project_id}};
		fields = 
					{'_id':0};
		console.log("condition"+JSON.stringify(condition));
		appbundle.find(condition,fields,null,function(err,result){
			if(err)
					console.log("Error is : " +  err);
				else{
					res.send(result);	
					console.log("blueprint "+JSON.stringify(result));
				}
		})
	});
	

}