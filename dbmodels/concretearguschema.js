﻿var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;


//每一个具体的参数
var ConcretearguSchema = new Schema({//word模板参数
  // 参数的具体值，虽然有很多种可能，但是只有一个具体值
  value:[String],
  // {
  //   personOutsideSystem:[String],//{name,idNum,residential},
  //   personInsideSystem:String,//objId,
  //   addTime:Date,
  //   place:String, //地点
  //   statute:[String]//法规
  // },
  // 值在哪个属性上，这里指示
  type:String,
  setTime:Date,
  setByWho:String,//这个参数是谁设置的
  promptvalue:String,//参数提示
  identified:String//表示这个值是输入了个人签名密码的
})
// console.log(ConcretearguSchema);

console.log('mongodb ConcretearguSchema load is ok!:' + ConcretearguSchema);

var Concreteargumodel = mongodb.mongoose.model("Concreteargu", ConcretearguSchema);
//module.exports= ConcretearguSchema;
//这两行引用方式不一样的
exports.ConcretearguSchema = ConcretearguSchema;
exports.Concreteargumodel = Concreteargumodel;