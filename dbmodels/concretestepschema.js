var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

// //网格化区域，geojson导入，后期要支持他们的编辑
// var ConcretestepSchema = new Schema({
//   name: String,
//   info: String,
//   status: Number,//1生效，0废止
//   create_date:Date,
//   persons: [{//
//     'name': String,
//     'personID': String
//   }],
//   'steps': [{
//     'types': String,
//     'status': Number,
//     prev_step:String,
//     next_step:String
//   }]//流程集合
// })
// console.log(ConcretestepSchema);
var ConcretestepSchema = new Schema({
  name:String,
  type:String//从哪个事件步骤来的
  status:Number,
  argu:[String],
  wordTemplate:String,//含有变量序号的word模板，是从这个步骤的type定义中复制过来的，显示时会从【argu数组】中读取值，自动嵌入
  currentPusher:String//这个步骤当前的责任人（推动者，不管是负责填写，还是负责审批，总之有且只有一个责任人，要不然一个事就完不了了）
})

console.log('mongodb ConcretestepSchema load is ok!:' + ConcretestepSchema);

var Concretestepmodel = mongodb.mongoose.model("Concretestep", ConcretestepSchema);
//module.exports= ConcretestepSchema;
//这两行引用方式不一样的
exports.ConcretestepSchema = ConcretestepSchema;
exports.Concretestepmodel = Concretestepmodel;