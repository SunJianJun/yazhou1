var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;



var persontitleSchema = new Schema({
  departmentID:String,//department 的 id
  parentTitle:String,//上级ID
  name:String//名称
});
// var options={};
// persontitleSchema.plugin(deepPopulate, options );/* more on options below */

console.log('mongodb persontitleSchema load is ok!:' + persontitleSchema);
var Persontitlemodel = mongodb.mongoose.model("persontitle", persontitleSchema);
//module.exports= persontitleSchema;
//这两行引用方式不一样的
exports.persontitleSchema = persontitleSchema;
exports.Persontitlemodel = Persontitlemodel;