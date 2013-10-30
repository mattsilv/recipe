var create = function(req,res,next){
  var Recipe = req.app.models.Recipe;
  var recipe = new Recipe(req.body);
  recipe.save(function(err){

    if(err !== null){
      console.error(err);
      return res.json(err,400);
    }
    
    res.json(recipe,201)
  });
};

module.exports = function(){return create};