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



/*
* SECURE API USING HELMET
*/
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
    	res.json({result:"nothing"});
    }else{
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
