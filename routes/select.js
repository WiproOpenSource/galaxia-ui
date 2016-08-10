module.exports = function(app){
	app.post("/savedb/:val", function (req, res, next) {
		var selectwidget = app.get('selectwidget');
		console.log(selectwidget);
		console.log("Checkboxdata"+req.body);
		console.log("Checkboxdata"+req.body);
		
			var selecteditems = {};
			//var selecteditems = req.body.select;
			var condition={};
			condition = {selected: req.params.val};console.log("Condition"+JSON.stringify(condition));
			//condition = {value: req.params.val};console.log("Condition"+JSON.stringify(condition));
			var attributes = {};
//attributes = {value: req.params.val}; console.log("VAL "+JSON.stringify(attributes));
			attributes = {checkboxLabel: req.body}; console.log("VAL "+JSON.stringify(attributes));
			selectwidget.update(condition,attributes,function(err,result){ 
			if(err)
				next(err);
			else {
				res.send(result);
				console.log(result);
			}
		});
	});
	

	app.get("/getCheckbox",function(req,res,next){
		var selectwidget = app.get('widget');
		console.log(selectwidget);
		var condition = {};
		var fields = {};
		condition.where ={};  
		
		fields = 
				{'_id':0};

				selectwidget.find(condition,fields,null,function(err,result){ 
				
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
	
	
	app.get("/getTiles",function(req,res,next){
		var selectwidget = app.get('selectwidget');
		var condition = {};
		var fields = {};
		condition.where = {};
		fields = {'_id':0,'checkboxLabel.name':1,'checkboxLabel.templateUrl':1,'checkboxLabel.row':1,'checkboxLabel.column':1};
		selectwidget.find(condition,fields,null,function(err,result){ 
				
				if(err)
					console.log("Error is : " +  err);
				else{
					var results = [];
					for(i in result){						
				    	results.push(result[i].instance);
				    }
					res.send(results);	
						console.log("tiles"+JSON.stringify(results));
					}
				});
	});
	}