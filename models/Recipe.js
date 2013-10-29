var mongoose = require('mongoose');
// Initialize Model Schema's

// Types:
//   String
//   Number
//   Object
//   Array

// Validations:
//   Number:
//     min,max
// reqired @boolean
// default sets default if none is provided on creation

// TODO JAMES: assign unique ID to each instance of an ingredient within a recipe

// Start Schema Definition

// Notes
// serving_unit_qty - 5
// serving_unit_name - Cup Chopped
// measure_qty - 100
// measure_uom - either ml or g, no other value accepted
var recipeSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  serving_unit_qty:{
    type:Number,
    required:true
  },
  serving_unit_name:{
    type:String,
    required:true
  },
  ingredients:[{
    name:String,
    serving_unit_qty:Number,
    serving_unit_name:String,
    measure_qty:Number,
    measure_uom:String,
    api_item_id:String
  }]
});



// Created an index ensuring uniqueness on name
// background allows an index to be processed without locking mongod
recipeSchema.index({name:1},{unique:true,background:true});
module.exports = mongoose.model('Recipe', recipeSchema);