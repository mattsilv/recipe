module.exports = function() {
  return function(req, res, next) {
    var Recipe = req.app.models.Recipe;
    var _id = req.param("id");
    Recipe.findOne({ "_id": _id }, function(err, recipe) {
      if (err) return next(err);
      recipe.remove(function(err) {
        if (err) return next(err);
        res.json({
          message: "Recipe Successfully Deleted."
        }, 200);
      });
    });
  };
};