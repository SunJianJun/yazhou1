var mongodb = require('./mongodb');
var attendanceRecordSchema = require('./attendanceRecordschema');
var db = mongodb.mongoose.connection;
db.on('error', console.error.bind(console, '连接错误:'));
db.once('open', function () {
  console.log('mongodb connection is ok!:' + mongodb);
});
var attendanceRecordmodel = attendanceRecordSchema.attendanceRecordmodel;

console.log('mongodb attendanceRecord model is ok?:' + mongodb.mongoose.model("attendanceRecord"));
//for(var i in attendanceRecord){console.log("attendanceRecord model items："+i+"<>")};
var attendanceRecordDAO = function (){};

attendanceRecordDAO.prototype.save = function (obj, callback) {
  // 终端打印如下信息
  console.log('called attendanceRecord save');
  var instance = new attendanceRecordmodel(obj);
  console.log('instance.save:' + instance.name);
  instance.save(function (err,obj) {
    if(err){
      console.log('save attendanceRecord' + instance + ' fail:' + err);
      //callback(err);
    }else{
      console.log('添加记录')
    }
  });
};
//请假
attendanceRecordDAO.prototype.sendleave=function(callback){

}
attendanceRecordDAO.prototype.findByName = function (name, callback) {
  attendanceRecordmodel.findOne({name: name}, function (err, obj) {
    callback(err, obj);
  });
};
var daoObj=new attendanceRecordDAO();
//daoObj.save({
//  person:'123456',
//  checkdate:new Date().toLocaleDateString(),
//  leave:{reason:'无理由请假',startDateTimeTime:new Date(),endDateTime:new Date()},
//  abnormal:false,
//  status:1,
//  times:1,//次条记录对应当天检查次数
//  checkdescription:{//描述信息
//    startDateTime:new Date(),
//    endDateTime:new Date()}
//})


module.exports = daoObj;