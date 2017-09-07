/**
 *
 * @type {exports|module.exports}
 */
var schedule = require('node-schedule');
var geolib = require('geolib');
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

//考勤开始日期和结束日期
var checkworkstarttime = new Date(new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(0)).setMinutes(0));
var checkworkendtime = new Date(new Date(new Date().setHours(0)).setMinutes(0));
var countobj;

/*
 * 简单的时间考勤判断
 * @param personId - 人员id
 * @param startTime - 开始时间
 * @param endTime - 结束时间
 * @param callback -回调函数，获取人员在指定时间内的定位信息是否存在，如果有，有多少次，如果没有，返回false
 */
var simpleTimeCheck = function (personId, startTime, endTime, callback) {


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
var simpleAreaCheck = function (person, area, callback) {
  //personDAO
  console.log(area)
  var personinfo = area.person[0];
  var workcount=0;
  console.log(personinfo.time[0].timeStart.slice(2, 4))
  for (var aa = 0; aa < person.length; aa++) {
    console.log(personinfo.time[0].timeStart.slice(2, 4) + ',' + personinfo.time[0].timeEnd.slice(2, 4) + ',' + new Date(person[aa].time).getHours())
    if (!(personinfo.time[0].timeStart.slice(2, 4) <= new Date(person[aa].time).getHours() && personinfo.time[0].timeEnd.slice(2, 4) <= new Date(person[aa].time).getHours())) {
      console.log('在工作时间内')
      var isPointInside = geolib.isPointInside(
        {lat: person[aa].lat, lon: person[aa].lon},
        area.geometry[0].coordinates
      )
      if(isPointInside)workcount++;
      console.log('返回结果' + isPointInside)
    }
  }
  console.log('存在次数'+workcount)
  return workcount;
  //判断是否在区域
  // var isPointInside = geolib.isPointInside(
  //   {lat: 51.5125, lon: 7.485}, [
  //     {lat: 51.50, lon: 7.40},
  //     {lat: 51.555, lon: 7.40},
  //     {lat: 51.555, lon: 7.625},
  //     {lat: 51.5125, lon: 7.625}
  //   ]
  // )
  // console.log('返回结果' + isPointInside)
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
//解析地图中存的坐标
var parseGeojsonFromDb = function (jsonstr) {
  var processedPath = new Array();
  if (jsonstr) {
    var temp = jsonstr.geometry[0].coordinates;
    var jjj = 0;
    for (var indexd = 0; indexd < temp.length - 1; indexd += 2) {
      var tmm = parseFloat(temp[indexd].toFixed(6));
      var tmm2 = parseFloat(temp[indexd + 1].toFixed(6));
      processedPath[jjj] = {lat: tmm, lon: tmm2};//用firefox可以看到，之前数组元素是object，必须变成array（2）才能被高德识别
      jjj++;
    }
    jsonstr.geometry[0].coordinates = processedPath
  }
  //console.log(polyArray);
  return jsonstr;
}
//解析区域绑定人员的时间
//获取人员被安排巡逻的区域和时间
var personsoptarea = function (personID, callback) {
  spotareaDAO.getASpotareatoperson(personID, function (err, obj) {
    if (err) {
      console.log({error: err})
    } else {
      callback(null, obj);
    }
  })
};

//获取人员被安排巡逻的区域和时间
// personsoptarea('58e0c199e978587014e67a50', function (err, obj) {
//   if (err) {
//     console.log({error: err})
//   } else {
//     console.log('--------------------------------------------------');
//     // console.log(obj);
//     for (var i = 0; i < obj.length; i++) {
//       var time = obj[i].person[0].time;
//       for (var j = 0; j < time.length; j++) {
//         console.log(time[j]);
//         var checkworkstarttimeday = checkworkstarttime.getDay() ? checkworkstarttime.getDay() : '7';//如果取到的是星期0，就改为7
//         console.log(time[j].timeStart.slice(0, 1) + ',' + checkworkstarttimeday);
//         if (time[j].timeStart.slice(0, 1) == checkworkstarttimeday) {
//           console.log('当天安排的地区')
//
//           // console.log(parseGeojsonFromDb(obj[i]))
//           console.log(parseGeojsonFromDb(obj[i]).geometry[0].coordinates)
//         }
//       }
//     }
//   }
// })
var kqjs = function (obj, dinw) {
  for (var i = 0; i < obj.length; i++) {
    var time = obj[i].person[0].time;
    for (var j = 0; j < time.length; j++) {
      console.log(time[j]);
      var checkworkstarttimeday = checkworkstarttime.getDay() ?checkworkstarttime.getDay() : '7';//如果取到的是星期0，就改为7
      console.log(time[j].timeStart.slice(0, 1) + ',' + checkworkstarttimeday);
      if (time[j].timeStart.slice(0, 1) == checkworkstarttimeday) {
        console.log('当天安排的地区---')

        var formatarea=parseGeojsonFromDb(obj[i]);//格式化服务器存储的坐标后
        // console.log(parseGeojsonFromDb(obj[i]).geometry[0].coordinates)
        var count=simpleAreaCheck(dinw.allLocationPoints,formatarea)//空间考勤判断,返回次数

        countobj.workcount=count;
        countobj.area=[{//考勤区域
          name: formatarea.name[0],
          geometry:formatarea.geometry[0].coordinates,
          time:formatarea.person[0].time
        }];
      }
    }
  }
}

// var start = new Date('2017-6-1'), end = new Date('2017-7-2');
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
})
/*
 //得到所有待考勤人员

 //向考勤表添加考勤记录
 var record = function (personid, route, date, callback) {
 attendanceRecordDAO.getpersoncheckworktodate(personid, route, date, function (err, obj) {

 })
 }
 // console.log('向考勤表添加考勤记录')
 //获取到所有人员，开始统计当天考勤记录
 personDAO.getAllUser(function (personerr, personobj) {
 var personcount = 0;
 var personlength = personobj.length-1;
 var personfunction = function () {
 var acallback = function (err, obj) {
 if (obj) {
 if (personcount < personlength) {
 personcount++;
 personfunction()
 }
 }
 }
 if (personobj[personcount]._id == '58e0c199e978587014e67a50') {
 if (personobj[personcount].status == 2) {

 // record(personobj[personcount]._id,'img/abc.html','2017-9-2',acallback)

 } else if (personobj[personcount].status == 1) {
 // record(personobj[personcount]._id,'img/abc.html','2017-9-2',acallback)
 //取到当前人员的定位点
 personDAO.countByPersonLocations(personobj[personcount]._id, checkworkstarttime, checkworkendtime, 'day', function (checkerr, checkobj) {
 if (!checkerr) {
 checkobj[0].allLocationPoints

 //获取人员被安排巡逻的区域和时间
 personsoptarea(personobj[personcount]._id, function (err, obj) {
 if (err) {
 console.log({error: err})
 } else {
 console.log('--------------------------------------------------');
 // console.log(obj);
 for (var i = 0; i < obj.length; i++) {
 var time = obj[i].person[0].time;
 for (var j = 0; j < time.length; j++) {
 console.log(time[j]);

 }
 }
 }
 })
 }
 })
 }
 }else{
 if (personcount < personlength) {
 personcount++;
 personfunction();
 }
 }
 }
 personfunction();
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
 */


