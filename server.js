// Initialization
var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var validator = require('validator'); // See documentation at https://github.com/chriso/validator.js
var app = express();
// See https://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
app.use(bodyParser.json());
// See https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(__dirname + '/static'));

// Mongo initialization and connect to database
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/feedme';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
   db = databaseConnection;
});

//TODO: if a restuarant is successfully registered, take them to their account page
// IF error, take them back to the register page with an error message
app.post('/register', function(request, response) {
  var googleid = request.body.googleid;
  var name = request.body.name;
  var phone = request.body.phone;
  var email = request.body.email;
  var grubhuburl = request.body.grubhuburl;
  var lat = request.body.lat;
  var lng = request.body.lng;
  if(!googleid || !name || !phone || !grubhuburl || !lat || !lng) {
    response.status(500).send("A required field is missing from your submission.");
  }else{
   var toInsert = {
      "googleid":googleid,
      "name":name,
      "phone":phone,
      "email":email,
      "grubhuburl":grubhuburl,
      "lat":lat,
      "lng":lng,
   };
  // response.send();
    db.collection('restaurants', function(err, cursor) {
      cursor.remove({"googleid":googleid}, function(err, collection){
        if(err){
          response.send("error A");
        }
      });
      //insert new location for login
      cursor.insert(toInsert, function(err, saved) {
        if(err){
          response.send("error B");
        }else{
          response.send(200);
        }
      });
    });
}
});

app.post('/addfood', function(request, response){
  response.set('Content-Type', 'text/html');

  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // We need to use restaurant identification (whatever we get from Google when they log in, which can be passed from client side)
  // then need server to query database "restaurants" colection and get: Restaurant name, Lat, Lng, phone number, grubhub, restaurant key
  // then store this info with the fooditem in 'fooditems' collections
//console.log('request '+request.body.rest_name);

var foodname = request.body.foodname;
var picref = request.body.picref;
var price = parseFloat(request.body.price);
var savory = request.body.savory;
var spicy = request.body.spicy;
var sweet = request.body.sweet;
var fruity = request.body.fruity;
var vegetarian = request.body.vegetarian;
var vegan = request.body.vegan;
var other = request.body.other;

var rest_name;
var gid = request.body.googleid;
console.log(gid);
if(gid=="none"){
  response.send("No restaurant associated with query.");
}else{
var id = request.body._id;
if(id != "none"){
  db.collection('foods', function(er, collection) {
    var toRemove = new mongodb.ObjectID(id);
    collection.remove({_id:toRemove}, function(err, coll){});
  });
}
var rest_lat;
var rest_lng;
var phone;
var ghub;
db.collection('restaurants', function(err, collection){
  collection.find({"googleid":gid}).toArray(function(err, doc){
    if(doc[0]!=undefined){
      console.log("rest_name: "+doc[0].name);
    rest_name = doc[0].name;
    rest_lat = parseFloat(doc[0].lat);
    rest_lng = parseFloat(doc[0].lng);
    phone = doc[0].phone;
    ghub = doc[0].grubhuburl;
    var toInsert = {
      "rest_name": rest_name,
  "rest_lat": rest_lat,
  "rest_lng": rest_lng,
  "phone": phone,
  "ghub": ghub,
  "foodname":foodname,
  "picref":picref,
  "price":price,
  "savory":savory,
  "spicy" :spicy,
  "sweet" :sweet,
  "fruity" :fruity,
  "vegetarian" :vegetarian,
  "vegan" :vegan,
  "other" :other,
};
  db.collection('foods', function(err, collection){
    collection.insert(toInsert, function(er, collection){
    if(!er){
      response.status(200).send(toInsert);
    }else{
      response.send(500);
    }
    });
  });
  }else{
   response.send("No restaurant registered.");
  }
  });
});
}
});

app.get('/edit_dish', function(request, response) {
  
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  response.set('Content-Type', 'application/json');
  
  var id = request.query._id;
  if(id != undefined) {
    db.collection('foods', function(er, collection) {
      var toFind = new mongodb.ObjectID(id);
      collection.find({_id:toFind}).toArray(function(err, doc) {
        if(doc) {
          response.status(200).send(doc);
        }else{
          response.status(200).send('[]');
        }
      }); 
    });
  }else{
    response.send("Invalid Food");
  }
});


app.post('/delete_food', function(request, response) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  response.set('Content-Type', 'application/json');

  var id = request.body._id;
  if(id != undefined) {
    db.collection('foods', function(er, collection) {
      var toRemove=new mongodb.ObjectID(id);
      collection.remove({_id:toRemove}, function(err, coll) {
        if(err) {
          response.send("error");
        }else if(coll!=undefined){
          response.send(200);
        }
      });
    });
  }
});


