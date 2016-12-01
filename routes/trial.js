module.exports = function(app){
	app.get("/getcanvas", function (req, res, next) {
			var labels = ['jan','Feb','Mar','Apr','May'];
			var data = [[65, 59, 80, 81, 56],
						[28, 48, 40, 19, 86],
						[134,160,179,120,100]];
			var series = ['Series A', 'Series B'];
			res.send({
				labels : labels,
				data : data,
				series : series
			});
	});
	app.get("/getPie",function(req,res,next){
		var labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
		var data = [300, 500, 100];
		res.send({
			labels:labels,
			data:data
		});
	});
	
}