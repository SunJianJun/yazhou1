var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

////网格化区域，geojson导入，后期要支持他们的编辑
//var ConcretearguSchema = new Schema({
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

var ConcretearguSchema = new Schema({//word模板参数
  type:{
    person:[String],
    addTime:Date,
    place:String, //地点
    statute:[String]//法规
  },
  value:String,
  setTime:Date,
  setByWho:String,//这个参数是谁设置的
  identified:String//表示这个值是输入了个人签名密码的
})
// console.log(ConcretearguSchema);

console.log('mongodb ConcretearguSchema load is ok!:' + ConcretearguSchema);

var Concreteargumodel = mongodb.mongoose.model("Concreteargu", ConcretearguSchema);
//module.exports= ConcretearguSchema;
//这两行引用方式不一样的
exports.ConcretearguSchema = ConcretearguSchema;
exports.Concreteargumodel = Concreteargumodel;