//得到所有待考勤人员

//向考勤表添加考勤记录
var record = function (personid, date, data, callback) {
  attendanceRecordDAO.getpersoncheckworktodate(personid, date, data, function (err, obj) {
    if(err){
      console.log(err)
    }else{

      console.log(obj)
    }
  })
}
// console.log('向考勤表添加考勤记录')
//获取到所有人员，开始统计当天考勤记录
personDAO.getAllUser(function (personerr, personobj) {
  var personcount = 0;
  var personlength = personobj.length - 1;
  var personfunction = function () {
    var acallback = function (err, obj) {
      if (obj) {
        if (personcount < personlength) {
          personcount++;
          personfunction()
        }
      }
    }
    countobj={};
    if (personobj[personcount]._id == '58e0c199e978587014e67a50') {

      if (personobj[personcount].status == 2) {//长期假期的人员

        // record(personobj[personcount]._id,'2017-9-2',acallback)

      } else if (personobj[personcount].status == 1){
        //取到当前人员的定位点
        // console.log(personobj[personcount]._id, checkworkstarttime, checkworkendtime)
        personDAO.countByPersonLocations(personobj[personcount]._id, checkworkstarttime, checkworkendtime, 'day', function (checkerr, checkobj) {
          if (!checkerr) {
            // checkobj[0].allLocationPoints
            // console.log(checkobj)
            console.log('--------------------------------------------------');
            //获取人员被安排巡逻的区域和时间
            personsoptarea(personobj[personcount]._id, function (err, obj) {
              if (err) {
                console.log({error: err})
              } else {
                // console.log(obj);
                kqjs(obj, checkobj[0]);
                countobj.name=personobj[personcount].name;
                countobj.person=personobj[personcount]._id;
                countobj.checkdate=checkobj[0]._id;
                countobj.position=checkobj[0].allLocationPoints;
                console.log('需要存储的数据')
                console.log(countobj)
                record(personobj[personcount]._id,countobj.checkdate,countobj)
              }
            })
          }
        })
      }
    } else {
      if (personcount < personlength) {
        personcount++;
        personfunction();
      }
    }
  }
  // personfunction();
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


//var gg = schedule.scheduleJob(rule2, function(){
//    console.log('第二次运行!');
//});


module.exports = j;