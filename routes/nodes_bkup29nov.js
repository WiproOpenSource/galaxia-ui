/*
# Copyright 2016 - Wipro Limited
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
*/

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

	app.get('/getapp/:sub_type', function(req, res, next) {
		var sub_type = "postgres";//req.params.sub_type;
		var request = require('request');
		var config = require('config');
		console.log("sub_type of application is "+sub_type);
		var options = {
		  url: "http://"+config.server.dashboard_server_ip+":"+config.server.dashboard_server_port+'/v1/catalogue?unit_type=app&sub_type='+sub_type,
		  method: 'GET',
		  accept:'application/json'
		};
		request.get(options, function(error,response,body){
		 	//console.log(body);
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
		if (node_type == "node") sub_type = "node" 
		if (node_type == "container") sub_type = "docker" 
		if (node_type == "app") sub_type = "postgres" 			
		console.log(node_type);

		var options = {
		  url: "http://"+config.server.dashboard_server_ip+":"+config.server.dashboard_server_port+'/v1/metrics?unit_type='+node_type+'&sub_type='+sub_type,
		  method: 'GET',
		  accept:'application/json'
		};
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
			//console.log("Got error: " + e.message);
			next(e);			
		});

	});
	
	app.get('/getModalData/:meter_name/:val',function(req,res,next){
	var meter_name = req.params.meter_name;
	var val = req.params.val;
	var request = require('request');
	var options = {
		url: "http://"+config.server.dashboard_server_ip+":"+config.server.dashboard_server_port+'/v1/label?meter_name='+meter_name+'&unit_type='+val,
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
}
