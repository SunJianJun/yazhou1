var mongodb = require('./mongodb');

var PersonModule = require('./personschema');
var Schema = mongodb.mongoose.Schema;
var PersonSchema=PersonModule.PersonSchema;
var tree = require('mongoose-tree');

var DepartmentSchema = new Schema({
	//部门名称
name : String,
	//部门一把手，类型当然是person
// leader : {type: mongodb.mongoose.Schema.Types.ObjectId, ref: 'Person'},//这里即为子表的外键，关联主表。  ref后的blog代表的是主表blog的Model。
// 	//部门副手，数组，类型也是person
// deputyleader : [{type: mongodb.mongoose.Schema.Types.ObjectId, ref: 'Person'}],//这里即为子表的外键，关联主表。  ref后的blog代表的是主表blog的Model。
	//部门直属成员
persons : [{role:String,
    person:{type: mongodb.mongoose.Schema.Types.ObjectId, ref: 'Person'}
}],//这里即为子表的外键，关联主表。  ref后的blog代表的是主表blog的Model。
//deputyleader: {type: mongoose.Schema.Types.ObjectId, ref: 'Person'},//这里即为子表的外键，关联主表。  ref后的blog代表的是主表blog的Model。

    // parent:{type: mongodb.mongoose.Schema.Types.ObjectId, ref: 'Department'},//这里即为子表的外键，关联主表。  ref后的blog代表的是主表blog的Model。
    level:Number,//部门的层级
	//部门下属部门
//subDepartment:[DepartmentSchema],//通过tree插件直接指定，用法见https://github.com/briankircho/mongoose-tree
	//部门介绍
info: String,
	//成立时间
create_date : { type: Date, default: Date.now},
    //废除时间
    delete_date : { type: Date, default: Date.now},
    //状态
    status:Number,//1,正常;0,删除;2解散
    //相关业务流程
processes:Number,
	//详细链接
infoLink:String

});
DepartmentSchema.plugin(tree);

console.log('mongodb DepartmentSchema load is ok!:'+DepartmentSchema);
var Departmentmodel=mongodb.mongoose.model("Department", DepartmentSchema);

//module.exports= DepartmentSchema;
//这两行引用方式不一样的
exports.DepartmentSchema = DepartmentSchema;//相当于本模块导出有两个类
exports.Departmentmodel = Departmentmodel;//相当于本模块导出有两个类