var mongodb = require('./mongodb');
var attendanceRecordSchema = require('./attendanceRecordschema');
var departmentDAO = require('./departmentDAO');
var db = mongodb.mongoose.connection;
db.on('error', console.error.bind(console, '连接错误:'));
db.once('open', function () {
  console.log('mongodb connection is ok!:' + mongodb);
});
var attendanceRecordmodel = attendanceRecordSchema.attendanceRecordmodel;

console.log('mongodb attendanceRecord model is ok?:' + mongodb.mongoose.model("attendanceRecord"));
//for(var i in attendanceRecord){console.log("attendanceRecord model items："+i+"<>")};
var attendanceRecordDAO = function () {
};

attendanceRecordDAO.prototype.save = function (obj, callback) {
  // 终端打印如下信息
  var instance = new attendanceRecordmodel(obj);
  instance.save(function (err, obj) {
    if (err) {
      callback(err);
    } else {
      callback(null, obj)
    }
  });
};
//请假
attendanceRecordDAO.prototype.sendpersonaskforleave = function (obj, callback) {
  var instance = new attendanceRecordmodel(obj);
  instance.save(function (err, obj) {
    if (err) {
      callback(err)
    } else {
      callback(null, obj)
    }
  })
}
//正常上班记录
attendanceRecordDAO.prototype.sendpersoncheckdate = function (obj, callback) {
  var instance = new attendanceRecordmodel(obj);
  instance.save(function (err, obj) {
    if (err) {
      callback(err)
    } else {
      callback(null, obj)
    }
  })
};
//添加换班记录
attendanceRecordDAO.prototype.sendpersonshift = function (ID, start, end, shift, callback) {

  var instance = new attendanceRecordmodel(obj);
  instance.save(function (err, obj) {
    if (err) {
      callback(err)
    } else {
      callback(null, obj)
    }
  })
};
//人员脱岗记录
attendanceRecordDAO.prototype.sendperson = function (obj, callback) {
  var instance = new attendanceRecordmodel(obj);
  instance.save(function (err, obj) {
    if (err) {
      callback(err)
    } else {
      callback(null, obj)
    }
  })
};

//获取一个人员考勤记录
attendanceRecordDAO.prototype.getpersonrecordtoid = function (ID, start, end, callback) {
  //console.log(ID,start,end)
  attendanceRecordmodel.find({
    person: ID,
    "$and": [{checkdate: {$gt: start}}, {checkdate: {$lt: end}}]
  }, function (err, obj) {
    if (err) {
      callback(err);
    } else {
      callback(null, obj);
    }
  });
};
//获取部门人员考勤记录
attendanceRecordDAO.prototype.getpersonrecordTodepartment = function (ID, start, end, callback) {
  //console.log(ID);
  departmentDAO.getPersonsByDepartmentID(ID, function (err, obj) {
    if (err) {
      callback(err)
    } else {
      for(var aa=0,perID=[];aa<obj.length;aa++){
        perID.push(obj[aa]._id)
      }
      //callback(null,obj)
      attendanceRecordmodel.find({
        person:{$in:perID},"$and": [{checkdate: {$gt: start}}, {checkdate: {$lt: end}}]
      }, function (err, obj) {
          if(err){
            callback(err);
          }else{
            callback(null, obj);
          }
      });
    }
  })
};

var daoObj = new attendanceRecordDAO();
//daoObj.save({
//  person: '123456',
//  checkdate: new Date(),
//  askforleave: {reason: '无理由请假', startDateTimeTime: new Date(), endDateTime: new Date()},
//  abnormal: false,
//  times: 1,//次条记录对应当天检查次数
//  checkdescription: {//描述信息
//    startDateTime: new Date(),
//    endDateTime: new Date()
//  }
//}, function (err, obj) {
//})


module.exports = daoObj;