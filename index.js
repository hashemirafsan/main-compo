/*
* Leading University App
* REST API
* Author : Hashemi Rafsan
*/

'use strict';
const express = require('express');
const helmet = require('helmet');
const _ = require('lodash');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var md5 = require('md5');

/*
* SECURE API USING HELMET
*/
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(helmet()); //initial helmet here
app.use(helmet.noCache()); //nocache
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"]
  }
}));
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// Connection URL 
var con = 'mongodb://hashemirafsan:01625903501RrR@ds133249.mlab.com:33249/userinfo';



/*
* HELPING METHOD
*/
var reGinsert = function(db,data,res,callback){
	// Get the documents collection 
  var collection = db.collection('user_info');
  collection.insert(data , function(err, result) {
    assert.equal(err, null);
    res.contentType('application/json');
    res.json({status:res.statusCode,result:data.token.activeToken});
    callback(result);
  });
}

var select = function(db,data,res,callback){
  var collection = db.collection('user_info');
  // Find some documents 
  collection.find(data).toArray(function(err, docs) {
    assert.equal(err, null);
    if(err){
    	res.contentType('application/json');
    	res.json({result:"nothing"});
    }else{
    	res.contentType('application/json');
    	res.json({status:res.statusCode,result:docs});
    }
    callback(docs);
	});
}

var updateToken = function(db,data,res,callback){
  var collection = db.collection('user_info');
  // Find some documents 
 collection.update(
  data, // query
  {$set: {status:{accStatus: 1,activeStatus: 0}}}, // replacement, replaces only the field "hi"
  function(err, object) {
      if (err){
        res.contentType('application/json');
        res.json({result:"nothing"});  // returns error if no matching object found
      }else{
        res.contentType('application/json');
        res.json({status:res.statusCode,result:object});
      }
  });
}



var deletes = function(){

}

var success = function(res,reason){
	return res.json({status:res.statusCode,result:[{data:reason+" successfully done."}]});
}

var errors = function(){

}

/*
* GET REST API
*/

router.get('/user.checkid&id=:id',function(req,res){
  let data = {
    id:parseInt(req.params.id)
  }
  MongoClient.connect(con, function(err, db) {
    assert.equal(null, err);
    select(db,data,res,function(){
      db.close();
    });
    db.close();
  });
});

router.get('/user.checkemail&email=:email',function(req,res){
  let data = {
    email:req.params.email
  }
  MongoClient.connect(con, function(err, db) {
    assert.equal(null, err);
    select(db,data,res,function(){
      db.close();
    });
    db.close();
  });
});


//

/*
* POST REST API
*/
router.post('/user.registration&id=:id&email=:email&bat=:bat&bday=:bday&pass=:pass', function (req, res, next) {

  var data = {
    id:Number(req.params.id),
    email:req.params.email,
    batch:req.params.bat,
    bday:req.params.bday,
    pass:md5(req.params.pass),
    security:{
      question:null,
      answer:null
    },
    status:{
      accStatus:0,
      activeStatus:0
    },
    token:{
      activeToken:Math.floor((Math.random() * 999999) + 99999),
      uniToken:md5(Number(req.params.id) + new Date())
    } 
  }
     MongoClient.connect(con, function(err, db) {
      assert.equal(null, err);
      reGinsert(db,data,res,function(){
        db.close();
      });
      db.close();
    });
  });
router.post('/user.login&id=:id&pass=:pass',function(req,res){
  let data = {

    id:parseInt(req.params.id),
    pass:md5(req.params.pass)
  }
  MongoClient.connect(con, function(err, db) {
    assert.equal(null, err);
    select(db,data,res,function(){
      db.close();
    });
    db.close();
  });

});

router.post('/user.activeVerify&activeToken=:activeToken&uniToken=:uniToken',function(req,res){
  let data = {
      token:{
       activeToken:parseInt(req.params.activeToken),
       uniToken:req.params.uniToken
    }
  }
  MongoClient.connect(con, function(err, db) {
    assert.equal(null, err);
    updateToken(db,data,res,function(){
      db.close();
    });
    db.close();
  });
});

/*
* PUT REST API
*/



/*
* DELETE REST API
*/



/*
* ROUTER INITIAL PART
*/
app.use(express.static(__dirname + '/views'));
app.use('/api', router);



/*
* DISABLE PART
*/
app.disable('x-powered-by');



/*
* INDEX PART START
*/

app.listen(process.env.PORT || 3000,  () => {
  console.log('app start');
});
