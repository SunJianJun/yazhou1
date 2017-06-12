var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

// //网格化区域，geojson导入，后期要支持他们的编辑
// var ConcreteeventSchema = new Schema({
//   name: String,
//   info: String,
//   status: Number,//1生效，0废止
//   create_date:Date,
//   persons: [{//
//     'name': String,
//     'personID': String
//   }],
//   process: [{
//     'types': String, 'status': Number,effective_date:Date,obsolete_date:Date}]//流程集合
// });
var ConcreteeventSchema=new Schema({
  type:String,//从哪个事件类型那里来的
  name:String,
  newer:String,//更新
  step:[{types:String,
  		 status:Number
  }],
  status:Number//完结状态是当且仅当所有步骤的状态为完结时才完结
})

console.log('mongodb ConcreteeventSchema load is ok!:' + ConcreteeventSchema);

var Concreteeventmodel = mongodb.mongoose.model("Concreteevent", ConcreteeventSchema);
//module.exports= ConcreteeventSchema;
//这两行引用方式不一样的
exports.ConcreteeventSchema = ConcreteeventSchema;
exports.Concreteeventmodel = Concreteeventmodel;