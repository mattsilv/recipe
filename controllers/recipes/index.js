// /recipes
var index = function(req, res) {
  var Recipe = req.app.models.Recipe;

  Recipe
    .find()
    .limit(req.param('limit'))
    .exec(function(err, recipes) {
      res.render("recipes/index", {
        title: "View All Recipes",
        recipes: recipes
      })
    })
};

// Expose Controller
module.exports = function() {
  return index
};