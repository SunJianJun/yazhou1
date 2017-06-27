var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

// var deepPopulate = require('mongoose-deep-populate')(mongodb.mongoose);
var locationModuler = require('./locationschema');
var locationSchema = locationModuler.LocationSchema;
/*
 { name: '奥巴马',
 sex: '男，',
 nation: '肯尼亚卢欧族',
 birthday: '1968-08-04',
 residence: '华盛顿市区中心宾夕法尼亚大街16＂号',
 idNum: '123456196108041236',
 side: 'obverse' }
 $rootScope.curUser={
 name:'string',			//姓名
 sex:'string',			//性别
 nation:'string',		//民族
 birthday:'string',		//生日
 residence:'string',		//住所
 idNum:'string',			//身份证号码
 side:'string',		//值为'obverse'

 idUrl:'string',			//身份证图片地址
 phoneNum:'string',			//手机号码
 phoneUUID:'string'		//手机UUID
 };
 */
// 执法一
// { '办公室': 
//    [ { id: '1',
//        name: '陈树康',
//        sex: '男',
//        role: '大队长',
//        mobile: '13876660127',
//        ifparty: '是',
//        idNum: '460200198401274719' },
//      { id: '2',
//        name: '王荣邦',
//        sex: '男',
//        role: '副大队长',
//        mobile: '13876030141',
//        ifparty: false,
//        idNum: '460200198007050012' }
var PersonSchema = new Schema({
  name: String,
  sex: String,
  nation: String,
  birthday: String,
  residence: String,
  idNum: String,
  mobileUUid: String,
  title:String,//指向persontitle表,//职务
  mobile: Number,
  age: Number,
  create_date: {type: Date, default: Date.now},
  images: {
    coverSmall: String,
    coverBig: String
  },
//所在部门
  departments: [{
    role: String, //权限 worker
    department: {type: mongodb.mongoose.Schema.Types.ObjectId, ref: 'Department'}
  }],//这里即为子表的外键，关联主表。  ref后的blog代表的是主表blog的Model。

  source: String,
  link: String,
  lastmessageFK: Schema.Types.ObjectId,
  lastLocationFK: Schema.Types.ObjectId,
  lastmessage: String,
  //状态
  status: {type: Number, default: 1},//1,正常;0离职;2请假;3旷工;4待审核   //测试用户 9,正常;8离职
  personlocations: [locationSchema],
  pwd: String
});
// var options={};
// PersonSchema.plugin(deepPopulate, options );/* more on options below */

console.log('mongodb PersonSchema load is ok!:' + PersonSchema);
var Personmodel = mongodb.mongoose.model("Person", PersonSchema);
//module.exports= PersonSchema;
//这两行引用方式不一样的
exports.PersonSchema = PersonSchema;
exports.Personmodel = Personmodel;