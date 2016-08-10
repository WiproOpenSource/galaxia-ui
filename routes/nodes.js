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
		  url: "http://"+config.dashboard_server_ip+":"+config.dashboard_server_port+'/v1/catalogue?unit_type='+node_type,
		  method: 'GET',
		  accept:'application/json'
		};
		/*var data = [
						{
							"name": "k8s_etcd.3fb15602_kube-dns-v11-zwz6y_kube-system_dd7add3d-17f8-11e6-a1eb-0e852ea56ce5_89dcdf60",
							"host": "172.31.0.14",
							"image": "abcd1"
						}, {
							"name": "k8s_heapster-nanny.65c6cac7_heapster-v1.1.0.beta1-3062717326-uefmo_kube-system_e0bbf1eb-17f8-11e6-a1eb-0e852ea56ce5_87a15d36",
							"host": "172.31.0.14",
							"image": "abcd2"
						}, {
							"name": "sharp_goodall",
							"host": "172.31.0.14",
							"image": "abcd3"
						}, {
							"name": "k8s_POD.55c42327_monitoring-influxdb-grafana-v3-xg6k1_kube-system_dfc609e3-17f8-11e6-a1eb-0e852ea56ce5_487c1f96",
							"host": "172.31.0.14",
							"image": "abcd4"
						}, {
							"name": "k8s_kube2sky.da023ba0_kube-dns-v11-zwz6y_kube-system_dd7add3d-17f8-11e6-a1eb-0e852ea56ce5_60b655e0",
							"host": "172.31.0.14",
							"image": "abcd5"
						}, {
							"name": "k8s_influxdb.fde24082_monitoring-influxdb-grafana-v3-xg6k1_kube-system_dfc609e3-17f8-11e6-a1eb-0e852ea56ce5_d511991e",
							"host": "172.31.0.14",
							"image": "abcd6"
						}, {
							"name": "k8s_POD.5699264e_kube-dns-v11-zwz6y_kube-system_dd7add3d-17f8-11e6-a1eb-0e852ea56ce5_b52ffefe",
							"host": "172.31.0.14",
							"image": "abcd7"
						}, {
							"name": "k8s_eventer-nanny.52d3caf2_heapster-v1.1.0.beta1-3062717326-uefmo_kube-system_e0bbf1eb-17f8-11e6-a1eb-0e852ea56ce5_7263c46b",
							"host": "172.31.0.14",
							"image": "abcd8"
						}, {
							"name": "k8s_kube-ui.b23e855f_kube-ui-v1-axdiz_kube-system_db6df2f1-17f8-11e6-a1eb-0e852ea56ce5_849a7db7",
							"host": "172.31.0.14",
							"image": "abcd9"
						}, {
							"name": "k8s_skydns.c0d57bbc_kube-dns-v11-zwz6y_kube-system_dd7add3d-17f8-11e6-a1eb-0e852ea56ce5_a6184659",
							"host": "172.31.0.14",
							"image": "abcd10"
						}, {
							"name": "k8s_grafana.6ffdba97_monitoring-influxdb-grafana-v3-xg6k1_kube-system_dfc609e3-17f8-11e6-a1eb-0e852ea56ce5_4cf02e04",
							"host": "172.31.0.14",
							"image": "abcd11"
						}, {
							"name": "k8s_heapster.eb140484_heapster-v1.1.0.beta1-3062717326-uefmo_kube-system_e0bbf1eb-17f8-11e6-a1eb-0e852ea56ce5_94c65ab4",
							"host": "172.31.0.14",
							"image": "abcd12"
						}, {
							"name": "k8s_eventer.e48f5de_heapster-v1.1.0.beta1-3062717326-uefmo_kube-system_e0bbf1eb-17f8-11e6-a1eb-0e852ea56ce5_e86c0cf6",
							"host": "172.31.0.14",
							"image": "abcd13"
						}, {
							"name": "k8s_POD.364e00d5_kube-ui-v1-axdiz_kube-system_db6df2f1-17f8-11e6-a1eb-0e852ea56ce5_f14d24fa",
							"host": "172.31.0.14",
							"image": "abcd14"
						}, {
							"name": "k8s_POD.6059dfa2_heapster-v1.1.0.beta1-3062717326-uefmo_kube-system_e0bbf1eb-17f8-11e6-a1eb-0e852ea56ce5_466814ca",
							"host": "172.31.0.14",
							"image": "abcd15"
						}
					];*/
					var data = [{
		                "Image": "gcr.io/google_containers/kube2sky:1.14",
		                "Host": "172.31.0.14",
		                "Name": "k8s_kube2sky.6a593b55_kube-dns-v11-3e5so_kube-system_0cf9a5e8-31f3-11e6-9704-0e852ea56ce5_b601eb93",
		                "Id": "/docker/09f94c2f71e6fc0bce7bc482a9dcda64faa65d151a539a0f2e47146139a5ad0b"
						}, {
						                "Image": "uifd/ui-for-docker",
						                "Host": "172.31.0.14",
						                "Name": "trusting_mcclintock",
						                "Id": "/docker/8248e7ed28d3a352b4d2056527ae7b874ea8e9ef1041c08cf41b61f4b9555b7d"
						}, {
						                "Image": "gcr.io/google_containers/kube-ui:v1",
						                "Host": "172.31.0.14",
						                "Name": "k8s_kube-ui.cab38514_kube-ui-v1-m4rpd_kube-system_50d7d6ea-3219-11e6-9704-0e852ea56ce5_ae02c3fa",
						                "Id": "/docker/5c62af889aeb9207f15c4dc115b82e50cd887b8eba5effd381536845726db904"
						}, {
						                "Image": "gcr.io/google_containers/pause:2.0",
						                "Host": "172.31.0.14",
						                "Name": "k8s_POD.364e00d5_kube-ui-v1-m4rpd_kube-system_50d7d6ea-3219-11e6-9704-0e852ea56ce5_d82ca17a",
						                "Id": "/docker/4ee33cc9733e2b1ecc1779e1bae7a56b693641feb892eff445a2db485ec9fada"
						}, {
						                "Image": "gcr.io/google_containers/etcd-amd64:2.2.1",
						                "Host": "172.31.0.14",
						                "Name": "k8s_etcd.cff955b7_kube-dns-v11-3e5so_kube-system_0cf9a5e8-31f3-11e6-9704-0e852ea56ce5_342992f2",
						                "Id": "/docker/e12457ef0b5abf612a3a0998e3e087a84be7e1783baebff876618c7303ed924f"
						}, {
						                "Image": "gcr.io/google_containers/pause:2.0",
						                "Host": "172.31.0.14",
						                "Name": "k8s_POD.5699264e_kube-dns-v11-3e5so_kube-system_0cf9a5e8-31f3-11e6-9704-0e852ea56ce5_74f43165",
						                "Id": "/docker/4bf327204f9bea97b41be68dd9b97e91612d127b30466882ee4655ca352d5f69"
						}, {
						                "Image": "gcr.io/google_containers/skydns:2015-10-13-8c72f8c",
						                "Host": "172.31.0.14",
						                "Name": "k8s_skydns.512c7b71_kube-dns-v11-3e5so_kube-system_0cf9a5e8-31f3-11e6-9704-0e852ea56ce5_a03b13ed",
						                "Id": "/docker/59f18abb8f8f30d4d867fe3667a65eb2898f0e82b72d9e1f6ac1a6b9a15ed2a7"
						}];
		res.send(data);

		// request.get(options, function(error,response,body){
		// 	console.log(body);
		// 	res.send(body);
		// }).on("error", function(e){
		// 	//console.log("Got error: " + e.message);
		// 	next(e);			
		// });
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
				/*var response = [{"name":'container_memory_usage_bytes',"description":'This includes all the memory regardless of when it was accessed'},
				{"name":'container_fs_writes_total',"description":'Cumulative counts of writes completed'},
					{"name":'container_cpu_system_seconds_total',"description":'Net CPU for all the cores'},
						{"name":'container_cpu_usage_seconds_total',"description":'CPU usage by each core'
				}];*/
				var response = [{
		                "name": "container_memory_usage_bytes",
		                "description": "This includes all the memory regardless of when it was accessed"
						}, {
						                "name": "container_fs_writes_total",
						                "description": "Cumulative count of writes completed"
						}, {
						                "name": "container_cpu_system_seconds_total",
						                "description": "Net CPU for all the cores"
						}, {
						                "name": "container_cpu_usage_seconds_total",
						                "description": "CPU usage by each core"
						}, {
						                "name": "container_network_receive_errors_total",
						                "description": "Cumulative count of errors encountered while receiving"
						}, {
						                "name": "container_network_transmit_bytes_total",
						                "description": "Cumulative count of bytes transmitted"
						}, {
						                "name": "container_fs_io_current",
						                "description": "Number of I/Os currently in progress"
						}, {
						                "name": "container_fs_reads_total",
						                "description": "Cumulative count of reads completed"
						}, {
						                "name": "container_network_receive_packets_dropped_total",
						                "description": "Cumulative count of packets dropped while receiving"
						}, {
						                "name": "container_memory_working_set_bytes",
						                "description": "This includes recently accessed memory"
						}, {
						                "name": "container_network_transmit_errors_total",
						                "description": "Cumulative count of network errors encountered while transmitting"
						}, {
						                "name": "container_memory_failures_total",
						                "description": "Count of all memory allocation failure"
						}, {
						                "name": "container_network_transmit_packets_total",
						                "description": "Cumulative count of packets transmitted"
						}, {
						                "name": "container_network_receive_packets_total",
						                "description": "Cumulative count of packets received"
						}, {
						                "name": "container_fs_usage_bytes",
						                "description": "Number of bytes that are consumed by the container on this filesystem"
						}, {
						                "name": "container_network_receive_bytes_total",
						                "description": "Cumulative count of bytes received"
						}, {
						                "name": "container_network_transmit_packets_dropped_total",
						                "description": "Cumulative count of packets dropped while transmitting"
						}];
				res.send(response);
		/*http.get(options, function(response){
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
		});*/
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
				/*var data = [{
                "Image": "gcr.io/google_containers/kube2sky:1.14",
                "Host": "172.31.0.14",
                "Name": "k8s_kube2sky.6a593b55_kube-dns-v11-3e5so_kube-system_0cf9a5e8-31f3-11e6-9704-0e852ea56ce5_b601eb93",
                "Id": "/docker/09f94c2f71e6fc0bce7bc482a9dcda64faa65d151a539a0f2e47146139a5ad0b"
}, {
                "Image": "uifd/ui-for-docker",
                "Host": "172.31.0.14",
                "Name": "trusting_mcclintock",
                "Id": "/docker/8248e7ed28d3a352b4d2056527ae7b874ea8e9ef1041c08cf41b61f4b9555b7d"
}, {
                "Image": "gcr.io/google_containers/kube-ui:v1",
                "Host": "172.31.0.14",
                "Name": "k8s_kube-ui.cab38514_kube-ui-v1-m4rpd_kube-system_50d7d6ea-3219-11e6-9704-0e852ea56ce5_ae02c3fa",
                "Id": "/docker/5c62af889aeb9207f15c4dc115b82e50cd887b8eba5effd381536845726db904"
}, {
                "Image": "gcr.io/google_containers/pause:2.0",
                "Host": "172.31.0.14",
                "Name": "k8s_POD.364e00d5_kube-ui-v1-m4rpd_kube-system_50d7d6ea-3219-11e6-9704-0e852ea56ce5_d82ca17a",
                "Id": "/docker/4ee33cc9733e2b1ecc1779e1bae7a56b693641feb892eff445a2db485ec9fada"
}, {
                "Image": "gcr.io/google_containers/etcd-amd64:2.2.1",
                "Host": "172.31.0.14",
                "Name": "k8s_etcd.cff955b7_kube-dns-v11-3e5so_kube-system_0cf9a5e8-31f3-11e6-9704-0e852ea56ce5_342992f2",
                "Id": "/docker/e12457ef0b5abf612a3a0998e3e087a84be7e1783baebff876618c7303ed924f"
}, {
                "Image": "gcr.io/google_containers/pause:2.0",
                "Host": "172.31.0.14",
                "Name": "k8s_POD.5699264e_kube-dns-v11-3e5so_kube-system_0cf9a5e8-31f3-11e6-9704-0e852ea56ce5_74f43165",
                "Id": "/docker/4bf327204f9bea97b41be68dd9b97e91612d127b30466882ee4655ca352d5f69"
}, {
                "Image": "gcr.io/google_containers/skydns:2015-10-13-8c72f8c",
                "Host": "172.31.0.14",
                "Name": "k8s_skydns.512c7b71_kube-dns-v11-3e5so_kube-system_0cf9a5e8-31f3-11e6-9704-0e852ea56ce5_a03b13ed",
                "Id": "/docker/59f18abb8f8f30d4d867fe3667a65eb2898f0e82b72d9e1f6ac1a6b9a15ed2a7"
}];
		res.send(data);*/
		request.get(options, function(error,response,body){
			console.log(body);
			res.send(body);
		}).on("error", function(e){
			//console.log("Got error: " + e.message);
			next(e);			
		});

	});
	}
