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
						//var str =  {"172.31.0.14": "ip-172-31-0-14", "localhost": "ip-172-31-0-121"};
						/*var str =  {
									"k8s_etcd.3fb15602_kube-dns-v11-zwz6y_kube-system_dd7add3d-17f8-11e6-a1eb-0e852ea56ce5_89dcdf60": "172.31.0.14",
									"k8s_heapster-nanny.65c6cac7_heapster-v1.1.0.beta1-3062717326-uefmo_kube-system_e0bbf1eb-17f8-11e6-a1eb-0e852ea56ce5_87a15d36": "172.31.0.14",
									"sharp_goodall": "172.31.0.14",
									"k8s_POD.55c42327_monitoring-influxdb-grafana-v3-xg6k1_kube-system_dfc609e3-17f8-11e6-a1eb-0e852ea56ce5_487c1f96": "172.31.0.14",
									"k8s_kube2sky.da023ba0_kube-dns-v11-zwz6y_kube-system_dd7add3d-17f8-11e6-a1eb-0e852ea56ce5_60b655e0": "172.31.0.14",
									"k8s_influxdb.fde24082_monitoring-influxdb-grafana-v3-xg6k1_kube-system_dfc609e3-17f8-11e6-a1eb-0e852ea56ce5_d511991e": "172.31.0.14",
									"k8s_POD.5699264e_kube-dns-v11-zwz6y_kube-system_dd7add3d-17f8-11e6-a1eb-0e852ea56ce5_b52ffefe": "172.31.0.14",
									"k8s_eventer-nanny.52d3caf2_heapster-v1.1.0.beta1-3062717326-uefmo_kube-system_e0bbf1eb-17f8-11e6-a1eb-0e852ea56ce5_7263c46b": "172.31.0.14",
									"k8s_kube-ui.b23e855f_kube-ui-v1-axdiz_kube-system_db6df2f1-17f8-11e6-a1eb-0e852ea56ce5_849a7db7": "172.31.0.14",
									"k8s_skydns.c0d57bbc_kube-dns-v11-zwz6y_kube-system_dd7add3d-17f8-11e6-a1eb-0e852ea56ce5_a6184659": "172.31.0.14",
									"k8s_grafana.6ffdba97_monitoring-influxdb-grafana-v3-xg6k1_kube-system_dfc609e3-17f8-11e6-a1eb-0e852ea56ce5_4cf02e04": "172.31.0.14",
									"k8s_heapster.eb140484_heapster-v1.1.0.beta1-3062717326-uefmo_kube-system_e0bbf1eb-17f8-11e6-a1eb-0e852ea56ce5_94c65ab4": "172.31.0.14",
									"k8s_eventer.e48f5de_heapster-v1.1.0.beta1-3062717326-uefmo_kube-system_e0bbf1eb-17f8-11e6-a1eb-0e852ea56ce5_e86c0cf6": "172.31.0.14",
									"k8s_POD.364e00d5_kube-ui-v1-axdiz_kube-system_db6df2f1-17f8-11e6-a1eb-0e852ea56ce5_f14d24fa": "172.31.0.14",
									"k8s_POD.6059dfa2_heapster-v1.1.0.beta1-3062717326-uefmo_kube-system_e0bbf1eb-17f8-11e6-a1eb-0e852ea56ce5_466814ca": "172.31.0.14"
						};*/
		 			http.get(options, function(response){
						response.setEncoding('utf8');
						//var str="";
						response.on('data', function (data) {
							//str += data;
								var i=0;
								var mod_response=[];
								for(var key in data){
									var obj={};									//console.log(Object.keys(str)[i]);
									obj.container = Object.keys(data)[i];		//console.log(str[Object.keys(str)[i]]);
									obj.host = data[Object.keys(data)[i]];
									mod_response.push(obj);
									i=i+1;
								}
								console.log(mod_response);
								res.send(mod_response);
								//res.send(str);
						});
						}).on("error", function(e){
							console.log("Got error: " + e.message);
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
				path: '/v1/metrics?type='+node_type
		};
				/*var response = {
					'container_memory_usage_bytes':'This includes all the memory regardless of when it was accessed',
					'container_fs_writes_total':'Cumulative counts of writes completed',
					'container_cpu_system_seconds_total':'Net CPU for all the cores',
					'container_cpu_usage_seconds_total':'CPU usage by each core'
				};*/
		http.get(options, function(response){
			response.setEncoding('utf8');
			//var str="";
			response.on('data', function (data) {
				//str += data;
				var i=0;
				var mod_response=[];
				for(var key in data){
					var obj={};															//console.log(Object.keys(response)[i]);
					obj.container = Object.keys(data)[i];		//console.log(response[Object.keys(response)[i]]);
					obj.host = data[Object.keys(data)[i]];
					mod_response.push(obj);
					i=i+1;
				}
				console.log(mod_response);
				res.send(mod_response);
				//res.send(str);
			});

		}).on("error", function(e){
			console.log("Got error: " + e.message);
		});
	});
	app.get('/search/:input_value', function(req, res, next) {
		//var node_type = req.params.node_type;
		var input_value = req.params.input_value;
		var http = require('http');
		var config = require('config');

		console.log(input_value);

		var options = {
				hostname: config.dashboard_server_ip,
				port: config.dashboard_server_port,
				method: 'GET',
				path: '/v1/metrics?type=container'+input_value
		};
				/*var response = {
					'container_memory_usage_bytes':'This includes all the memory regardless of when it was accessed',
					'container_fs_writes_total':'Cumulative counts of writes completed',
					'container_cpu_system_seconds_total':'Net CPU for all the cores',
					'container_cpu_usage_seconds_total':'CPU usage by each core'
				};*/
		http.get(options, function(response){
			response.setEncoding('utf8');
			//var str="";
			response.on('data', function (data) {
				//str += data;
				var i=0;
				var mod_response=[];
				for(var key in data){
					var obj={};															//console.log(Object.keys(response)[i]);
					obj.container = Object.keys(data)[i];		//console.log(response[Object.keys(response)[i]]);
					obj.host = data[Object.keys(data)[i]];
					mod_response.push(obj);
					i=i+1;
				}
				console.log(mod_response);
				res.send(mod_response);
				//res.send(str);
			});

		}).on("error", function(e){
			console.log("Got error: " + e.message);
		});
	});
}
