/**
 * Recipe Model
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

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


// SOMETHING AWESOME
var ingredientSchema = new mongoose.Schema({
  meta: {
    type: Object,
    ref: {
      qty: {
        type: Object,
        required: true,
        default: {
          whole: 1,
          frac: null
        }
      },
      nutrition: {
        type: Object,
        required: true,
        default: {
          nf_calories: null
        }
      },
      measurement: {
        type: Object,
        required: true,
        default: {
          measure_MG: null,
          measure_OZ: null
        }
      }
    }
  }
}, {
  strict: false
});

// Recipe Schema
var recipeSchema = new mongoose.Schema({
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
  ingredients:[ingredientSchema]
  // ingredients: [{
  //   type: Types.ObjectId,
  //   ref: 'Ingredient'
  // }] // references another collection .populate('ingredients')
});



// Created an index ensuring uniqueness on name
// background allows an index to be processed without locking mongod
recipeSchema.index({name:1},{unique:true,background:true});
module.exports = function(){
  return mongoose.model('Recipe', recipeSchema);
}