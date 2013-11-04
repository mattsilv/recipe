/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var argv = require('optimist').argv; // process args
var fs   = require('fs')
var app = express();
var env = process.env.NODE_ENV || 'development';
var mongoose = require('mongoose');
var envConfig = require('./config/'+env+'.config.js');
var loadModule      = require('express-load');
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('secret','ccc369d4f40ee9c2234d2d502f91a8328a835375');
app.set('envSettings',envConfig)
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(express.cookieParser(app.get("secret")));
app.use(express.session({
  "secret":app.get("secret")
}));
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

var mongooseSettings = app.get('envSettings').mongoose;
var db = mongoose.connect(mongooseSettings.url, mongooseSettings.options);
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//  ================================
//  Application Routing
//  ================================
// app.get('rout/',middleware,controller)
loadModule('controllers')
  .then('models')
  .then('config/routes.js')
  .into(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  console.log("MongoDB Info:")
  console.log(mongooseSettings)
});


// Expose app for testing hook
module.exports = app;