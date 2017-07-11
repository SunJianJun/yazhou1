var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var HeritagepointSchema = new Schema({
name : String,
location : [Number],
icon : String,
info:String,
des: String});


var Heritagepointmodel=mongodb.mongoose.model("Heritagepoint", HeritagepointSchema);
//exports.HeritagepointSchema = HeritagepointSchema;
//这两行引用方式不一样的
exports.HeritagepointSchema = HeritagepointSchema;
exports.Heritagepointmodel = Heritagepointmodel;