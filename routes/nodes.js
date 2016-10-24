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
										obj.container = Object.keys(data)[i];                      
										obj.host = data[Object.keys(data)[i]];
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
	
	app.get('/getModalData',function(req,res,next){
		var data = [{
						"labels": [{
							"label": [{
								"job": "prometheus"
							}, {
								"id": "/user/107.user/c1.session"
							}, {
								"instance": "localhost:8090"
							}]
						}, {
							"label": [{
								"name": "nodeexporter"
							}, {
								"image": "prom/node-exporter"
							}, {
								"instance": "localhost:8090"
							}, {
								"job": "prometheus"
							}, {
								"id": "/docker/b1327ea5dddff97e471d49c55cb3f81484c4b58e0a604223897d368687b87901"
							}]
						}, {
							"label": [{
								"job": "prometheus"
							}, {
								"id": "/docker"
							}, {
								"instance": "localhost:8090"
							}]
						}, {
							"label": [{
								"job": "prometheus"
							}, {
								"id": "/user/107.user"
							}, {
								"instance": "localhost:8090"
							}]
						}, {
							"label": [{
								"job": "prometheus"
							}, {
								"id": "/"
							}, {
								"instance": "localhost:8090"
							}]
						}, {
							"label": [{
								"name": "cadvisor"
							}, {
								"image": "google/cadvisor"
							}, {
								"instance": "localhost:8090"
							}, {
								"job": "prometheus"
							}, {
								"id": "/docker/29693f5fd84e123db2f5d4a048dad72fd57d22403307cc30b4f3d3dcb501e10e"
							}]
						}, {
							"label": [{
								"job": "prometheus"
							}, {
								"id": "/user"
							}, {
								"instance": "localhost:8090"
							}]
						}, {
							"label": [{
								"job": "prometheus"
							}, {
								"id": "/user/1000.user"
							}, {
								"instance": "localhost:8090"
							}]
						}, {
							"label": [{
								"name": "cranky_visvesvaraya"
							}, {
								"image": "httpd"
							}, {
								"instance": "localhost:8090"
							}, {
								"job": "prometheus"
							}, {
								"id": "/docker/f68e4a12fa934015ca07e5e9536fcc733770fbd335d18d6ea59170c3e6ac042b"
							}]
						}, {
							"label": [{
								"name": "prickly_morse"
							}, {
								"image": "httpd"
							}, {
								"instance": "localhost:8090"
							}, {
								"job": "prometheus"
							}, {
								"id": "/docker/fc88693dcbbc2c2723bea3da7d908140331b9e1a15008e6b5c3e3af438e53a51"
							}]
						}, {
							"label": [{
								"job": "prometheus"
							}, {
								"id": "/user/1000.user/2.session"
							}, {
								"instance": "localhost:8090"
							}]
						}],
						"name": "container_cpu_system_seconds_total"
					}];
				   
									res.send(data);
						});
}
