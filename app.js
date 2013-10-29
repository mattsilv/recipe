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

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('secret','ccc369d4f40ee9c2234d2d502f91a8328a835375');
app.set('envSettings',envConfig)
app.use(express.logger('dev'));
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(app.get("secret")));
app.use(express.session({
  "secret":app.get("secret")
}));
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

var mongooseSettings = app.get('envSettings').mongoose;
var db = mongoose.createConnection(mongooseSettings.url, mongooseSettings.options);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//  ================================
//  Application Routing
//  ================================
// app.get('rout/',middleware,controller)
app.get('/recipe',function(req,res){
  var nixApi = req.app.get('envSettings').nutritionix;
  res.render("recipe",{title:"Recipe",nixApi:nixApi})
});

app.get('/',function(req,res){
  var nixApi = req.app.get('envSettings').nutritionix;
  res.render("index",{title:"Index",nixApi:nixApi})
});

var request = require("request")
app.get('/recipe/search',function(req,res){
  var nixApi = req.app.get('envSettings').nutritionix;
  var query = req.param("q");
  request({
    url:"https://api.nutritionix.com/v1_1/search",
    method:"POST",
    qs:nixApi,
    json: {
      // "fields": ["_score", "item_name", "brand_name", "item_type", "keywords", "seq"],
      "query": query,
      "filters": {
        "seq": 1,
        "exists": {
          "keywords": true
        }
      }
    } 
  },function(e,r,b){
    var items = []
    for(var index in b.hits){
      var item = b.hits[index]._source;
      item.item_name = item.item_name.split('-')[0].trim();
      items.push(item)
    }
    res.json(items)
  })

});

// /recipes
app.get('/recipes',function(req,res){
  res.render("recipes/index",{title:"View All Recipes"})
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// Expose app for testing hook
module.exports = app;