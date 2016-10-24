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

var express = require('express')
   , http = require('http')
   , path = require('path')
   , bodyParser = require('body-parser')
   , cookieParser = require('cookie-parser')
   , connection = require('express-myconnection')
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
require('./routes/trial')(app);
require('./routes/select')(app);
require('./routes/dashboardbuilder')(app);
require('./routes/entity')(app);
require('./routes/chart')(app);



log4js.configure('./config/log4js.json',{});
app.set('logger',log4js);
var logger = log4js.getLogger("app.js");

require("myframework").configure(app, function(err,data){
  if(err)
    console.log('Error Found');
  else
    {
      console.log(" Callback function is being called ");
      http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
      });
   }
})
   