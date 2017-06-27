var mongodb = require('./mongodb');
var PersontitleSchema = require('./persontitleschema');//这里相当于PersontitleSchema的export，真正要引用PersontitleSchema，应该这样PersontitleSchema.PersontitleSchema
var db = mongodb.mongoose.connection;

db.on('error', console.error.bind(console, '连接错误:'));
db.on('open', function () {
  console.log('mongodb PersontitleSchema connection is ok!:' + mongodb);
});

//console.log('mongodb Schema:'+Schema);
var Persontitlemodel = PersontitleSchema.Persontitlemodel;

var Persontitle = function () {};

//存储用户
Persontitle.prototype.save = function (obj, callback) {
  var callback = callback?callback : function (err, obj) {
    //console.log('callback得到人员最新位置：'+obj.geolocation);
    if(err){
      console.log(err)
    }else{
      console.log(obj)
    }
  };
  var instance = new Persontitlemodel(obj);
  //console.log('param value:' + obj + '<>instance.save:' + instance);
  instance.save(function (err) {
    //console.log('save Person' + instance + ' fail:' + err);
    callback(err, instance);
  });
};



var daoObj = new Persontitle();
//daoObj.save({
//  departmentID:"58c3a5e9a63cf24c16a50b8c",//person 的 id
//  parentTitle:'',//上级ID
//  name:'局长'//名称
//})
//daoObj.save({
//  departmentID:"58c3a5e9a63cf24c16a50b8c",//person 的 id
//  parentTitle:'',//上级ID
//  name:'副局长'//名称
//})
//daoObj.save({
//  departmentID:"58c3a5e9a63cf24c16a50b8c",//person 的 id
//  parentTitle:'',//上级ID
//  name:'雇员'//名称
//})
//daoObj.save({
//  departmentID:"58c3a5e9a63cf24c16a50b8c",//person 的 id
//  parentTitle:'',//上级ID
//  name:'副大队长'//名称
//})
//daoObj.save({
//  departmentID:"58c3a5e9a63cf24c16a50b8c",//person 的 id
//  parentTitle:'',//上级ID
//  name:'雇员'//名称
//})
//daoObj.save({
//  departmentID:"58c3a5e9a63cf24c16a50b8c",//person 的 id
//  parentTitle:'',//上级ID
//  name:'中队长'//名称
//})
module.exports = daoObj;