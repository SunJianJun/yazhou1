var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
// rule.minute = 42;
// rule.dayOfWeek = [0, new schedule.Range(4, 6)];
// rule.hour = 17;
rule.second = 10;

var rule2 = new schedule.RecurrenceRule();
// rule.minute = 42;
// rule.dayOfWeek = [0, new schedule.Range(4, 6)];
// rule.hour = 17;
rule2.second = 20;


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
    
}

/**
 * 简单的空间考勤判断
 * @param personId - 人员id
 * @param area - 指定的空间区域
 * @param callback -回调函数，获取人员在指定区域内的定位信息是否存在，如果有，有多少次，如果没有，返回false
 */
var simpleAreaCheck=function (personId,area,callback) {
    // times,
}

/**
 * 空间和时间复合式考勤判断
 * @param personId - 人员id
 * @param area - 指定的空间区域
 * @param callback -回调函数，获取人员在指定区域内的定位信息是否存在，如果有，有多少次，如果没有，返回false
 */
var areaTimeCheck=function (personId,startTime,endTime,area,callback) {

}

/**
 * 考勤异常状态的直接处理
 * @param personId - 人员id
 * @param startTime - 开始时间
 * @param endTime - 结束时间
 * @param callback -回调函数，如果在此时间段内存在考勤异常状态，则返回考勤状态，如果不存在，返回false
 */
var abnormalCheck=function (personId,startTime,endTime,callback) {

}

var j = schedule.scheduleJob(rule, function(){
    console.log('The answer to life, the universe, and everything!');
});

var gg = schedule.scheduleJob(rule2, function(){
    console.log('第二次运行!');
});


module.exports = j;