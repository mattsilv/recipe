module.exports = function(app){
  // console.log(app.controllers.recipes)
  var controllers = app.controllers;

  // Recipe Routes
  app.get('/recipes',controllers.recipes.index);
  app.post('/recipes',controllers.recipes.create);
  app.get('/recipes/search',controllers.recipes.search);
  app.get('/recipes/:id/edit',controllers.recipes.edit);
  app.post('/recipes/:id',controllers.recipes.save);
  app.delete('/recipes/:id',controllers.recipes.delete);
  // app.all('*',function(req,res){
  //   var statusCode = 404;
  //   if(req.xhr){
  //     res.json({message:"We couldn't find what you were looking for"},statusCode)
  //   }else{
  //     res.render('404',404)
  //   }
  // });
}

// C.reate
// R.ead
// U.pdate
// D.estroy