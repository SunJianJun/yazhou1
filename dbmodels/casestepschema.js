var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

//网格化区域，geojson导入，后期要支持他们的编辑
var CasestepSchema = new Schema({
  file_template:{template:String,fileName:String},//文档模板
  power:[{
    newCase:[String],
    updateCase:[String],
    deleteCase:[String],
    adotpCase:[String]
  }],
  worker:{
    persons: [{//
      'name': String,
      'personID': String
    }]
  },
  name: String,
  info: String,
  status: Number,//1生效，0废止
  timeLimit:Date

});
// console.log(CasestepSchema);

console.log('mongodb CasestepSchema load is ok!:' + CasestepSchema);

var Casestepmodel = mongodb.mongoose.model("Casestep", CasestepSchema);
//module.exports= CasestepSchema;
//这两行引用方式不一样的
exports.CasestepSchema = CasestepSchema;
exports.Casestepmodel = Casestepmodel;