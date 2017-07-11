﻿/**
 *
 * @type {exports|module.exports}
 */
var schedule = require('node-schedule');
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
var spotareaDAO = require('./spotareaDao')
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
//simpleTimeCheck("58e0c199e978587014e67a50",'2017-7-1','2017-7-3',function(err,obj){
//    console.log(obj)
//})
/*
 * 简单的空间考勤判断
 * @param personId - 人员id
 * @param area - 指定的空间区域
 * @param callback -回调函数，获取人员在指定区域内的定位信息是否存在，如果有，有多少次，如果没有，返回false
 */
var simpleAreaCheck = function (personId, area, callback) {
    //personDAO
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
    console.log('有异常，更新记录')
};

//解析区域绑定人员的时间
//获取人员被安排巡逻的区域和时间
var personsoptarea=function(e){
    var obj=e;
    if(obj.length) {
        for (var d = 0; d < obj.length; d++) {
            var person = obj[d].person[0];
            //console.log(person)
            person.time.forEach(function(val,key){
                console.log(val)
            })
            //for(var f=0;f<person.time.length;f++){
            //    //console.log(person[e].time)
            //    console.log(f)
            //}
        }
    }
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
    console.log('所有人员有：' + aobj.length);
    var personcount = 0;
    var jiazai = function () {
        attendanceRecordDAO.getpersonrecordtoid(aobj[personcount]._id, start, end, function (err, obj) {//判断当天是否有异常状态
            if (err) {
                console.log(null)
            } else {
                if (!obj.length) {
                    console.log('没有异常记录，开始计算')
                    console.log(aobj[personcount]._id);
                    if (aobj[personcount]._id == '58e0c199e978587014e67a50') {
                        console.log('---------------------------------------------------')
                    }
                    //console.log(obj);//有异常，更新一天考勤记录
                    spotareaDAO.getASpotareatoperson(aobj[personcount]._id, function (err, obj) {//获取到
                        if (err) {

                        } else {
                            personsoptarea(obj)//获取人员被安排巡逻的区域和时间
                                personcount++;
                                if (personcount < 13) {// aobj.length) {
                                    jiazai();
                                } else {
                                    return;
                                }
                        }
                    })
                    /*
                     personDAO.getPersonLatestPositionInTimespan(aobj[personcount]._id,start,end,function(err,onejilu){//得到人员这段时间的位置
                     if(err){

                     }else{
                     console.log(aobj[personcount]._id);
                     console.log(onejilu)
                     if(onejilu) {
                     for(var c=0;c<onejilu.length;c++){
                     //console.log(onejilu[c].geolocation)

                     }
                     }
                     personcount++;
                     if(personcount<aobj.length){jiazai();}else{return;}
                     }
                     })
                     */
                } else {
                    abnormalCheck(aobj[personcount]._id, start, end)
                    personcount++;
                    if (personcount < aobj.length) {
                        jiazai();
                    } else {
                        return;
                    }
                }
            }
        });//获取到一个人的考勤异常记录
        //console.log(obj[a]._id)
        //var perID = aobj[personcount]._id;
        //console.log(perID)
        //if (aobj[a].status == 2) {
        //    return;
        //}
        //simpleTimeCheck(perID, '2017-7-1', '2017-7-3', function (err, obj) {
        //    console.log(obj)
        //})
        //arr.push(aobj._id)
        //for (var b = 0; a < a.length; a++) {
        //
        //}
    }
    //jiazai()

    //console.log(arr)
})
//    }
//});


var j = schedule.scheduleJob(rule, function () {

    //得到所有待考勤人员
    //personDAO.getAllUser(function (err, obj) {
    //    for (var a = 0; a < obj.length; a++) {
    //        //console.log(obj[a]._id)
    //        if (obj[a].status == 2) {
    //            continue;
    //        }
    //
    //        for (var b = 0; a < a.length; a++) {
    //
    //        }
    //    }

    //for(所有人){

    //先判断AttendanceRecordDAO指定时间段内有没有考勤异常（请假和换班），有，continue则直接更新一条考勤状态，没有再进入下面的考勤规则计算

    //for(
    //多少中考勤状态（规则）
    //自定义的数组，每个考勤状态都得有明确的考勤规则可以计算出来，比如迟到，就是某段时间内的前半个小时某人未出现在某地
    // )
    //对一个人计算一种考勤规则，实现方法是通过PesonDao查询和判断一段时间内的位置，spotareaDAo也会有关系

    //在callback中更新一个人的考勤状态，实现方法是通过AttendanceRecordDAO更新考勤状态表
    //}

    //})
    //console.log('The answer to life, the universe, and everything!');
});

//var gg = schedule.scheduleJob(rule2, function(){
//    console.log('第二次运行!');
//});


module.exports = j;