var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;



var PersontitleSchema = new Schema({
  departmentID:String,//department 的 id
  parentTitle:String,//上级ID
  name:String//名称
});
// var options={};
// persontitleSchema.plugin(deepPopulate, options );/* more on options below */

console.log('mongodb persontitleSchema load is ok!:' + PersontitleSchema);
var Persontitlemodel = mongodb.mongoose.model("Persontitle", PersontitleSchema);
//module.exports= persontitleSchema;
//这两行引用方式不一样的
exports.PersontitleSchema = PersontitleSchema;
exports.Persontitlemodel = Persontitlemodel;