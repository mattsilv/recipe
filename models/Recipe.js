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

// Start Schema Definition
var recipeSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  }
});


// Created an index ensuring uniqueness on name
// background allows an index to be processed without locking mongod
recipeSchema.index({name:1},{unique:true,background:true});
module.exports = mongoose.model('Recipe', recipeSchema);