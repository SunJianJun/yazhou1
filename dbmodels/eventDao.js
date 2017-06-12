var mongodb = require('./mongodb');
var EventSchema = require('./eventschema');
var db = mongodb.mongoose.connection; 
db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){
  
console.log('mongodb connection is ok!:'+mongodb);
});
    

//console.log('mongodb Schema:'+Schema);

var Eventmodel = mongodb.mongoose.model("Event", EventSchema);


console.log('mongodb Event model is ok?:'+mongodb.mongoose.model("Event"));
//for(var i in Event){console.log("Event model items："+i+"<>")};
var EventDAO = function(){};

EventDAO.prototype.save = function(obj, callback) {
	Eventmodel.create();
	// 终端打印如下信息
console.log('called Event save');
var instance = new Eventmodel(obj);
console.log('instance.save:'+instance.name);
instance.save(function(err){
	console.log('save Event'+instance+' fail:'+err);
callback(err);
});
};

EventDAO.prototype.findByName = function(name, callback) {
Eventmodel.findOne({name:name}, function(err, obj){
callback(err, obj);
});
};




module.exports = new EventDAO();