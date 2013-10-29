// declare a module
var recipe = angular.module('recipe', ['nutritionix']);
 
recipe.controller('RecipeCtrl', ['$scope','$http','nixApi',function($scope,$http,nixApi) {
  $scope.items = [];
}]).directive('typeAhead', [function(){
  return {
    restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
    link: function($scope, iElm, iAttrs, controller) {
      iElm.typeahead({
        name: 'Items',
        limit:10,
        remote: '/recipe/search?q=%QUERY',
        valueKey:'item_name',
        template: '<p><strong>{{item_name}}</strong></p>',
        engine: Hogan
      }).bind('typeahead:selected', function(obj, datum) {
        $scope.items.push(datum)
        $scope.$apply();
      });
    }
  }
}])