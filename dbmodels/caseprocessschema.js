var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

//网格化区域，geojson导入，后期要支持他们的编辑
var CaseprocessSchema = new Schema({
  name: String,
  info: String,
  status: Number,//1生效，0废止
  create_date:Date,
  persons: [{//
    'name': String,
    'personID': String
  }],
  'steps': [{
    'types': String,
    'status': Number,
    prev_step:String,
    next_step:String
  }]//流程集合
});
// console.log(CaseprocessSchema);

console.log('mongodb CaseprocessSchema load is ok!:' + CaseprocessSchema);

var Caseprocessmodel = mongodb.mongoose.model("Caseprocess", CaseprocessSchema);
//module.exports= CaseprocessSchema;
//这两行引用方式不一样的
exports.CaseprocessSchema = CaseprocessSchema;
exports.Caseprocessmodel = Caseprocessmodel;