'use strict';

/**
 *
 * Nutritionix API Wrapper for Angular JS
 *
 * Author: James R. Qualls <jqualls@nutritionix.com>
 * Copy: MIT 2013-2014 Nutritionix LLC.
 *
 */


angular.module('nutritionix', [])
.factory('nixApi',['$http',function($http){
  var base_url = "https://api.nutritionix.com";
  var appId = null;
  var appKey = null;
  var injectCredentials = function(d){
    d.appId = appId;
    d.appKey = appKey;
    return d;
  };

  // Errors
  var errors = {
    "missing_opts":"You did not provide an Options Object to this request!",
    "missing_cb":"You did not provide a callback function as the second param"
  }

  // Return self for method chaining

  // Constructor
  var self = {
    /**
     * Set your API credentials
     * @param cred {object} 
     *  appId {string} nutritionix appId.
     *  appKey {string} nutritionix appKey.
     *
     *  @example nixApi.setCredentials({ "appId":"YOUR_APP_ID", "appKey":"YOUR_APP_KEY" })
     */
    setCredentials: function(cred) {
      appId = cred.appId;
      appKey = cred.appKey;
      return self;
    },

    /**
     * nixApi.exec()
     *
     * Returns a callBack with err, data, status, headers, config
     * data will be null if there was an error durring the request
     * err will be null if the request was compleated successfully.
     * @example 
     *   nixApi.exec({
     *     "endpoint": "/v1_1/search",
     *     "method": "POST",
     *     "data": {
     *       "query": "Turkey"
     *     }
     *   },function(err,data){
     *     console.log(data);
     *   })
     */
    exec:function(opts,cb){
      if(!cb   || (typeof cb !== 'function')) return console.error(errors.missing_cb);
      if(!opts || (typeof opts !== 'object')) return console.error(errors.missing_opts);

      // Inject API Credentials into req
      if(opts.data) opts.data = injectCredentials(opts.data);
      if(opts.params && !opts.data) opts.params = injectCredentials(opts.params);

      // Construct Request
      var req = {
        url: base_url + opts.endpoint,
        method:  opts.method  || "GET",
        headers: opts.headers || void 0,
        params:  opts.params  || void 0,
        data:    opts.data    || void 0
      };
      // Send Request
      $http(req).success(function(d, s, h, c) {
        cb(null, d, s, h, c);
      }).error(function(e, s, h, c) {
        cb(e, null, s, h, c);
      });
    }
  };
  return self;
}])


// 
// recipe.service('api.service', ['$scope','$http',function($scope,$http) {
//  alert("Welcome to the recipe builder");
// }]);