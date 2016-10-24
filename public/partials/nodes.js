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
		var http = require('http');
		var config = require('config');
		console.log(node_type);
		var options = {
		  hostname: config.dashboard_server_ip,
		  port: config.dashboard_server_port,
		  path: '/v1/catalogue?unit_type='+node_type,
		  method: 'GET',
		  accept:'application/json'
		};
		/* http.get(options, function(response){
			response.setEncoding('utf8');
			var str="";
			response.on('data', function (data) {
				str += data;
				res.send(str);
			});

		}).on("error", function(e){
			console.log("Got error: " + e.message);
		});
		*/
		var response = {
							'container A':1,
							'container B':2,
							'container C':3,
							'container D':4
							};
		var i=0;
		var mod_response=[];
		for(var key in response){
			var obj={};
			console.log(Object.keys(response)[i]); obj.container = Object.keys(response)[i];
			console.log(response[Object.keys(response)[i]]); obj.host = response[Object.keys(response)[i]];
			mod_response.push(obj);
			i=i+1;
		}
		console.log(mod_response);
		res.send(mod_response);
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
				path: '/v1/metrics?type='+node_type
		};
		var response = {
							'container_memory_usage_bytes':'This includes all the memory regardless of when it was accessed',
							'container_fs_writes_total':'Cumulative counts of writes completed',
							'container_cpu_system_seconds_total':'Net CPU for all the cores',
							'container_cpu_usage_seconds_total':'CPU usage by each core'
							};
		/*http.get(options, function(response){
			response.setEncoding('utf8');
			var str="";
			response.on('data', function (data) {
				str += data;
				res.send(str);
			});

		}).on("error", function(e){
			console.log("Got error: " + e.message);
		});*/
		var i=0;
		var mod_response=[];
		for(var key in response){
			var obj={};
			console.log(Object.keys(response)[i]); obj.container = Object.keys(response)[i];
			console.log(response[Object.keys(response)[i]]); obj.host = response[Object.keys(response)[i]];
			mod_response.push(obj);
			i=i+1;
		}
		console.log(mod_response);
		res.send(mod_response);
	});
}
