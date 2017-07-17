var mongodb = require('./mongodb');
var PersontitleSchema = require('./persontitleschema');
var PersonDAO = require('./personDao')
var db = mongodb.mongoose.connection;

db.on('error', console.error.bind(console, '连接错误:'));
db.on('open', function () {
  console.log('mongodb PersontitleSchema connection is ok!:' + mongodb);
});

//console.log('mongodb Schema:'+Schema);
var Persontitlemodel = PersontitleSchema.Persontitlemodel;

var Persontitle = function () {};

Persontitle.prototype.getetitle=function(id,callback){
  Persontitlemodel.findOne({_id:id},function(err,obj){
      callback(err,obj)
  })
}
//添加一个职务
Persontitle.prototype.sendpersontitle = function (obj, callback) {
  var instance = new Persontitlemodel(obj);
  //console.log('param value:' + obj + '<>instance.save:' + instance);
  instance.save(function (err) {
    callback(err, instance);
  });
};
Persontitle.prototype.sendpersonparent=function(id,parent,callback){
  Persontitlemodel.update({_id:id},{parentTitle:parent},function(err,obj){
    if(err){
      callback(err)
    }else{
      callback(null,obj)
    }
  })
}
//根据职务获取直接职务信息
Persontitle.prototype.getpersontitle=function(id,callback){
  Persontitlemodel.findOne({_id:id},'parentTitle',function(err,obj){
    if(err){
      callback(err)
    }else{
      callback(null,obj)
    }
  })
}
//获取当前人员的直接上级
Persontitle.prototype.getpersontitlelevel=function(title,callback){
  console.log(title);
  Persontitlemodel.findOne({_id:title},function(err,obj){
    if(err){
      callback(err)
    }else{
      // console.log(obj);
      // callback(err,obj)
      Persontitlemodel.find({_id:obj.parentTitle},'name grade',function(perr,pobj){
        callback(null,pobj)
      })
    }
  })
}

//获取某一状态的人员
Persontitle.prototype.getpersonstate= function (status,callback) {
  Persontitlemodel.find({status:status},{personlocations:0},function(err,obj){
    if(err){
      callback(err)
    }else{
      callback(null,obj)
    }
  })
}
//获取所有职务
Persontitle.prototype.getpersontitleTodepartment=function(deoartment,callback){
  Persontitlemodel.find({departmentID:deoartment},'name',function(err,obj){
    if(err){
      callback(err)
    }else{
      callback(null,obj)
    }
  })
}
//获取职务级别
Persontitle.prototype.getpersontitleno=function(id,callback){
  Persontitlemodel.findOne({_id:id},'grade',function(err,obj){
    if(err){
      callback(err)
    }else{
      callback(null,obj)
    }
  })
}



var daoObj = new Persontitle();
//Persontitle.save({
//  departmentID:'123456',//person 的 id
//  parentTitle:'456789',//上级ID
//  name:'名称'//名称
//})
module.exports = daoObj;