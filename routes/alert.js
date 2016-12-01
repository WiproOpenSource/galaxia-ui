module.exports = function(app){
	app.get('/alerts',function(req,res,next){
	var alert = app.get('alert');
	var condition = {};
	var fields = {};
	condition.where ={};  
	
		fields = {'_id':0};
		alert.find(condition,fields,null,function(err,result){ 
				
				if(err)
					console.log("Error is : " +  err);
				else{
					var results = [];
					for(i in result){						
				    	results.push(result[i].instance);
				    }
					res.send(results);	
						console.log("fdgm"+JSON.stringify(results));
					}
				});

});
}