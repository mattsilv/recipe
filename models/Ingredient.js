/**
 * Ingredient Model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var ingredientSchema = mongoose.Schema({
  name:{type:String,required:true},
  serving_unit_qty:Number,
  serving_unit_name:String,
  measure_qty:Number,
  measure_uom:String,
  api_item_id:{type:String,required:true},
  recipe:{type:Types.ObjectId, ref:'Recipe'}
});

module.exports = function(){
  return mongoose.model('Ingredient', ingredientSchema);
}