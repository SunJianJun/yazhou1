var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var locationModuler=require('./locationschema');
var locationSchema=locationModuler.LocationSchema;

var MessageSchema = new Schema({
text : String,
type:String,//broadcast 或者 message(默认)
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
    messageTemplate:String
/**/
});

console.log('mongodb MessagemodelSchema load is ok!:'+MessageSchema);
var  Messagemodel=mongodb.mongoose.model("Message", MessageSchema);
//module.exports= PersonSchema;
//这两行引用方式不一样的
// exports.PersonSchema = PersonSchema;
exports.Messagemodel = Messagemodel;

exports.MessageSchema = MessageSchema;