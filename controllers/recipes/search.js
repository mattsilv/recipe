var request = require("request");
var search = function(req,res){
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
        "not":{
          "nf_serving_weight_grams":null
        },
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
};

module.exports = function(){return search};