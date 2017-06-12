var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var PanoImgSchema = new Schema({
hpFK:Schema.Types.ObjectId,//文化遗产的id
name : String,
url : String,
date : { type: Date, default: Date.now},
handler: String});


var PanoImgmodel=mongodb.mongoose.model("PanoImg", PanoImgSchema);
//exports.HeritagepointSchema = HeritagepointSchema;
//这两行引用方式不一样的
exports.HeritagepointSchema = PanoImgSchema;
exports.PanoImgmodel = PanoImgmodel;