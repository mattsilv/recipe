var request = require("request");
var search = function(req,res){
  var nixApi = req.app.get('envSettings').nutritionix;
  var query = req.param("q");
  request({
    url:"https://api.nutritionix.com/v1_1/search",
    method:"POST",
    qs:nixApi,
    json: {
      "fields": [
        "item_name",
        "brand_name",
        "item_type",
        "nf_calories",
        "nf_serving_weight_grams",
        "nf_serving_size_qty",
        "nf_serving_size_unit",
        "weights",
        "seq"
      ],
      "min_score":0.1,
      "query": query,
      "filters": {
        "seq":1,
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
    var status = (r && r.statusCode >= 400);
    if(status) console.error("API_ERROR",b);
    for(var index in b.hits){
      var item = b.hits[index].fields;
      item.item_name = item.item_name.split(' - ')[0].trim();
      items.push(item)
    }
    res.json(items, (!status)? r.statusCode:500 );
  })
};

module.exports = function(){return search};