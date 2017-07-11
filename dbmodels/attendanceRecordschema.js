var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

var attendanceRecordSchema = new Schema({
  person: String,//person 的 id
  checkdate:Date,//正常记录，到天，只比较天
  /**
   * abnormal true,检查各个时间段，影响考勤规则，否则，直接读考勤状态
   */
  askforleave: { //请假
    reason: String,//请假理由
    startDateTime: Date,
    endDateTime: Date
  },//[startDateTime,endDateTime],//比如6月25请假
  shift: {//换班
    startDateTime: Date,
    endDateTime: Date,
    alternateattendanceRecord: String//换班人
  },
  abnormal: Boolean,// default false
  //每次考勤规则运算只有唯一的考勤状态
  status: {//考勤结果
    type: Number,//1,正常;0离职;2请假;3旷工
    default: 1
  },
  times: Number,//次条记录对应当天检查次数
  checkdescription: {//描述信息 ，考勤时间段
    startDateTime: Date,
    endDateTime: Date
  }//描述
});

console.log('mongodb attendanceRecordSchema load is ok!:' + attendanceRecordSchema);
var attendanceRecordmodel = mongodb.mongoose.model("attendanceRecord", attendanceRecordSchema);
//module.exports= attendanceRecordSchema;
//这两行引用方式不一样的
exports.attendanceRecordSchema = attendanceRecordSchema;
exports.attendanceRecordmodel = attendanceRecordmodel;