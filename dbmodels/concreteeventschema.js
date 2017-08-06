var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;


var ConcreteeventSchema=new Schema({//事件表
  type:String,//从哪个事件类型那里来的
  name:String,
  newer:Date,//更新日期
  step:[String], //步骤ID
  //    [{types:String,
  //		 status:Number, //是否正在进行
  //		 caseID:String //步骤ID
  //}],
  status:Number,// 1表示完结， 完结状态是当且仅当所有步骤的状态为完结时才完结
  // 1：表示未完成  2：正在进行的步骤 3:正在审核的步骤 4：已完成的步骤

  createTime:Date, //建立日期
  ediTime:Date,  //结束日期
  department:String,//事件归属部门
  people:[String],//事件参与人员
  position:[Number],
  createperson:String
});

console.log('mongodb ConcreteeventSchema load is ok!:' + ConcreteeventSchema);

var Concreteeventmodel = mongodb.mongoose.model("Concreteevent", ConcreteeventSchema);
//module.exports= ConcreteeventSchema;
//这两行引用方式不一样的
exports.ConcreteeventSchema = ConcreteeventSchema;
exports.Concreteeventmodel = Concreteeventmodel;