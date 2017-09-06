var mongodb = require('./mongodb');
var attendanceRecordSchema = require('./attendanceRecordschema');
var departmentDAO = require('./departmentDAO');
var db = mongodb.mongoose.connection;
db.on('error', console.error.bind(console, '连接错误:'));
db.once('open', function () {
  console.log('mongodb connection is ok!:' + mongodb);
});
var attendanceRecordmodel = attendanceRecordSchema.attendanceRecordmodel;

console.log('mongodb attendanceRecord model is ok?:' + mongodb.mongoose.model("attendance_Record"));
//for(var i in attendanceRecord){console.log("attendanceRecord model items："+i+"<>")};

var attendanceRecordDAO = function () {};

attendanceRecordDAO.prototype.save = function (obj, outcallback) {
  // 终端打印如下信息
  var callback=outcallback?outcallback:function(oerr,oobj){};
  var instance = new attendanceRecordmodel(obj);
  instance.save(function(err, obj){
    if (err) {
      callback(err);
    } else {
      callback(null, obj)
    }
  });
};
//向考勤表添加考勤记录
attendanceRecordDAO.prototype.getpersoncheckworktodate = function (personid,date,data, callback) {
  // console.log(data.area)

  attendanceRecordmodel.findOne({person:personid, checkdate: date}, function (err, obj) {
    if (obj) {
      attendanceRecordmodel.update({person: personid, checkdate: date},
        data,
        function (err, obj) {
          if (obj) {
            callback(null, obj)
          } else {
            callback(err, null)
          }
        })
    } else {
      var instance = new attendanceRecordmodel(data);
      instance.save(function (err, obj){
        if (obj) {
          callback(null, obj)
        }else{
          callback(err, null)
        }
      })
    }
  })
}
//正常上班检查记录照片
attendanceRecordDAO.prototype.sendpersonimg = function(personid,date,route,callback){
  attendanceRecordmodel.findOne({person:personid,checkdate:date},function(err,obj){
    if(obj) {
      obj.personcheckimg.push({images: route, checkdate: new Date})
      attendanceRecordmodel.update({person: personid, checkdate: date},
        {personcheckimg:obj.personcheckimg},
        function (err, obj) {
          if (obj) {
            callback(null, obj)
          } else {
            callback(err, null)
          }
        })
    }else{
      var instance = new attendanceRecordmodel({person: personid, checkdate: date, personcheckimg: [{images: route, checkdate: new Date}]});
      instance.save(function (err, obj) {
        if (obj) {
          callback(null, obj)
        } else {
          callback(err, null)
        }
      })
    }
  })
}
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

// daoObj.save({
//  person: '123456',
//  checkdate: new Date(),
//  askforleave: {reason: '无理由请假', startDateTimeTime: new Date(), endDateTime: new Date()},
//  abnormal: false,
//  times: 1,//次条记录对应当天检查次数
//  checkdescription: {//描述信息
//    startDateTime: new Date(),
//    endDateTime: new Date()
//  }
// }, function (err, obj) {
// })
// daoObj.sendpersonimg('58e0c199e978587014e67a50','2017-09-1','img/abc.jpg',function (err,obj) {
//   console.log(err,obj)
// })


module.exports = daoObj;