var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var PersonModule = require('./personschema');

//网格化区域，geojson导入，后期要支持他们的编辑
var GridareaSchema = new Schema({
name : String,
	status:Number,//1生效，0废止
    'geometry' : {
        type: {type: String},
        'coordinates' : {
            'type' : [Number],
            'index' : '2dsphere',
            'required' : true
        }
    },
    'properties' : {
        'name' : String
    },
	persons:[{
		role:String,
		onDutyTime: { type: Date, default: Date.now},
		offDutyTime: { type: Date},
        person:{type: mongodb.mongoose.Schema.Types.ObjectId, ref: 'Person'}
	}]
});


console.log('mongodb GridareaSchema load is ok!:'+GridareaSchema);
var Gridareamodel=mongodb.mongoose.model("Gridarea", GridareaSchema);
//module.exports= GridareaSchema;
//这两行引用方式不一样的
exports.GridareaSchema = GridareaSchema;
exports.Gridareamodel = Gridareamodel;