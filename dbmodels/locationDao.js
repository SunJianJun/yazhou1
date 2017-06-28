var mongodb = require('./mongodb');
var LocationSchema = require('./personschema');//这里相当于LocationSchema的export，真正要引用LocationSchema，应该这样LocationSchema.LocationSchema
var db = mongodb.mongoose.connection; 

db.on('error',console.error.bind(console,'连接错误:'));
db.on('open',function(){
  
console.log('mongodb LocationSchema connection is ok!:'+mongodb);
});
    

//console.log('mongodb Schema:'+Schema);
var Locationmodel=LocationSchema.Locationmodel;
//Locationmodel= mongodb.mongoose.model("Location", LocationSchema);
console.log('mongodb Location model is ok?:'+mongodb.mongoose.model("Location"));
//for(var i in Location){console.log("Location model items："+i+"<>")};
/*
var testperson={
		    'name': '123',
				'alias':'123',
				'title':'123',
				'mobile':'123123',
				'age':'123'
		};
*/
var LocationDAO = function(){};

LocationDAO.prototype.save = function(obj, callback) {
	//Locationmodel.create();
	// 终端打印如下信息
console.log('called Location save');
var instance = new Locationmodel(obj);
console.log('param value:'+obj+'<>instance.save:'+instance);
instance.save(function(err){
	console.log('save Location'+instance+' fail:'+err);
callback(err);
});
};

LocationDAO.prototype.findByFileName = function(name, callback) {
Locationmodel.findOne({filename:name}, function(err, obj){
callback(err, obj);
});
};

//根据位置查找图片，coords为二维数组，先经度后纬度
LocationDAO.prototype.findByLocation = function(coords, callback) {
	var maxDistance=0.01;//查找半径
	  Locationmodel.find({
      imglocation: {
        $near: coords,
        $maxDistance: maxDistance
      }
    },function(err, images) {
    		if(!err){		
						callback(err, images);
					}else{
						callback(err, null);
					}
    	});
};

LocationDAO.prototype.updateById=function(person,callback){
	console.log('called Location update id:'+person._id);

  var _id = person._id; //需要取出主键_id
  delete person._id;    //再将其删除
  Locationmodel.update({_id:_id},person,function(err,obj){
	callback(err, obj);
	});
  //此时才能用Model操作，否则报错
};

LocationDAO.prototype.findByMobile = function(mobile, callback) {
	
console.log('called Location findOne by mobile'+mobile);
Locationmodel.findOne({'mobile':'321'}, function(err, obj){
callback(err, obj);
console.log(' Location findout:'+obj);
});
};


module.exports = new LocationDAO();