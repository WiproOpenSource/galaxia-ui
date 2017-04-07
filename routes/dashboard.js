var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var metricSchema = new mongoose.Schema({
  templatename:String,
  widget:String,
  metrics: Schema.Types.Mixed,
  type:String,
  subtype:String
   })

var metric = mongoose.model("metric",metricSchema);



module.exports = function(app) {
		app.post('/dashboard/chartdata/',function(req,res,next){
			console.log("inside chartdata")
			var result = req.body;
			console.log("RESULT",result.metrics);
			 if (result.metrics.length > 0){
				var metricscount=0;
				//console.log("metrics length "+JSON.stringify(result[0].metrics.length));//total number of metrics
				var resp = [];
				var request = require ('request');
				var config = require('config');
				require("async").whilst(
				function(){
					console.log("metrics length "+result.metrics.length)
					console.log("metrics count "+metricscount)
					if (metricscount < result.metrics.length) return true;
				},
				function(callback){

        var jsonObj2 ={'unit_type':result.unit_type,'sub_type':result.sub_type,'meter_name':result.metrics[metricscount]};
				console.log('JSON',JSON.stringify(jsonObj2));
                	request("http://"+config.server.dashboard_server_ip+":"+config.server.dashboard_server_port+'/v1/metrics',
                            {
                                'method':"POST",
                                'body': JSON.stringify(jsonObj2),
                                'headers':{
                                            'Content-Type':"application/json"
                                }
                            },
                            function(error,response,body) {
                                console.log("BODY",body);
                                var jsonBody = JSON.parse(body);
								                console.log("jsonbody"+JSON.stringify(jsonBody));
                                if (jsonBody.result_list.length > 0) {
                                    resp.push(
                                        {
                                        "name":jsonBody.meter_name.name,
                    										"value": {x:jsonBody.result_list[0].time, y:jsonBody.result_list[0].value},
                    										"widget":req.body.widgets,
                    										"unit_type":jsonBody.unit_type,
                                        //"dashboard":req.params.dashboardname
                                		})
                               }
			               		       metricscount++;
			                         callback();
                            }
                    );
				},
                   /* resp.push(
                        {
                        "name":jsonObj2.meter_name,
                        "value": {x:metricscount, y:Math.random()*10000},
                        "widget":req.body.widgets,
                        "unit_type":jsonObj2.unit_type,
                        //"dashboard":req.params.dashboardname
                    })

                    metricscount++;
                    callback();
        		},*/

				function (err, n) {
					console.log("returning "+JSON.stringify(resp));
					res.send(resp);
				})
				}
		});
};
