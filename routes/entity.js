
module.exports = function(app) {

	app.get('/entities/', function(req, res, next) {
		var entity = app.get('entity');
		var condition = {};
		var fields = {};
		fields = {'_id':0};
		entity.find(condition,fields,null,function(err,result){ 
			if(err){
				console.log("Error is : " +  err);
				next (err);
			}
			else{
				var results = [];
				for(i in result) results.push(result[i]);
			    res.send(results);								
			}
		});		
	});

	app.get('/entities/:id', function(req, res, next) {
		var entity = app.get('entity');
		var condition = {};
		var fields = {};
		condition.where = {id: req.params.id};

		fields = {'_id':0};

		entity.find(condition,fields,null,function(err,result){ 
			if(err){
				console.log("Error is : " +  err);
				next (err);
			}
			else{
				var results = [];
				for(i in result) results.push(result[i]);
			    res.send(results);								
			}
		});		
	});

	app.get('/entities/type/:type', function(req, res, next) {
		var entity = app.get('entity');
		var condition = {};
		var fields = {};
		condition.where = {type: req.params.type};

		fields = {'_id':0};

		entity.find(condition,fields,null,function(err,result){ 
			if(err){
				console.log("Error is : " +  err);
				next (err);
			}
			else{
				var results = [];
				for(i in result) results.push(result[i]);
			    res.send(results);								
			}
		});				
	});

	app.post('/saveentity/', function(req, res, next) {
		var entity = app.get('entity');
		var attributes = {}
		attributes = {	name: req.body.name, id:req.body.id, type:req.body.type, 
						ipaddress:req.body.ipaddress, port: req.body.port}; 
		entity.save(attributes,function(err,result){ 
			if(err){
				console.log(err+"error");
				next(err);
			}
			else {
				res.send(result);
			}
		});	
	});

	app.post('/updateentity/', function(req, res, next) {
		var entity = app.get('entity');
		var condition = {};
		condition = {type:{$eq:req.body.id}};		
		var attributes = {};
		attributes = {	name: req.body.name, id:req.body.id, type:req.body.type, 
						ipaddress:req.body.ipaddress, port: req.body.port}; 
		console.log("template is "+JSON.stringify(attributes));
		
		entity.update(condition,attributes,function(err,result){ 
			if(err){
				console.log(err+"error");
				next(err);}
			else {
				res.send(result);
			}
		});

	});

	app.delete('/deleteentity/:id', function(req, res, next) {
		var entity = app.get('entity');
		var condition = {};
		var fields = {};
		condition.where ={"id":{$eq:req.params.id}};  

		entity.delete(condition,fields,null,function(err,result){ 
			if(err)
				console.log("Error is : " +  err);
			else{
				res.send(result);
			}
		});		
	});
}