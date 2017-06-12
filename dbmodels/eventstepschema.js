var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var locationModuler=require('./locationschema');
var locationSchema=locationModuler.LocationSchema;

var EventstepSchema = new Schema({
text : String,

create_date : { type: Date, default: Date.now},
images :{
coverSmall:String,
coverBig:String,
},
image:String,
voice :String,
video:String,
sender:{type: mongodb.mongoose.Schema.Types.ObjectId, ref: 'Person'},
receiver:{type: mongodb.mongoose.Schema.Types.ObjectId, ref: 'Person'},
status:Number,//0，未读，1，已读,
location: [locationSchema],
    eventstepTemplate:String
/**/
});

console.log('mongodb EventstepmodelSchema load is ok!:'+EventstepSchema);
var  Eventstepmodel=mongodb.mongoose.model("Eventstep", EventstepSchema);
//module.exports= PersonSchema;
//这两行引用方式不一样的
// exports.PersonSchema = PersonSchema;
exports.Eventstepmodel = Eventstepmodel;

exports.EventstepSchema = EventstepSchema;