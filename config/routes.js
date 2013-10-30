module.exports = function(app){
  // console.log(app.controllers.recipes)
  var controllers = app.controllers;

  // Recipe Routes
  app.get('/recipes',controllers.recipes.index);
  app.post('/recipes',controllers.recipes.create);
  app.get('/recipes/search',controllers.recipes.search);
  app.get('/recipes/:id',controllers.recipes.show);
}

// C.reate
// R.ead
// U.pdate
// D.estroy