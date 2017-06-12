var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

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
});

console.log('mongodb ImageSchema load is ok!:'+ImageSchema);
var Imagemodel=mongodb.mongoose.model("Image", ImageSchema);
//module.exports= ImageSchema;
//这两行引用方式不一样的
exports.ImageSchema = ImageSchema;
exports.Imagemodel = Imagemodel;