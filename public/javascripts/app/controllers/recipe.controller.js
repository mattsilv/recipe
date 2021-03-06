// declare a module
angular.module('recipe', ['nutritionix'])

.controller('RecipesCtrl', ['$scope', 'request', 'nixApi',
  function($scope, request, nixApi) {
    $scope.recipes = [];

    $scope.delRecipe = function(_id,$index){
      // console.log(_id,$index)
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
    

    // Merge Data Measurments With Weights
    // From USDA, or CPG Items
    $scope.mergeMeasurements = function(weights){
      // console.log(weights)
      if(!weights) return $scope.measurements;
      var newMeasurements = [];
      for(var w in weights){
        w = weights[w];
        newMeasurements.push({
          group: "us",
          name: w.serving_unit_name,
          usda_name: w.serving_unit_name,
          aliases: null,
          measure_ML: null,
          measure_MG: w.serving_weight_grams,
          measure_OZ: null,
          usda:true
        });
      }
      return newMeasurements.concat($scope.measurements);
    };

    $scope.calc = function($index){
      var ing = $scope.recipe.ingredients[$index];
      var frac = eval(ing.meta.qty.frac);
      var whole = eval(ing.meta.qty.whole);
      var caloriesPerGram = (ing.nf_calories / ing.nf_serving_weight_grams);
      var usda = ing.meta.measurement.usda === true;
      ing.meta.qty.calc = whole+frac;

      request({
        url:"http://localhost:3080/recipe/gramsPerOz",
        method:"POST",
        data:{
          "serving_size_qty":ing.nf_serving_size_qty,
          "serving_size_unit":ing.nf_serving_size_unit,
          "serving_weight_grams":ing.nf_serving_weight_grams,
          "show_meas":true
        }
      },function(err,data){
        
        
        if(!usda && data && data.grams_per_oz){
          ing.meta.measurement.measure_MG = ((data.grams_per_oz * ing.meta.measurement.measure_OZ));
        }

        ing.meta.nutrition.nf_serving_weight_grams = ing.meta.qty.calc * ing.meta.measurement.measure_MG
        ing.meta.nutrition.nf_calories = ing.meta.qty.calc * (caloriesPerGram * ing.meta.measurement.measure_MG)
        // var servingWeightGrams = ing.weights
        // console.log(weight)
        $scope.updateTotals();
        $scope.saveIng()
      });
      
      
    }

    $scope.updateTotals = function(){
      var l = $scope.recipe.ingredients;
      // Recipe Agg Totals
      $scope.totalCalories = 0;
      $scope.totalSWGrams  = 0;
      
      for(var _i in l){
        var ing = l[_i];
        $scope.totalCalories += ing.meta.nutrition.nf_calories;
        $scope.totalSWGrams += ing.meta.nutrition.nf_serving_weight_grams;
      }
    };

    $scope.remIng = function($index){
      $scope.recipe.ingredients.splice($index,1)
      $scope.saveIng()
    };

    $scope.saveIng = function() {
      $scope.save({
        $set: {
          ingredients: $scope.recipe.ingredients
        }
      })
    };

    $scope.save = function(update) {
      request({
        url: '/recipes/' + $scope.recipe._id,
        method: "POST",
        data: JSON.stringify(update)
      }, function(err, data) {
        if (err) return console.log(err);
        $scope.updateTotals();
        // if(!err) console.log("Successfully updated");
      })
    }
    // init
    $scope.updateTotals();
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
          datum.meta = { 
            qty: { whole: 0, frac: null },
            nutrition:{ nf_calories: null },
            measurement:{ measure_MG: null }
          };
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
          console.log($scope)
          html = $compile(html)($scope);
          // $scope.apply()
          return html;
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
