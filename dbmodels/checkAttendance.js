/**
 *
 * @type {exports|module.exports}
 */
var schedule = require('node-schedule');
var geolib=require('geolib');
//【{考勤时间段1：startTime；考勤时间段2：}】

var rule = new schedule.RecurrenceRule();
//rule.minute = 42;
// rule.dayOfWeek = [0, new schedule.Range(4, 6)];
// rule.hour = 17;
//rule.second = 10;

//var rule2 = new schedule.RecurrenceRule();
// rule.minute = 42;
//// rule.dayOfWeek = [0, new schedule.Range(4, 6)];
//// rule.hour = 17;
//rule2.second = 20;


//获取人员的数据模型
var personDAO = require('./personDAO.js');
var attendanceRecordDAO = require('./attendanceRecordDAO.js');
var spotareaDAO = require('./spotareaDao');
console.log('再次加载')

/*
 * 简单的时间考勤判断
 * @param personId - 人员id
 * @param startTime - 开始时间
 * @param endTime - 结束时间
 * @param callback -回调函数，获取人员在指定时间内的定位信息是否存在，如果有，有多少次，如果没有，返回false
 */
var simpleTimeCheck = function (personId, startTime, endTime, callback) {
  personDAO.getPersonLatestPositionInTimespan(personId, startTime, endTime, function (err, obj) {
    if (err) {
      callback(err)
    } else {
      if (obj) {
        callback(null, obj.length)
      } else {
        callback(null, obj)
      }
    }
  });

};
// simpleTimeCheck("58e0c199e978587014e67a50",'2017-7-1','2017-7-3',function(err,obj){
//    console.log(obj)
// })
/*
 * 简单的空间考勤判断
 * @param personId - 人员id
 * @param area - 指定的空间区域
 * @param callback -回调函数，获取人员在指定区域内的定位信息是否存在，如果有，有多少次，如果没有，返回false
 */
var simpleAreaCheck = function (personId, area, callback) {
  //personDAO

  //判断是否在区域
  var isPointInside=geolib.isPointInside(
    {lat: 51.5125, lon: 7.485},[
      {lat: 51.50, lon: 7.40},
      {lat: 51.555, lon: 7.40},
      {lat: 51.555, lon: 7.625},
      {lat: 51.5125, lon: 7.625}
    ]
  )
  console.log('返回结果'+isPointInside)
};

/*
 * 空间和时间复合式考勤判断
 * @param personId - 人员id
 * @param area - 指定的空间区域
 * @param callback -回调函数，获取人员在指定区域内的定位信息是否存在，如果有，有多少次，如果没有，返回false
 */
var areaTimeCheck = function (personId, startTime, endTime, area, callback) {

};
/*
 * 考勤异常状态的直接处理
 * @param personId - 人员id
 * @param startTime - 开始时间
 * @param endTime - 结束时间
 * @param callback -回调函数，如果在此时间段内存在考勤异常状态，则返回考勤状态，如果不存在，返回false
 */
var abnormalCheck = function (personId, startTime, endTime, callback) {
  console.log('有异常，更新记录');
};

//解析区域绑定人员的时间
//获取人员被安排巡逻的区域和时间
var personsoptarea = function (e) {
  var obj = e;
}


var start = new Date('2017-6-1'), end = new Date('2017-7-2');
//attendanceRecordDAO.getpersonrecordtoid("58e0c199e978587014e67a50",start,end,function(err,obj){//取异常记录
//    if(err){
//        console.log(null)
//    }else{
//        console.log(obj);
//    }
//})

//spotareaDAO.getASpotareatoperson('58e0c199e978587014e67a50', function (err, obj) {
//    //console.log(obj)
//    for(var i=0;i<obj.length;i++){
//        console.log(obj[i].geometry)
//    }
//});


//personDAO.getpersondaycheck(start,end,function (err, yobj) {//获取到一天内有定位记录的人ID和位置
//    if (err) {
//        console.log(err);
//    } else {
//console.log(yobj)
//得到所有待考勤人员
personDAO.getAllUser(function (err, aobj) {
  console.log('所有人员有：' + aobj.length + '个人');
})
// }
//});


var j = schedule.scheduleJob(rule, function () {
  //得到所有待考勤人员
  var record=function (personid) {
    attendanceRecordmodel.findOne({person:personid, checkdate: date}, function (err, obj) {
      if (obj) {
        obj.personcheckimg.push({images: route, checkdate: new Date})
        attendanceRecordmodel.update({person: personid, checkdate: date},
          {personcheckimg: obj.personcheckimg},
          function (err, obj) {
            if (obj) {
              callback(null, obj)
            } else {
              callback(err, null)
            }
          })
      } else {
        var instance = new attendanceRecordmodel({
          person: personid,
          checkdate: date,
          personcheckimg: [{images: route, checkdate: new Date}]
        });
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
  //获取到所有人员，开始统计当天考勤记录
  personDAO.getAllUser(function (personerr, personobj) {
    for (var aa = 0; aa < personobj.length; aa++) {
      if (personobj[aa].status == 2) {

        record(personobj[aa]._id)

      } else if (personobj[aa].status == 1) {
        personDAO.countByPersonAttendences(personobj[aa]._id, start, end, timespan, function () {

        })
      }
    }
  })

  // for(所有人){

  //先判断AttendanceRecordDAO指定时间段内有没有考勤异常（请假和换班），有，continue则直接更新一条考勤状态，没有再进入下面的考勤规则计算

  //for(
  //多少中考勤状态（规则）
  //自定义的数组，每个考勤状态都得有明确的考勤规则可以计算出来，比如迟到，就是某段时间内的前半个小时某人未出现在某地
  // )
  //对一个人计算一种考勤规则，实现方法是通过PesonDao查询和判断一段时间内的位置，spotareaDAo也会有关系

  //在callback中更新一个人的考勤状态，实现方法是通过AttendanceRecordDAO更新考勤状态表
  // }
  //console.log('The answer to life, the universe, and everything!');
  // personDAO.countByPersonLocations()//获取人员一定时间定位点
});

//var gg = schedule.scheduleJob(rule2, function(){
//    console.log('第二次运行!');
//});


module.exports = j;