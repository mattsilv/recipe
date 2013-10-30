var meas = require("../../data/measurements");
var frac = require("../../data/fractions");
var edit = function(req,res,next){
  var id = req.param("id");
  var Recipe = req.app.models.Recipe;

  Recipe.findOne({"_id":id},function(err,recipe){
    if(err) return next(err);
    res.render("recipes/edit", {
      title: "Recipe",
      recipe: recipe,
      measurements:meas,
      fractions:frac
    });
  });
  
};

module.exports = function(){return edit};