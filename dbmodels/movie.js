var mongodb = require('./mongodb');
var MovieSchema = require('./movieschema.js');
var db = mongodb.mongoose.connection; 

db.on('error',console.error.bind(console,'连接错误:'));
db.on('open',function(){
  
console.log('mongodb movieschema connection is ok!:'+mongodb);
});
    /**/


console.log('mongodb MovieSchema load is ok!:'+MovieSchema);

var Moviemodel = mongodb.mongoose.model("Movie", MovieSchema);

console.log('mongodb Movie model is ok?:'+mongodb.mongoose.model("Movie"));

//for(var i in Movie){console.log("Movie model items："+i+"<>")};
var MovieDAO = function(){};

MovieDAO.prototype.save = function(obj, callback) {
	Moviemodel.create();
	// 终端打印如下信息
console.log('called movie save');
var instance = new Moviemodel(obj);
console.log('instance.save:'+instance.name);
instance.save(function(err){
	console.log('save movie'+instance+' fail:'+err);
callback(err);
});
};


MovieDAO.prototype.findByName = function(name, callback) {
Moviemodel.findOne({name:name}, function(err, obj){
callback(err, obj);
});
};


module.exports = new MovieDAO();