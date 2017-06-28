var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var PointSchema = new Schema({
personFK:Schema.Types.ObjectId,
name : String,
des : String,
create_date : { type: Date, default: Date.now},
loc: {
        type: { type: String },
        coordinates: { type: [Number] }
}});

PointSchema.index({ loc: "2dsphere" });

exports.PointSchema = PointSchema;