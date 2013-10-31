// declare a module
angular.module('recipe', ['nutritionix'])

.controller('RecipesCtrl', ['$scope', 'request', 'nixApi',
  function($scope, request, nixApi) {
    $scope.recipes = [];

    $scope.delRecipe = function(_id,$index){
      console.log(_id,$index)
      request({
        url:"/recipes/"+_id,
        method:"DELETE"
      },function(err,data){
        if(err) return console.warn(err);
        // remove item from list
        $scope.recipes.splice($index,1)
      })
    };

    $scope.addRecipe = function() {
      request({
        method: "POST",
        url: '/recipes',
        data: $scope.recipe
      }, function(err, data) {
        $("#name").focus();
        if (err) return console.warn(err);
        $scope.recipes.push(data);
        $scope.recipe = {
          "name": null,
          "serving_unit_qty": null,
          "serving_unit_name": null
        }
      });
    }
  }
])

.controller('RecipeCtrl', ['$scope', 'request',
  function($scope, request) {
    $scope.recipe = recipe;
    $scope.fractions = fractions.sort();
    $scope.measurements = measurements;
    $scope.saveIng = function() {
      $scope.save({
        $set: {
          ingredients: $scope.recipe.ingredients
        }
      })
    }
    $scope.save = function(update) {
      request({
        url: '/recipes/' + $scope.recipe._id,
        method: "POST",
        data: JSON.stringify(update)
      }, function(err, data) {
        if (err) console.log(err);
        // if(!err) console.log("Successfully updated");
      })
    }
  }
])

.directive('typeAhead', [
  function() {
    return {
      restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
      link: function($scope, iElm, iAttrs, controller) {
        iElm.typeahead({
          name: 'Items',
          limit: 10,
          remote: '/recipes/search?q=%QUERY',
          valueKey: 'item_name',
          template: '<p><strong>{{item_name}}</strong></p>',
          engine: Hogan,
          autoselect: true
        }).on('typeahead:selected', function(obj, datum) {
          $scope.recipe.ingredients.push(datum);
          $scope.$apply(function() {
            $scope.save({
              "$set": {
                "ingredients": $scope.recipe.ingredients
              }
            });
          });
          iElm.typeahead("setQuery");
        }).on("typeahead:opened", function(a, b, c, d) {
          var sugg = $('.tt-suggestion');
          if (sugg.length) sugg[0].focus();
        });
      }
    }
  }
])

// Angular Pop Over Bootstrap 3.0
.directive('bsPopOver', ['$compile',function($compile){
  // Runs during compile
  return {
    restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
    link: function($scope, iElm, iAttrs, controller) {
      iElm.popover({
        trigger:iAttrs.bsTrigger,
        placement:iAttrs.bsPlacement,
        title:iAttrs.bsTitle,
        html:true,
        content:function(){
          var html = $(iAttrs.bsContent).html();
          return $compile(html)($scope);
        }
      })
    }
  };
}])

// Wrapper for angular $http, follows NodeJS
// err,data convention and accepts a callback
.factory('request', ['$http',
  function($http) {
    return function(opts, cb) {
      $http(opts).success(function(d, s, h, c) {
        cb(null, d, s, h, c);
      }).error(function(e, s, h, c) {
        cb(e, null, s, h, c);
      });
    }
  }
])