var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

var LocationSchema = new Schema({
positioningdate : { type: Date, default: Date.now},
SRS:{ type: String, default: '4326'},
geolocation: {
    type: [Number],  // [<longitude>, <latitude>]
    index: '2dsphere'      // create the geospatial index
    }
});
/**/

console.log('mongodb LocationSchema load is ok!:'+LocationSchema);
var Locationmodel=mongodb.mongoose.model("Location", LocationSchema);
//module.exports= LocationSchema;
//这两行引用方式不一样的
exports.LocationSchema = LocationSchema;
exports.Locationmodel = Locationmodel;