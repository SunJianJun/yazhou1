var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

var attendanceRecordSchema = new Schema({
  person:String,//person 的 id
  normal:[Date],//正常记录，到天，只比较天
  /*
   * abnormal true,检查各个时间段，影响考勤规则，否则，直接读考勤状态
   */
  leave:[{stratDateTime:Date,endDateTime:Date}],//[stratDateTime,endDateTime],//比如6月25请假
  shift:[{stratDateTime:Date,endDateTime:Date,alternateattendanceRecord:String}],//[],//换班
  abnormal:Boolean,// default false
  //每次考勤规则运算只有唯一的考勤状态
  status:{type: Number, default:1},//1,正常;0离职;2请假;3旷工
  times:1,
  description:{stratDateTime:String,endDateTime:String}//描述，考勤时间段
});
// var options={};
// attendanceRecordSchema.plugin(deepPopulate, options );/* more on options below */

console.log('mongodb attendanceRecordSchema load is ok!:' + attendanceRecordSchema);
var attendanceRecordmodel = mongodb.mongoose.model("attendanceRecord", attendanceRecordSchema);
//module.exports= attendanceRecordSchema;
//这两行引用方式不一样的
exports.attendanceRecordSchema = attendanceRecordSchema;
exports.attendanceRecordmodel = attendanceRecordmodel;