var mongodb = require('./mongodb');
var PhoneloginPCModule = require('./phoneloginPCschema');//文件名用小写
var db = mongodb.mongoose.connection;
var PersonSchema = require('./personschema');//这里相当于PersonSchema的export，真正要引用PersonSchema，应该这样PersonSchema.PersonSchema
var Personmodel = PersonSchema.Personmodel;

db.on('error', console.error.bind(console, '连接错误:'));
db.on('open', function () {
  console.log('mongodb PhoneloginPCSchema connection is ok!:' + mongodb);
});
var PhoneloginPCmodel = PhoneloginPCModule.phoneloginPCmodel;
//PhoneloginPCmodel= mongodb.mongoose.model("PhoneloginPC", PhoneloginPCSchema);

var PhoneloginPCDAO = function () {};

PhoneloginPCDAO.prototype.save = function (obj, callback) {
  //PhoneloginPCmodel.create();
  // 终端打印如下信息
  var instance = new PhoneloginPCmodel(obj);
  instance.save(function (err, iobj) {
    if (err) {
      callback(err);
    } else {
      callback(null, iobj)
    }
  });
  //return instance.get('_id');
};

PhoneloginPCDAO.prototype.getlanglogin= function (obj, callback) {
  PhoneloginPCmodel.findOne({_id: obj},function (err, obj) {
    if (err) {
      callback(err);
    } else {
      callback(null, obj);
    }
  })
};
//移动端扫描，修改信息
PhoneloginPCDAO.prototype.sendphonelogin = function (_id,person, callback) {
  PhoneloginPCmodel.update({_id: _id},{person:person},function (err, obj) {
    if (err) {
      callback(err)
    } else {
      callback(null, obj)
    }
  })
}
PhoneloginPCDAO.prototype.removeoverduetime=function(id,callback){
  PhoneloginPCmodel.remove({_id:{$in:id}},function(err,obj){
    if(err){
      callback(err)
    }else{
      callback(null,obj)
    }
  })
}

var dptObj = new PhoneloginPCDAO();
//dptObj.save({person:'123456',logintime:new Date()},function(err,obj){console.log(obj)})


module.exports = dptObj;