var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

////网格化区域，geojson导入，后期要支持他们的编辑
//var AbstracttypeSchema = new Schema({
//  file_template:{template:String,fileName:String},//文档模板
//  power:[{
//    newCase.:[String],
//    updateCase:[String],
//    deleteCase:[String],
//    adotpCase:[String]
//  }],
//  worker:{
//    persons: [{//
//      'name': String,
//      'personID': String
//    }]
//  },
//  name: String,
//  info: String,
//  status: Number,//1生效，0废止
//  timeLimit:Date
//
//});

var AbstracttypeSchema = new Schema({//抽象事件
  typeName:String,//事件类型
  steps:[{no:Number,step:String}],//步骤的ID
  newer:Date,//更新
  setDate:Date,
  createparent:String,
  status:Number//1正常 0删除
})
// console.log(AbstracttypeSchema);

console.log('mongodb AbstracttypeSchema load is ok!:' + AbstracttypeSchema);

var Abstracttypemodel = mongodb.mongoose.model("Abstracttype", AbstracttypeSchema);
//module.exports= AbstracttypeSchema;
//这两行引用方式不一样的
exports.AbstracttypeSchema = AbstracttypeSchema;
exports.Abstracttypemodel = Abstracttypemodel;