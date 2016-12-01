module.exports = function(app) {
	app.get('/dashboard/templates/', function(req, res, next) {
		var dashboard = app.get('dashboard');
		var condition = {};
		var fields = {};
		condition.where ={};  
		fields = 
			{'_id':0,'templatename':1};

			dashboard.find(condition,fields,null,function(err,result){ 
				if(err)
					console.log("Error is : " +  err);
				else{
					var results = [];
					console.log("BBBB "+JSON.stringify(result));
					for(i in result){						
				    	results.push(result[i]);
				    }
					res.send(results);								
				}
			});
	});		
	app.get('/dashboard/templatedetails/:templatename', function(req, res, next) {
		var dashboard = app.get('dashboard');
		var templatename = req.params.templatename;
		var condition = {};
		var fields = {};
		condition.where ={"templatename":{$eq:templatename}};  
		fields = 
					{'_id':0,'widgets':1};
		console.log("condition "+JSON.stringify(condition));			
		dashboard.find(condition,fields,null,function(err,result){ 
			if(err)
				console.log("Error is : " +  err);
			else{
				var dbmaster = app.get("dbmaster");
				var widget;
				var wids = result[0].widgets; 
				console.log("wids",result[0].widgets);
				var result_modified = [];
				condition.where={};
					condition.where = {"Title":{$in:wids}}; console.log("cccccc "+ JSON.stringify(condition));	
					fields = {'_id':0};
					dbmaster.find(condition,fields,null,function(err,reslt){
							if(err)
								console.log("Error is : " +  err);
							else {
								console.log(" result "," ",JSON.stringify(reslt[0]));
								var x=JSON.parse(JSON.stringify(reslt));
								for (m in x)
									result_modified.push({"Title":x[m].Title,"ChartType":x[m].ChartType,"Controls":x[m].Controls,"Multi_Axis":x[m].Multi_Axis})	;
									res.send(result_modified);																
							}
					})
			}
		});
	});
	//following API for modifying existing template	
	app.post('/dashboard/templatesave/', [function(req, res, next) {
		var dashboard = app.get('dashboard');
		var condition = {};
		condition = {templatename:req.body.templatename};
		var attributes = {}
		attributes = {widgets: req.body.widgets}; //console.log("widgets "+attributes);
		
		console.log("condition "+JSON.stringify(condition));

		dashboard.update(condition,attributes,function(err,result){ 
			if(err)
				next(err);
			else {
				next();
			}
		});
	},function(req, res, next) {res.redirect(307,'/dashboard/updatemetrics/')}]);
	
	app.post('/dashboard/templatecreate/', [function(req, res, next) {
		console.log("inside create");
		var dashboard = app.get('dashboard');
		var attributes = {}
		attributes = {templatename:req.body.templatename, widgets: req.body.widgets}; 
		//console.log("condition "+JSON.stringify(attributes));
		dashboard.save(attributes,function(err,result){ 
			if(err){
				console.log(err+"error");
				next(err);
			}
			else {
				console.log(result)
				next();
			}
		});
	},function(req, res, next) {res.redirect(307,'/dashboard/createmetrics/')}]);
		
	app.delete('/dashboard/remove/:templatename', function(req, res, next) {
		var dashboard = app.get('dashboard');
		var templatename = req.params.templatename;
		var condition = {};
		var fields = {};
		condition.where ={"templatename":{$eq:templatename}};  

		dashboard.delete(condition,fields,null,function(err,result){ 
			if(err)
				console.log("Error is : " +  err);
			else{
				res.send(result);
			}
		});
	});			
	app.get('/dashboard/chartdata/:chartlabel', function(req, res, next) {
	});	
	
	function getwidgetslist(searchexpression){
	}
	function getmodelname(label){
		switch(label) {
 	  	    case "ASN":
        		return "asn";
            	break;
		    case "Purchase Orders":
		        return "po";
		        break;
		    case "Replenishment":
		        return "repltask";
		        break;
		    case "Putaway":
		        return "puttask";
		        break;
		    case "Wave":
		        return "picktask";
		        break;
		    case "Perfect Shipments":
		        return "order";
		        break;
		    case "Order":
		    case "Units Shipped":
		        return "order";
		        break;
		    case "Pick Rate":
		        return "picktask";
		        break;		        
		    case "Put":
		        return "puttask";
		        break;								
		}
	}
	function getcondition(label){
		switch(label) {
		    case "Perfect Shipments":
		    case "Units Shipped":
		        return {'Order_line.Order_Line_Modified':{$eq:new Date(2016,1,24)}};
		        break;
		    default:
  		        return {};
		        break;
		}
	}
	function getchartfields(label){
		switch(label) {
		    case "Wave":
		        return {'_id':0,'Wave_Number':1, 'End_Date':1, 'Pick_Quantity':1, 'Ord_Quantity':1};
		        break;
		    case "Perfect Shipments":
		    case "Units Shipped":
		        return {'_id':0,'Order_line.Shipped_Qty':1, 'Order_line.Ordered_QTY':1, 'Order_line.Order_Line_Modified':1};
		        break;
		    case "Pick Rate":
		        return {'_id':0,'Pick_Quantity':1, 'Ord_Quantity':1, 'Pick_Type':1};
		        break;		        		        
		    default:
  		        return {'_id':0,'Status':1};
		        break;
		}
	}
}
		