app.get('/edit_foods', function(request,response){
  
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  response.set('Content-Type', 'application/json');

  var name = request.query.rest_name;
  if(name != undefined) {
    db.collection('foods', function(er, collection) {
      if(!er) {
        collection.find({rest_name:name}).toArray(function(err, doc){
          if(doc) {
            response.status(200).send(doc);
          }else{
            response.status(200).send('[]');
          }
        });
      }else{
        response.send(500);
      }
    });
  }else{
    response.send("You didn't give us your name!");
  }

});
//TODO: return array of food objects, ordered by distance and filter options
app.get('/foods', function(request, response) {

  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  response.set('Content-Type', 'application/json');

  var entry = '';
  var lat = request.query.lat;
  var lng = request.query.lng;
  var filter = request.query.filter;
  var distance = parseFloat(request.query.distance);
  var foodtags = request.query.flavor;


  if(lat !=undefined || lng != undefined) {
    db.collection('foods', function(er, collection) { 
      if(er) {
        return;
      }
      if(filter == 'off' || filter == undefined){ //No filter case
        collection.find().toArray(function(err, doc) {
          doc.forEach(function(val, index, theArray) {
            val.dist = calc_distance(lat, lng, val.rest_lat, val.rest_lng);
          });
          doc.sort(function(a,b){
            return a.dist - b.dist;
          });
          if (!err) {
            if(doc){    
              response.status(200).send(doc);
            }else{
              response.status(200).send([]);
            }
          }else{
            response.send(500);
          }
        });
      } else if (request.query.flavor != "any") { //Filter but no preference
          tag2 = "this."+request.query.flavor+"=='true'";
          collection.find({'$where':tag2}).toArray(function(err, doc) {
            if (!err) {
              if(doc.length>0){    
                var i = 1;
                doc.forEach(function(val, index, theArray) {
                  val.dist = calc_distance(lat, lng, val.rest_lat, val.rest_lng);
                });
                doc = doc.filter(function(elem){
                  if (elem.dist <= distance) {
                    return true;
                  }
                  else {
                    return false;
                  }
                });
                doc.sort(function(a,b){
                  return a.dist - b.dist
                });
                response.status(200).send(doc);
              }else{
                response.status(200).send([]);
              }
            }else{                
              response.send(500);
            }
          });
        } else { //Filter with preference
          collection.find().toArray(function(err, doc) {
            if (!err) {
              if(doc.length>0){    
                var i = 1;
                doc.forEach(function(val, index, theArray) {
                  val.dist = calc_distance(lat, lng, val.rest_lat, val.rest_lng);
                });
                doc = doc.filter(function(elem) {
                  if (elem.dist <= distance) return true;
                  else return false;
                });
                doc.sort(function(a,b) {
                  return a.dist - b.dist
                });
                response.status(200).send(doc);
              }else{
                response.status(200).send([]);
              }
            } else {                
              response.send(500);
            }
        });
      }
    });
  } else {
    response.status(200).json({'message':'no locations given', "lat":lat, "lng":lng});
  }
});

function calc_distance(myLat, myLng, restLat, restLng) {
    var R = 6371;  //km 
    var x1 = restLat-myLat;
    var dLat = x1 * Math.PI / 180;  
    var x2 = restLng-myLng;
    var dLon = x2 * Math.PI / 180;  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(myLat*Math.PI/180) * Math.cos(restLat *Math.PI/180) * Math.sin(dLon/2) * Math.sin(dLon/2);  
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; 
    d = d * .621371; //to miles 
    d = d.toFixed(5); 
    return d;

}
//TODO: if successful take user to their full page, otherwise back to the login page
/*app.post('/signin', function(request, response){

  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  var username = request.query.username;
  var password = request.query.password;
  db.collection('validate', function(er, collection){


  });
});*/

app.post('/registered', function(request, response) {
  var googleid = request.body.googleid;
  if (!googleid) {
    console.log("Missing googleid field.");
    response.send("Error");
    return;
  }
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  db.collection('restaurants', function(err1, collection) {
    if (err1) {
      console.log("Error in finding collection" + err1);
      response.send("Error");
      return;
    }

    collection.find({"googleid":googleid}).toArray(function(err2, doc){
      if(err2) {
        console.log("MongoDB Find error");
        response.send("Error");
      } else if (doc[0] != undefined) {
        console.log("About to send restname: " + doc[0].name);
        response.send(doc[0].name);
      } else {
        console.log("NotRegistered");
        response.send("NotRegistered");
      }
    });
  });
  // var restid = request.query.restid;
  // db.collection('restaurants', function(er, collection){
  //   collection.find()
  // });
});

// Oh joy! http://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of
app.listen(process.env.PORT || 3000);