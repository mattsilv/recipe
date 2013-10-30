var show = function(req,res,next){
  var id = req.param("id");
  var Recipe = req.app.models.Recipe;

  Recipe.findOne({"_id":id},function(err,recipe){
    if(err) return next(err);
    res.render("recipe", {
      title: "Recipe",
      recipe: recipe
    });
  });
  
};

module.exports = function(){return show};