var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var locationModuler = require('./locationschema');
var locationSchema = locationModuler.LocationSchema;

var MessageSchema = new Schema({
    text: String,
    type: String,//broadcast 或者 message(默认) 或者abnormal  或者 event
    create_date: {type: Date, default: Date.now},
    images: {
        coverSmall: String,
        coverBig: String
    },
    eventstepID:String,
//异常状态也是一种消息
    abnormaldecision: String,//approve；reject,
    abnormalID: String,//唯一标示异常值的id，如果给多人发，通过这个就可以把多条信息全部设为已读
//请假事由 由message.text兼任
    abnormalStartTime: {type: Date, default: Date.now},
    abnormalEndTime: {type: Date, default: Date.now},
    abnormalShiftPersonId: String,//换班人员id
    abnormald: String,//一个异常具有唯一的id，这个id表示这个异常是同一个，用于如果请假申请发给同一级的多人时

    image: String,
    voice: String,
    video: String,
    sender: {type: mongodb.mongoose.Schema.Types.ObjectId, ref: 'Person'},
    receiver: {type: mongodb.mongoose.Schema.Types.ObjectId, ref: 'Person'},
    status: Number,//0，未读，1，已读,
    location: [locationSchema],
    messageTemplate: String
    /**/
});

console.log('mongodb MessagemodelSchema load is ok!:' + MessageSchema);
var Messagemodel = mongodb.mongoose.model("Message", MessageSchema);
//module.exports= PersonSchema;
//这两行引用方式不一样的
// exports.PersonSchema = PersonSchema;


exports.Messagemodel = Messagemodel;

exports.MessageSchema = MessageSchema;