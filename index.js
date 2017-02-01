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
var mailer = require('express-mailer');


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
var insert = function(db,data,callback){
	// Get the documents collection 
  var collection = db.collection('user_info');
  collection.insert(data , function(err, result) {
    assert.equal(err, null);
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

var update = function(){

}



var deletes = function(){

}

var success = function(res,reason){
	return res.json({status:res.statusCode,result:[{data:reason+" successfully done."}]});
}

var errors = function(){

}

mailer.extend(app, {
  from: 'no-reply@example.com',
  host: 'smtp.gmail.com', // hostname 
  secureConnection: true, // use SSL 
  port: 465, // port for secure SMTP 
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
  auth: {
    user: 'rafsanhashemi@gmail.com',
    pass: '01625903501RrR'
  }
});
/*
* GET REST API
*/
router.get('/user.login&id=:id&pass=:pass',function(req,res){
	let data = {
		id:parseInt(req.params.id),
		name:req.params.pass
	}
	MongoClient.connect(con, function(err, db) {
	  assert.equal(null, err);
	 	select(db,data,res,function(){
	 		db.close();
	 	});
	  db.close();
	});

});

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

//user.registration&id=:id&em=:em&bat=:bat&bday=:bday&pass=:pass
router.get('/user.registration&em=:em', function (req, res, next) {
  var data = {
    id:151425262
  }
  app.mailer.send('registration', {
    to: req.params.em, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
    subject: 'Registration Confirmation', // REQUIRED. 
    otherProperty: data // All additional properties are also passed to the template as local variables. 
  }, function (err) {
    if (err) {
      // handle error 
      console.log(err);
      res.send('There was an error sending the email');
      return;
    }
    res.send('Email Sent');
  });
 });
/*
* POST REST API
*/



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
