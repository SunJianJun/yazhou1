/**
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
var personDAO = require('../dbmodels/personDAO.js');
/**
 * 简单的时间考勤判断
 * @param personId - 人员id
 * @param startTime - 开始时间
 * @param endTime - 结束时间
 * @param callback -回调函数，获取人员在指定时间内的定位信息是否存在，如果有，有多少次，如果没有，返回false
 */
var simpleTimeCheck=function (personId,startTime,endTime,callback) {
    //personDAO.send();
};

/**
 * 简单的空间考勤判断
 * @param personId - 人员id
 * @param area - 指定的空间区域
 * @param callback -回调函数，获取人员在指定区域内的定位信息是否存在，如果有，有多少次，如果没有，返回false
 */
var simpleAreaCheck=function (personId,area,callback) {
    //personDAO
};

/**
 * 空间和时间复合式考勤判断
 * @param personId - 人员id
 * @param area - 指定的空间区域
 * @param callback -回调函数，获取人员在指定区域内的定位信息是否存在，如果有，有多少次，如果没有，返回false
 */
var areaTimeCheck=function (personId,startTime,endTime,area,callback) {

};
/**
 * 考勤异常状态的直接处理
 * @param personId - 人员id
 * @param startTime - 开始时间
 * @param endTime - 结束时间
 * @param callback -回调函数，如果在此时间段内存在考勤异常状态，则返回考勤状态，如果不存在，返回false
 */
var abnormalCheck=function (personId,startTime,endTime,callback){

};

var j = schedule.scheduleJob(rule, function() {
    personDAO.getpersondaycheck(function(err,obj){
        if(err){
            console.log(err);
        }else{
            console.log(obj)
        }
    });
    //得到所有待考勤人员
    personDAO.getAllUser(function (err, obj) {
        for (var a = 0; a < obj.length; a++) {
            console.log(obj[a]._id)
            if(obj[a].status==2){continue;}

            for(var b=0;a<a.length;a++){

            }
        }

    //for(所有人){

    //先判断AttendanceRecordDAO指定时间段内有没有考勤异常（请假和换班），有，continue则直接更新一条考勤状态，没有再进入下面的考勤规则计算

        //for(
            //多少中考勤状态（规则）
            //自定义的数组，每个考勤状态都得有明确的考勤规则可以计算出来，比如迟到，就是某段时间内的前半个小时某人未出现在某地
            // )
            //对一个人计算一种考勤规则，实现方法是通过PesonDao查询和判断一段时间内的位置，spotareaDAo也会有关系

            //在callback中更新一个人的考勤状态，实现方法是通过AttendanceRecordDAO更新考勤状态表
        //}

    })
    console.log('The answer to life, the universe, and everything!');
});

//var gg = schedule.scheduleJob(rule2, function(){
//    console.log('第二次运行!');
//});


module.exports = j;