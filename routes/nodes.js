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

		var options = {
		  hostname: config.dashboard_server_ip,
		  port: config.dashboard_server_port,
		  path: '/v1/catalogue?unit_type=container',
		  method: 'GET',
		  accept:'application/json'
		};

		http.get(options, function(response){
			response.setEncoding('utf8');
			var str="";
			response.on('data', function (data) {
				str += data;
				res.send(str);
			});
			
		}).on("error", function(e){
			console.log("Got error: " + e.message);
		});		
	});

	app.get('/getmetrics/:node_type', function(req, res, next) {
		var node_type = req.params.node_type;
		var http = require('http');
		var config = require('config');

		var options = {
				hostname: config.dashboard_server_ip,
				port: config.dashboard_server_port,
				method: 'GET',
				path: '/v1/metrics?type=container'
		};

		http.get(options, function(response){
			response.setEncoding('utf8');
			var str="";
			response.on('data', function (data) {
				str += data;
				res.send(str);
			});
			
		}).on("error", function(e){
			console.log("Got error: " + e.message);
		});
	});
}