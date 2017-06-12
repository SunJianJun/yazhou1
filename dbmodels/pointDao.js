var mongodb = require('./mongodb');
var PointSchema = require('./pointschema');
var db = mongodb.mongoose.connection; 
db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){
  
console.log('mongodb connection is ok!:'+mongodb);
});
    

//console.log('mongodb Schema:'+Schema);

var Pointmodel = mongodb.mongoose.model("Point", PointSchema);


console.log('mongodb Point model is ok?:'+mongodb.mongoose.model("Point"));
//for(var i in Point){console.log("Point model items："+i+"<>")};
var PointDAO = function(){};

PointDAO.prototype.save = function(obj, callback) {
	Pointmodel.create();
	// 终端打印如下信息
console.log('called Point save');
var instance = new Pointmodel(obj);
console.log('instance.save:'+instance.name);
instance.save(function(err){
	console.log('save Point'+instance+' fail:'+err);
callback(err);
});
};

PointDAO.prototype.findByName = function(name, callback) {
Pointmodel.findOne({name:name}, function(err, obj){
callback(err, obj);
});
};




module.exports = new PointDAO();