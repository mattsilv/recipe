var fs = require("fs");
var should = require('chai').should();
var supertest = require('supertest');
var api = supertest(require('../app'));
var Browser = require('zombie');
var zombie = new Browser()

describe("Recipe API", function() {

  it("should CREATE, UPDATE, DELETE a Recipe", function(done) {

    api
      .post("/recipes")
      .send({
        "name":"Something Awesomer",
        "serving_unit_qty":123,
        "serving_unit_name":"bowls"
      })
      .expect(201,function(err,res){
        // Check err then fail
        if(err) return done(err);
        // Check Resp Body
        res.body.should.have.property('_id');
        // Set the id
        var _id = res.body._id;
        
        // Post an update
        api.post("/recipes/" + _id)
          .send({
            $set: {
              name: "CHANGE AWESOME NAME"
            }
          })
          .expect(200, function(err, res) {
            if (err) return done(err);
            res.body.should.have.property("_id")
            res.body.should.have.property("message")
            // Delete Record
            api.del("/recipes/" + _id).expect(200, function(err,res){
              if(err) return done(err);
              res.body.should.have.property("message");
              done()
            })
          })
      })

  });

  // api
  //   .post("url") // url to post a req to
  //   .send('{"query":"mcdonalds"}') // JSON data
    
  //   // Send an attachement
  //   // .attach('avatar', 'test/fixtures/homeboy.jpg')
    
  //   // headers
  //   .set('Accept', 'application/json')
  //   .set('Content-Type', 'application/json')
  //   .expect(200, done)

});



// ZOMBIE TESTING
describe("Zombie", function(){
    
    // Descrive this part of the test
    it("should be able to visit recipes", function(done){
        
        // Tell the zombie where to go
        zombie.visit("http://localhost:3000/recipes", function() {
            // Ensures the zombie
            // successfully saw the recipes page.
            (zombie.success).should.be.ok;
            done();
        });

    });

});






// CUSTOM TEST ON RESP
// describe("What are you testing", function() {

//   it("should do something", function(done) {

//     api // Hooks into application
//       .get("URL/toTest")
//       // what status code you are looking for
//       .expect(200)
//       // fires callback once reponse
//       // has been gathered
//       .end(function(err, res) {
//         if (err) return done(err);
//         // ... write more expectations
//         // res.body.should.have.property('_id');
//         // res.body.firstName.should.equal('JP');
//         // res.body.lastName.should.equal('Berd');                    
//         // res.body.creationDate.should.not.equal(null);
//         // res.should.have.status(400);
//         done();
//       });

//   });

//   api
//     .post("url") // url to post a req to
//     .send('{"query":"mcdonalds"}') // JSON data
    
//     // Send an attachement
//     // .attach('avatar', 'test/fixtures/homeboy.jpg')
    
//     // headers
//     .set('Accept', 'application/json')
//     .set('Content-Type', 'application/json')
//     .expect(200, done)

// });


// NOTES
// .expect(status[, fn])

// Assert response status code.
// .expect(status, body[, fn])

// Assert response status code and body.
// .expect(body[, fn])

// Assert response body text with a string, regular expression, or parsed body object.
// .expect(field, value[, fn])

// Assert header field value with a string or regular expression.
// .end(fn)

// See req methods
// uri || url - fully qualified uri or a parsed url object from url.parse()
// qs - object containing querystring values to be appended to the uri
// method - http method, defaults to GET
// headers - http headers, defaults to {}
// body - entity body for POST and PUT requests. Must be buffer or string.
// form - when passed an object this will set body but to a querystring representation of value and adds Content-type: application/x-www-form-urlencoded; charset=utf-8 header. When passed no option a FormData instance is returned that will be piped to request.
// json - sets body but to JSON representation of value and adds Content-type: application/json header. Additionally, parses the response body as json.
// multipart - (experimental) array of objects which contains their own headers and body attribute. Sends multipart/related request. See example below.
// followRedirect - follow HTTP 3xx responses as redirects. defaults to true.
// followAllRedirects - follow non-GET HTTP 3xx responses as redirects. defaults to false.
// maxRedirects - the maximum number of redirects to follow, defaults to 10.
// encoding - Encoding to be used on setEncoding of response data. If set to null, the body is returned as a Buffer.
// pool - A hash object containing the agents for these requests. If omitted this request will use the global pool which is set to node's default maxSockets.
// pool.maxSockets - Integer containing the maximum amount of sockets in the pool.
// timeout - Integer containing the number of milliseconds to wait for a request to respond before aborting the request
// proxy - An HTTP proxy to be used. Support proxy Auth with Basic Auth the same way it's supported with the url parameter by embedding the auth info in the uri.
// oauth - Options for OAuth HMAC-SHA1 signing, see documentation above.
// strictSSL - Set to true to require that SSL certificates be valid. Note: to use your own certificate authority, you need to specify an agent that was created with that ca as an option.
// jar - Set to false if you don't want cookies to be remembered for future use or define your custom cookie jar (see examples section)
// aws - object containing aws signing information, should have the properties key and secret as well as bucket unless you're specifying your bucket as part of the path, or you are making a request that doesn't use a bucket (i.e. GET Services)