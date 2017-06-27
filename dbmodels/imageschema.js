var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
/**
 * Book类，代表一个书本.
 * @constructor
 * @param {string} title - 书本的标题.
 * @param {string} author - 书本的作者.
 */
var ImageSchema = new Schema({
url : String,
filename : String,
create_date : { type: Date, default: Date.now},
imglocation: {
    type: [Number],  // [<longitude>, <latitude>]
    index: '2d'      // create the geospatial index
    }
});
/**/

console.log('mongodb ImageSchema load is ok!:'+ImageSchema);
var Imagemodel=mongodb.mongoose.model("Image", ImageSchema);
//module.exports= ImageSchema;
//这两行引用方式不一样的
exports.ImageSchema = ImageSchema;
exports.Imagemodel = Imagemodel;