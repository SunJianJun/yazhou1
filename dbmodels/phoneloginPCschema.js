var mongodb = require('./mongodb');

var Schema = mongodb.mongoose.Schema;
var tree = require('mongoose-tree');

var phoneloginPCSchema = new Schema({
	//部门名称
    person:String,//登录人ID
    status:Number,//手机确认是否登陆
    location:[Number],//登录人位置
    loginTime:Date,//登录时间
    createTime:Date,
    checkcode:String//校验码，服务器端生成
});


var phoneloginPCmodel=mongodb.mongoose.model("phoneloginPC", phoneloginPCSchema);

//module.exports= DepartmentSchema;
//这两行引用方式不一样的
exports.phoneloginPCSchema = phoneloginPCSchema;//相当于本模块导出有两个类
exports.phoneloginPCmodel = phoneloginPCmodel;//相当于本模块导出有两个类