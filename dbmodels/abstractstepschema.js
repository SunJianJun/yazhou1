var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

////网格化区域，geojson导入，后期要支持他们的编辑
//var AbstractstepSchema = new Schema({
//  file_template:{template:String,fileName:String},//文档模板
//  power:[{
//    newCase.:[String],
//    updateCase:[String],
//    deleteCase:[String],
//    adotpCase:[String]
//  }],
//  worker:{
//    persons: [{//
//      'name': String,
//      'personID': String
//    }]
//  },
//  name: String,
//  info: String,
//  status: Number,//1生效，0废止
//  timeLimit:Date
//
//});

var AbstractstepSchema = new Schema({//抽象表
    department: String,//部门ID
    type: String,//填写类型
    argument: [{
        argutype: String,//参数类型
        name: String,//参数名称
        value:[String]
    }],//参数,值为参数的类型，这个类型是有限的，至少包括 时间time 地点 location 部门内部人员workers 社会人员peoples 法律法规laws
    wordTemplate: String,//word
    author: String,//id//谁制作的
    power: { //设置审核人员
        new: String, //基本新建和编辑权限
        audit: [{//审核权限
            no:Number,
            title:String
        }]
    },
    createTime:Date,
    status:Number
});
// console.log(AbstractstepSchema);

console.log('mongodb AbstractstepSchema load is ok!:' + AbstractstepSchema);

var Abstractstepmodel = mongodb.mongoose.model("Abstractstep", AbstractstepSchema);
//module.exports= AbstractstepSchema;
//这两行引用方式不一样的
exports.AbstractstepSchema = AbstractstepSchema;
exports.Abstractstepmodel = Abstractstepmodel;