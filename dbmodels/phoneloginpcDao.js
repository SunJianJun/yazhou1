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
//获取上级部门ID
PhoneloginPCDAO.prototype.getParent = function (obj, callback) {
  PhoneloginPCmodel.find({_id: obj}, 'path', function (err, obj) {
    if (err) {
      callback(err);
    } else {
      callback(null, obj);
    }
  })
};
//添加上级部门path
PhoneloginPCDAO.prototype.addparentpath = function (_id, path, callback) {
  PhoneloginPCmodel.update({_id: _id}, {path: path}, function (err, obj) {
    if (err) {
      callback(err)
    } else {
      callback(null, obj)
    }
  })
}

//修改部门名称
PhoneloginPCDAO.prototype.updatephoneloginPCname = function (id, name, callback) {
  PhoneloginPCmodel.update({_id: id}, {name: name}, function (err, obj) {
    if (err) {
      callback(null)
    } else {
      callback(null, obj)
    }
  })
}
//修改部门信息
PhoneloginPCDAO.prototype.updatephoneloginPCinfo = function (id, newInfo, callback) {
  PhoneloginPCmodel.update({_id: id}, newInfo, function (err, obj) {
    if (err) {
      callback(null)
    } else {
      callback(null, obj)
    }
  })
}
//修改部门状态
PhoneloginPCDAO.prototype.updatephoneloginPCinfo = function (id, status, callback) {
  PhoneloginPCmodel.update({_id: id}, {status: status}, function (err, obj) {
    if (err) {
      callback(null)
    } else {
      callback(null, obj)
    }
  })
}

var dptObj = new PhoneloginPCDAO();
//dptObj.save({person:'123456',logintime:new Date()},function(err,obj){console.log(obj)})


module.exports = dptObj;