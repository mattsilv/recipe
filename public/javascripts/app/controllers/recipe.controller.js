// declare a module
var recipe = angular.module('recipe', []);
 
recipe.controller('RecipeCtrl', ['$scope','$http',function($scope,$http) {
 alert("Welcome to the recipe builder");
}]);