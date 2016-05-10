var express = require('express')
   , http = require('http')
   , path = require('path')
   , bodyParser = require('body-parser')
   , cookieParser = require('cookie-parser')
   , log4js = require('log4js')
   , methodOverride = require('method-override')
   , config = require('config')
   , session = require('express-session');

var app = express();

app.set('port', process.env.PORT || config.node_server_port);
app.set('views', __dirname + '/views');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(express.Router());

require('./routes/index')(app);
require('./routes/nodes')(app);
require('./routes/dashboard')(app);

log4js.configure('./config/log4js.json',{});
app.set('logger',log4js);
var logger = log4js.getLogger("app.js");

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
