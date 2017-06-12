var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

////网格化区域，geojson导入，后期要支持他们的编辑
//var ConcreteabstractSchema = new Schema({
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

var Concreteabstractschema = new Schema({//抽象表
  type:{
    person:[String],
    addTime:Date,
    place:String, //地点
    statute:[String]//法规
  },//类型
  argument:String,//参数
  order:Number  //序号
})
// console.log(ConcreteabstractSchema);

console.log('mongodb ConcreteabstractSchema load is ok!:' + ConcreteabstractSchema);

var Concreteabstractmodel = mongodb.mongoose.model("Concreteabstract", ConcreteabstractSchema);
//module.exports= ConcreteabstractSchema;
//这两行引用方式不一样的
exports.ConcreteabstractSchema = ConcreteabstractSchema;
exports.Concreteabstractmodel = Concreteabstractmodel;