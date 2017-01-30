var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var recometricSchema = new mongoose.Schema({
  name:String,
  recometric:Array
   })
   
var recometric = mongoose.model("recometric",recometricSchema);

module.exports = function(app) {
app.get('/getnodes/:node_type', function(req, res, next) {
	var node_type = req.params.node_type;
	var request = require('request');
	var config = require('config');
	console.log(node_type);
	var options = {
		url: "http://"+config.server.dashboard_server_ip+":"+config.server.dashboard_server_port+'/v1/catalogue?unit_type='+node_type,
		method: 'GET',
		accept:'application/json'
	};
	request.get(options, function(error,response,body){
		console.log(body);
		res.send(body);
	}).on("error", function(e){
		console.log("Got error: " + e.message);
		next(e); 
	});
	});	

app.get('/getmetrics/:node_type', function(req, res, next) {
	var node_type = req.params.node_type;
	var http = require('http');
	var config = require('config');

	console.log(node_type);

	var options = {
		hostname: config.dashboard_server_ip,
		port: config.dashboard_server_port,
		method: 'GET',
		path: '/v1/metrics?unit_type='+node_type+'&sub_type=docker'
	};

	http.get(options, function(response){
		response.setEncoding('utf8');
		response.on('data', function (data) {
			var i=0;
			var mod_response=[];
			for(var key in data){
				var obj={};                                                                                                                                                                                                                                           //console.log(Object.keys(response)[i]);
				obj.name = Object.keys(data)[i];                      
				obj.description = data[Object.keys(data)[i]];
				mod_response.push(obj);
				i=i+1;
			}
			console.log(mod_response);
			res.send(mod_response);
		});

		}).on("error", function(e){
			console.log("Got error: " + e.message);
		});
});

app.get('/search/:node_type/:input_value', function(req, res, next) {
var node_type = req.params.node_type;
var input_value = req.params.input_value;
var request = require('request');
var config = require('config');

console.log(node_type+"***"+input_value);

var options = {
	method: 'GET',
	url: "http://"+config.dashboard_server_ip+":"+config.dashboard_server_port+'/v1/catalogue?unit_type='+node_type+'&search_type=name&search_string='+input_value,
    accept:'application/json'
};
console.log("Options",JSON.stringify(options));

	request.get(options, function(error,response,body){
		console.log(body);
		res.send(body);
	}).on("error", function(e){
		next(e); 
	});

});

	app.get('/getModalData/:meter_name/:val',function(req,res,next){
	var meter_name = req.params.meter_name;
	var val = req.params.val;
	//val = "app";
	console.log(val)
	var request = require('request');
	var config = require('config');
	var options = {
			url: "http://"+config.server.dashboard_server_ip+":"+config.server.dashboard_server_port+'/v1/label?meter_name='+meter_name+'&unit_type='+val,
			method: 'GET',
			accept:'application/json'
	};
	console.log(options.url);
	request.get(options, function(error,response,body){
		console.log(body);
		res.send(body);
	}).on("error", function(e){
		console.log("Got error: " + e.message);
		next(e); 
	});
	});

app.get('/getmetrics/:unitType/:subType',function(req,res,next){
var unit_type = req.params.unitType;
var sub_type = req.params.subType;
var request = require('request');
var config = require('config');
console.log(unit_type,sub_type);
var options = {
	url: "http://"+config.server.dashboard_server_ip+":"+config.server.dashboard_server_port+'/v1/metrics?unit_type='+unit_type+'&sub_type='+sub_type,
	method: 'GET',
	accept:'application/json'
};
console.log(options.url)
		require("request").get(options, function(error,response,body){
			var i=0;
			var mod_response=[];
			var data = JSON.parse(body)
			for(var key in data){
				var obj={};                                                                                                                                                                                                                                           //console.log(Object.keys(response)[i]);
				obj.name = Object.keys(data)[i];                      
				obj.description = data[Object.keys(data)[i]];
				mod_response.push(obj);
				i=i+1;
			}
			console.log(mod_response);
			res.send(mod_response);		 	
		}).on("error", function(e){
		 	console.log("Got error: " + e.message);
		 	next(e);			
		});

});	


app.get('/getAppInstances/:unitType/:appType',function(req,res,next){
var unit_type = req.params.unitType;
var app_type = req.params.appType;
var request = require('request');
var config = require("config")

var options = {
	url: "http://"+config.server.dashboard_server_ip+":"+config.server.dashboard_server_port+'/v1/catalogue?unit_type='+unit_type+'&sub_type='+app_type,
	method: 'GET',
	accept:'application/json'
};
console.log(options.url)
	request.get(options, function(error,response,body){
	console.log(body);
	res.send(body);
}).on("error", function(e){
	console.log("Got error: " + e.message);
	next(e); 
});

});

app.get('/getrecmetrics/:app',function(req,res,next){
	console.log("inside recometrics");
	var app_type = req.params.app;
	var fields = {};
	var condition={};
	var i=0;
	var mod_response=[];
	condition.where = {"name":{$eq:app_type}};
	fields ={'_id':0};
	console.log(app_type);
	console.log("condition"+JSON.stringify(condition));
		recometric.find(condition.where,fields,function(err,result){ 
					if(err)
						console.log("Error is : " +  err);
					else{

							var jsonResult = JSON.parse(JSON.stringify(result))
							console.log("abcd",jsonResult);	
							console.log("abcd",jsonResult);
					res.send(jsonResult);
				}
					});
				
				});
}

