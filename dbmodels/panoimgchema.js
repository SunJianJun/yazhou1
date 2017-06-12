var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var PanoImgSchema = new Schema({
hpFK:Schema.Types.ObjectId,//文化遗产的id
name : String,
url : String,
date : { type: Date, default: Date.now},
handler: String});

PanoImgSchema.index({ loc: "2dsphere" });

exports.PanoImgSchema = PanoImgSchema;