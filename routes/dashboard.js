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
			var result = req.body;
			 if (result.metrics.length > 0){
				var metricscount=0;
				var resp = [];
				var request = require ('request');
				var config = require('config');
				require("async").whilst(
				function(){
					if (metricscount < result.metrics.length) return true;
				},
				function(callback){

        var jsonObj2 ={'unit_type':result.unit_type,'sub_type':result.sub_type,'meter_name':result.metrics[metricscount]};
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
                                var jsonBody = JSON.parse(body)
                                if (jsonBody.result_list.length > 0) {
                                    resp.push(
                                        {
                                        "name":jsonBody.meter_name.name,
					"value": {x:jsonBody.result_list[0].time, y:jsonBody.result_list[0].value},
					"widget":req.body.widgets,
					"unit_type":jsonBody.unit_type,
                                        
                                	})
                               }
			               		  metricscount++;
			                         callback();
                            }
                    );
				},
                   

				function (err, n) {
				
					res.send(resp);
				})
				}
		});
};
