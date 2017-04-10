var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var recometricSchema = new mongoose.Schema({
  name:String,
  recometric:Array
   })

var recometric = mongoose.model("recometric",recometricSchema);

var url = require('url');
module.exports = function(app) {

	app.get("/getOptions", function (req, res, next) {
		res.send('["service","application","container","node","datacenter","framework"]');
	});

	app.get("/getEntities",function(req,res,next){
		var unit_type = req.query.unit_type;
		var sub_type = req.query.sub_type;
		var result = req.query.result;
		var request = require('request');
		var config = require('config');
		if(result == null){
			var options = {
			url: "http://"+config.server.dashboard_server_ip+":"+config.server.dashboard_server_port+'/v1/catalogue?unit_type='+unit_type+'&sub_type='+sub_type,
			method: 'GET',
			accept:'application/json'
			};
		}else{
			var options = {
			url:"http://"+config.server.dashboard_server_ip+":"+config.server.dashboard_server_port+'/v1/catalogue?unit_type='+unit_type+'&'+result+'='+value+'&sub_type='+sub_type,
			method: 'GET',
			accept:'application/json'
			};
		}
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
	condition.where = {"name":app_type};
	fields ={'_id':0};
	console.log(app_type);
		recometric.find(condition.where,fields,function(err,result){
					if(err)
						console.log("Error is : " +  err);
					else{

						var jsonResult = JSON.parse(JSON.stringify(result))
						res.send(jsonResult);
				}
					});

				});


};
