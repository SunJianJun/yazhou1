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

//添加一个职务
Persontitle.prototype.sendpersontitle = function (obj, callback) {
  var instance = new Persontitlemodel(obj);
  //console.log('param value:' + obj + '<>instance.save:' + instance);
  instance.save(function (err) {
    callback(err, instance);
  });
};

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
Persontitle.prototype.getAllpersontitle=function(callback){
  Persontitlemodel.find({},'name',function(err,obj){
    if(err){
      callback(err)
    }else{
      callback(null,obj)
    }
  })
}

//根据部门查找人员
//获取所有用户  批量修改status
var getAllUser = function () {
  Persontitlemodel.remove({status: 1}).exec(function (err, objs) {
    console.log('-------------')
    if (!err) {
      // for(var i=0;i<objs.length;i++) {
      //  Persontitlemodel.update({status:0},{$set:{'status':8}},function(err,res){
      //    if(!err){
      //      console.log('修改');
      //      console.log(res);
      //      //callback(err,res);
      //    }
      //    else {
      //      console.log('没有数据');
      //      //callback(err,0);
      //    }
      //  })
      // }
      //objs.forEach(function (value, key) {
      //  console.log(value.name)
      //})
      //console.log(objs.length)
      //
      departmentModel.update({status:1},{persons:[1]},function(err,dep){
        //console.log(dep[0].info)
        console.log('删除完成')
      })
    }
  })
}
//getAllUser();

var daoObj = new Persontitle();
//Persontitle.save({
//  departmentID:'123456',//person 的 id
//  parentTitle:'456789',//上级ID
//  name:'名称'//名称
//})
module.exports = daoObj;