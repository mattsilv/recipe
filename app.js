
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var argv = require('optimist').argv; // process args
var fs   = require('fs')
var app = express();


var apiCred = fs.readFileSync('./config/api.cred.json','utf8');
apiCred = JSON.parse(apiCred);
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('apiCred',apiCred);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('ccc369d4f40ee9c2234d2d502f91a8328a835375'));
app.use(express.session({
  secret:"ccc369d4f40ee9c2234d2d502f91a8328a835375"
}));
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//  ================================
//  Application Routing
//  ================================
// app.get('rout/',middleware,controller)
app.get('/recipe',function(req,res){
  res.render("recipe")
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// Expose app for testing hook
module.exports = app;