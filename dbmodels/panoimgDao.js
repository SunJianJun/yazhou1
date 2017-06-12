var mongodb = require('./mongodb');
var PanoImgSchema = require('./panoimgschema');
var db = mongodb.mongoose.connection; 
db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){
  
console.log('mongodb connection is ok!:'+mongodb);
});
    
var PanoImgmodel=PanoImgSchema.PanoImgmodel;

console.log('mongodb PanoImg model is ok?:'+PanoImgmodel);
//for(var i in PanoImg){console.log("PanoImg model items："+i+"<>")};
var PanoImgDAO = function(){};

PanoImgDAO.prototype.save = function(obj, callback) {
//PanoImgmodel.create();
	// 终端打印如下信息
console.log('called PanoImg save');
var instance = new PanoImgmodel(obj);
console.log('instance.save:'+instance.name);
instance.save(function(err){
	console.log('save PanoImg'+instance+' fail:'+err);
callback(err);
});
};

PanoImgDAO.prototype.findByName = function(name, callback) {
PanoImgmodel.findOne({name:name}, function(err, obj){
callback(err, obj);
});
};
//用文化遗产id来查询相关全景图
PanoImgDAO.prototype.findByhpID = function(hpId, callback) {
console.log('调用了PanoImgDAO.prototype.findByhpID :'+hpId);
PanoImgmodel.find({hpFK:hpId}, function(err, obj){
callback(err, obj);
});
};

//用id来删除
PanoImgDAO.prototype.removeById = function(id, callback) {
console.log('调用了PanoImgDAO.prototype.removeById :'+id);
PanoImgmodel.remove({_id:id}, function(err, obj){
callback(err, obj);
});
};

//根据id更新全景图
PanoImgDAO.prototype.updateById=function(panoimg,callback){
	console.log('called Person update id:'+panoimg._id);

  var _id = panoimg._id; //需要取出主键_id
  delete panoimg._id;    //再将其删除
  Personmodel.update({_id:_id},panoimg,function(err,obj){
	callback(err, obj);
	});
  //此时才能用Model操作，否则报错
};


module.exports = new PanoImgDAO();