var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;



var legalregulationsSchema = new Schema({
  department:mongodb.mongoose.Schema.Types.ObjectId,//department 的 id
  lawname:String,//法规名称
  lawlist:[String],//法规内容名称
  setwho:String,
  status:{type:Number,default:1},
  create_date:Date,
  newer:Date,//更新日期
  grade:Number//法律等级 1：国家级 2：省级 3：市级 4：区级 5：临时
});
// var options={};
// legalregulationsSchema.plugin(deepPopulate, options );/* more on options below */

console.log('mongodb legalregulationsSchema load is ok!:' + legalregulationsSchema);
var Legalregulationsmodel = mongodb.mongoose.model("legalregulations", legalregulationsSchema);
//module.exports= legalregulationsSchema;
//这两行引用方式不一样的
exports.legalregulationsSchema = legalregulationsSchema;
exports.Legalregulationsmodel = Legalregulationsmodel;