var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var PersonModule = require('./personschema');

//网格化区域，geojson导入，后期要支持他们的编辑
var SpotareaSchema = new Schema({
  name: String,
  type: String,
  status: Number,//1生效，0废止
  'geometry': {
    type: {type: String},
    'coordinates': {
      'type': [Number],
      'index': '2dsphere',
      'required': true
    }
  },
  'properties': {
    'name': String
  },
  persons: [{
    'name': String,
    'personID': String,
    'time': [{
      'timeStart': String,
      'timeEnd': String,
      'frequency': Number
    }]
    // role:String,
    // onDutyTime: { type: Date, default: Date.now},
    // offDutyTime: { type: Date},
    // person:{type: mongodb.mongoose.Schema.Types.ObjectId, ref: 'Person'}
  }],
  create_date:Date
});

// console.log(SpotareaSchema);

console.log('mongodb SpotareaSchema load is ok!:' + SpotareaSchema);

var Spotareamodel = mongodb.mongoose.model("Spotarea", SpotareaSchema);
//module.exports= SpotareaSchema;
//这两行引用方式不一样的
exports.SpotareaSchema = SpotareaSchema;
exports.Spotareamodel = Spotareamodel;