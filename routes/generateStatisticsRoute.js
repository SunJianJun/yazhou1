/**
 * 获得统计分析数据的模块 url：/getStatistic
 * @type {exports|module.exports}
 */


var express = require('express');
var statisticRouter = express.Router();

//获取人员的数据模型
var personDAO = require('./personDAO.js');
var attendanceRecordDAO = require('./attendanceRecordDAO.js');
var spotareaDAO = require('./spotareaDao')
console.log('加载获得统计分析数据的模块')

/**
 *
 * @param req - departmentId,部门id，startTime,endTime, countType:events|personel|spotares,timespan:day|week|month|year
 * @param res -
 */
var countByDepartment=function(req,res) {

    var dpid=req.body.departmentId;
    var sTime=req.body.startTime;
    var eTime=req.body.endTime;
    var countType=req.body.countType;
    var timespan=req.body.timespan;


}


var countByPerson=function(req,res) {

    var ppid=req.body.personId;
    var sTime=req.body.startTime;
    var eTime=req.body.endTime;
    var countType=req.body.countType;
    var timespan=req.body.timespan;


}


var countBySpotarea=function(req,res) {

    var ppid=req.body.personId;
    var sTime=req.body.startTime;
    var eTime=req.body.endTime;
    var countType=req.body.countType;
    var timespan=req.body.timespan;


}


var countByEvents=function(req,res) {

    var eeid=req.body.eeid;
    var sTime=req.body.startTime;
    var eTime=req.body.endTime;
    var countType=req.body.countType;
    var timespan=req.body.timespan;


}



/**
 *
 * @param req - personId,人员id，startTime,endTime, countType:events|personel|spotares,timespan:day|week|month|year
 * @param res -
 */
var countByMessages=function(req,res) {

    var personId=req.body.personId;
    var sTime=req.body.startTime;
    var eTime=req.body.endTime;
    var countType=req.body.countType;
    var timespan=req.body.timespan;


}


statisticRouter.get('/add',messageAdd);//增加
statisticRouter.post('/sendAMessage',sendAMessage);//发送普通消息
statisticRouter.post('/readtMessage',readtMessage);//已读普通消息
statisticRouter.post('/getMyNewestMessageFromWho',getMyNewestMessageFromWho);//得到从某人那里来的最新消息
module.exports = j;