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
	/*request.get(options, function(error,response,body){
		console.log(body);
		res.send(body);
	}).on("error", function(e){
		console.log("Got error: " + e.message);
		next(e); 
	});*/
	if(node_type == "node"){
		res.send('[{"sysname": "Linux", "nodename": "ip-172-31-28-27", "domainname": "(none)", "host": "52.91.74.101", "machine": "x86_64", "instance": "52.91.74.101:9100", "job": "prometheus", "version": "#152-Ubuntu SMP Fri Dec 2 15:37:11 UTC 2016", "instance_key": "nodeexporter001", "release": "3.13.0-105-generic"}, {"sysname": "Linux", "nodename": "ip-172-31-24-229", "domainname": "(none)", "host": "54.163.100.167", "machine": "x86_64", "instance": "54.163.100.167:9100", "job": "prometheus", "version": "#152-Ubuntu SMP Fri Dec 2 15:37:11 UTC 2016", "instance_key": "nodeexporter001", "release": "3.13.0-105-generic"}]'); 
	}else if(node_type =="container"){
		res.send('[{"Image":"uifd/ui-for-docker","Host": "172.31.0.14","Name": "trusting_mcclintock","Id": "/docker/8248e7ed28d3a352b4d2056527ae7b874ea8e9ef1041c08cf41b61f4b9555b7d"}]');
	}
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
		/*	body = {"labels": [{"label": [{"job": "prometheus"}, {"id": "/user/107.user/c1.session"},{"instance": "localhost:8090"}]}, {
			"label": [{"name": "nodeexporter"}, {"image": "prom/node-exporter"}, {"instance": "localhost:8090"}, {"job": "prometheus"
			}, {"id": "/docker/b1327ea5dddff97e471d49c55cb3f81484c4b58e0a604223897d368687b87901"}]}],"name": "container_cpu_system_seconds_total"};*/
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
		
	//	res.send('[{"metric1":"jngbfgnhmdhgln"},{"metric2":"gnjbfgnsfbnfgbnkf"},{"metric3":"jnbjdfbvsbhjbvebvw"}]');
});	

/*app.get('/getrecommendedmetrics/:unitType/:subType',function(req,res,next){
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
		});*/
		
		//res.send('[{"metric4":"jngbfgnhmdhgln"},{"metric5":"gnjbfgnsfbnfgbnkf"},{"metric6":"jnbjdfbvsbhjbvebvw"}]');
//});	



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
	/*request.get(options, function(error,response,body){
	console.log(body);
	res.send(body);
}).on("error", function(e){
	console.log("Got error: " + e.message);
	next(e); 
});*/
	res.send('[{"job": "prometheus", "instance_key": "postgres001", "instance": "54.89.230.166"},{"job": "prometheus1", "instance_key": "postgres0012", "instance": "54.89.230.167"}]');
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
						
						//for(obj in result){
							
							
							//var jsonResult = JSON.parse(JSON.stringify(result[obj]))["metrics"][obj]
							//var jsonResult = JSON.parse(JSON.stringify(result[obj]))
							var jsonResult = JSON.parse(JSON.stringify(result))
							console.log("abcd",jsonResult);
						/*	for(var key in jsonResult){
							var obj={};                                                                                                                                                                                                                                           //console.log(Object.keys(response)[i]);
							obj.name = Object.keys(jsonResult)[i];           
							//obj.description = jsonResult[Object.keys(jsonResult)[i]];
							mod_response.push(obj);
							i=i+1;
							}
							console.log("mod_response "+JSON.stringify(mod_response));*/
							
						//}
						
					res.send(jsonResult);
				}
					});
				
				});


}

