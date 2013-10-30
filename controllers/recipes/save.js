var save = function(req,res,next){
  var Recipe = req.app.models.Recipe;
  var id = req.param("id");
  var update = req.body;
  Recipe.update({"_id":id},update,function(err,numAffected){
    if(err) return res.json(err,400);
    res.json({
      message:"Successfully updated item",
      _id:id
    },200)
  })
};

module.exports = function(){return save};