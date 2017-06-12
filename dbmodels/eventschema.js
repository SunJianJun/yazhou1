var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var EventSchema = new Schema({
personFK:Schema.Types.ObjectId,
text : String,

create_date : { type: Date, default: Date.now},
images :{
coverSmall:String,
coverBig:String,
},
voice :String,
video:String,

    //所在网格化区域
    gridgeometry : {type: mongodb.mongoose.Schema.Types.ObjectId, ref: 'Gridarea'}
//这里即为子表的外键，关联主表。  ref后的blog代表的是主表blog的Model。

    /**/
});


exports.EventSchema = EventSchema;