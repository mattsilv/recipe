// declare a module
angular.module('recipe', ['nutritionix'])

.controller('RecipesCtrl', ['$scope','$http','nixApi',function($scope,$http,nixApi) {
  $scope.recipes = [];

  $scope.addRecipe = function(){
    $http({
      method: "POST",
      url: '/recipes',
      data: $scope.recipe
    })
    .success(function(data){
      $scope.recipes.push(data);
      $scope.recipe = {
        "name":null,
        "serving_unit_qty":null,
        "serving_unit_name":null
      };
    })
    .error(function(err){
      console.warn(err)
    })
  }
}])

.controller('RecipeCtrl', ['$scope','$http','nixApi',function($scope,$http,nixApi) {
  $scope.recipe = recipe;
  $scope.fractions = fractions.sort();
  $scope.measurements = measurements;
}])

.directive('typeAhead', [function(){
  return {
    restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
    link: function($scope, iElm, iAttrs, controller) {
      iElm.typeahead({
        name: 'Items',
        limit:10,
        remote: '/recipes/search?q=%QUERY',
        valueKey:'item_name',
        template: '<p><strong>{{item_name}}</strong></p>',
        engine: Hogan,
        autoselect: true
      }).on('typeahead:selected', function(obj, datum) {
        $scope.recipe.ingredients.push(datum)
        $scope.$apply();
        iElm.typeahead("setQuery")
      }).on("typeahead:opened", function (a,b,c,d) {
        var sugg = $('.tt-suggestion');
        if(sugg.length) sugg[0].focus();
      });
    }
  }
}])