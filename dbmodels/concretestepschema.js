var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;


var ConcretestepSchema = new Schema({//事件详情步骤表
  name:String,
  type:String,//从哪个事件步骤来的
  status:Number,//1：表示有效步骤  2：正在进行的步骤 3：已完成的步骤
  no:Number,
  argu:[String],//详细参数
  wordTemplate:String,//含有变量序号的word模板，是从这个步骤的type定义中复制过来的，显示时会从【argu数组】中读取值，自动嵌入


  power: { //审核人员
    new: String, //基本新建和编辑权限
    audit: [{//审核权限
      no:Number,
      title:String,//审核职务
      person:String,//审核人员
      powertime:Date,//审核时间
      text:String//签字内容
    }]
  },

  responsible:String,//这个步骤当前的责任人，发起人员，负责填写
  currentPusher:String,//推动者，步骤审核人员，//只记录title
  updatetime:Date
})

console.log('mongodb ConcretestepSchema load is ok!:' + ConcretestepSchema);

var Concretestepmodel = mongodb.mongoose.model("Concretestep", ConcretestepSchema);
//module.exports= ConcretestepSchema;
//这两行引用方式不一样的
exports.ConcretestepSchema = ConcretestepSchema;
exports.Concretestepmodel = Concretestepmodel;