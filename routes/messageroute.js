/**
 * @module 工作消息和群体通知模块
 */

var express = require('express');
var messagerouter = express.Router();

//获取数据模型
var personDAO = require('../dbmodels/personDAO.js');

var message = require('../dbmodels/messageschema.js');
	 //console.log('message数据模型是否存在：'+message);

//获取数据模型
var messageDAO = require('../dbmodels/messageDao');

/**
 * 得到一个人发送来的最新未读消息
 * @param {json} req - {receiverID:"58c043cc40cbb100091c640d",senderID:"58bff0836253fd4008b3d41b",isAbstract:false（是否需要摘要信息）// 如果是需要摘要信息，而且指定来源的消息数量》0// 如果不需要摘要信息，而且消息数量大于0}
 * @param {json} res - 如果是需要摘要的，就是这样{sender:senderID,count:消息数量,abstract:自动摘要,
                    startTime:消息起始时间("yyyy-MM-dd hh:mm:ss"),
                    lastTime:消息结束时间("yyyy-MM-dd hh:mm:ss")}，如果不需要摘要就是消息的数组【{ create_date: 2017-04-02T11:04:34.638Z,
                      images: {},
                      location:
                       [ { positioningdate: 2017-04-02T11:04:34.639Z,
                           SRS: '4326',
                           _id: 58e0dac2e978587014e67f23,
                           geolocation: [Object] } ],
                      __v: 0,
                      status: 0,
                      receiver: 58dd96c9ac015a0809000070,
                      sender: 58c043cc40cbb100091c640d,
                      image: 'images/24368180-1794-11e7-a741-7d4b0ed433e3.jpg',
                      text: '',
                      _id: 58e0dac2e978587014e67f22 }，。。。】
 */
var getMyNewestMessageFromWho = function(req, res) {
    // //console.log('call getMyNewestMessageFromWho');
    //for(var i in req.body){ //console.log("getMyNewestMessageFromWho 请求内容body子项："+i+"<>\n")};
    var receiverID=req.body.receiverID,
    senderID=req.body.senderID,
    isAbstract=req.body.isAbstract;

    // //console.log('senderID:'+senderID);
    messageDAO.getMyNewestMessageFromWho(receiverID,senderID,isAbstract,function( err,obj){
        if(!err) {
            // //console.log('getMyNewestMessageFromWho 查询所有'+senderID+'发送的消息:'+obj);
            res.send(obj);
        } else{
            // //console.log('getMyNewestMessageFromWho 查询所有'+senderID+'发送的消息为空:'+err);
            res.send(null);
        }});
};


/**
 *读取了一个消息，将一个消息设置为已读，在查询未读消息的操作中就不会包括这个消息了
 * @param {string} req - req.body.messID消息的唯一id
 * @param {string} res - 成功返回该消息id，失败返回null
 */
var readtMessage = function(req, res) {
    // //console.log('call readtMessage');
    //for(var i in req.body){ //console.log("readtMessage 请求内容body子项："+i+"<>\n")};
    var messID=req.body.messID;
    var curUserID=req.body.curUserID?req.body.curUserID:"";
    // 调用方法
    // messageObj.getMessagesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // //console.log('messID:'+messID);
    messageDAO.readtMessage(messID,curUserID,function( err,obj){
        if(!err) {
            // //console.log('readtMessage 查询所有'+messID+'发送的消息:'+obj);
            res.send(messID);
        } else{
            // //console.log('readtMessage 查询所有'+messID+'发送的消息为空:'+err);
            res.send(null);
        }});
};

var messageAdd = function(req, res) {

};
/**
 * 发送个人消息
 * @param {json} req - json形式：(senderID:“发送者id",type:"message"(可以不写),receiverID:"接受者id",messageObj：{
 * text:"文本内容",voice:"语音消息",video:"视频消息",image:"图片消息"（四种消息必有一种）}")
 * @param {json} res - 发送成功返回 消息本身，发送失败发回 null
 */
var sendAMessage = function(req, res) {
    // //console.log('call sendAMessage');
    //for(var i in req.body){ //console.log("sendAMessage 请求内容body子项："+i+"<>\n")};
    var receiverID=req.body.receiverID,
        senderID=req.body.senderID;
    if(!req.body.messageObj){return;}
    // //console.log('senderID:'+senderID);
    messageDAO.sendAMessage(req.body.messageObj,senderID,receiverID,function( err,obj){
        if(!err) {
            // //console.log('sendAMessage 查询所有'+senderID+'发送的消息:'+obj._id);
            res.send(obj);
        } else{
            // //console.log('sendAMessage 查询所有'+senderID+'发送的消息为空:'+err);
            res.send(null);
        }});
};
/**
 * 发送群体性消息
 * @param {json} req - json形式：(senderID:“dfdf",type:"broadcast",receiverType:"department(按部门发送)|title（按头衔发送）|persons（选择一些人发送）",messageObj：{
 * text:"文本内容",voice:"语音消息",video:"视频消息",image:"图片消息"（四种消息必有一种）}，receiverInfo:"(如果是部门，就是部门id数组，如果是title，就是title的id数组，如果是人员，就是人员的id数组)")
 * @param {json} res - 发送失败 null，发送成功， 消息本身
 */
var sendBroadcast = function(req, res) {
        // //console.log('call sendAMessage');
        //for(var i in req.body){ //console.log("sendAMessage 请求内容body子项："+i+"<>\n")};
        var senderID=req.body.senderID;
        var messType=req.body.type;
        var receiverType=req.body.receiverType;
        var receiverInfo=req.body.receiverInfo;
        //如果没有类型，或者类型不是广播，就返回
        if(!req.body.type && req.body.type!="broadcast" && messType && receiverType && receiverInfo){
            // //console.log("客户端发来的json有空值");
            res.send(null);
            return;
        };
        // //console.log('senderID:'+senderID);
    var recieverIds=[];
    switch (receiverType){
        case "department":
            if(receiverInfo.length && receiverInfo.length>0)
            //这是departmentid的数组
            {
                for(var index=0;index<receiverInfo;index++)
                {
                    personDAO.getPersonsByDepartment(receiverInfo);
                }
            }else //只有1个id
            {
                personDAO.getPersonsByDepartment(receiverInfo);
            }
            break;
        case "title":
            personDAO.getPersonsByTitle
            break;
        case "persons":
            break;
        default:
            break;
    }
        //未实现
        messageDAO.sendBroadcast(req.body.messageObj,senderID,receiverType,receiverInfo,messType,function( err,obj){
            if(!err) {
                // //console.log('sendAMessage 查询所有'+senderID+'发送的消息:'+obj._id);
                res.send(obj);
            } else{
                // //console.log('sendAMessage 查询所有'+senderID+'发送的消息为空:'+err);
                res.send(null);
            }});
    };





/**
 *得到一个时间段内某人发来的消息 或者 群体消息
 * @param {Object} req - 客户端提交的json{receiverID:"sdfdsf",startTime:"开始时间",lastTime:"结束时间","senderID":"发送者id"，type：“broadcast|message”（跟发送者id不同时作用，可以只发送type为broadcast而不指定senderid，如果有明确的发送者id，且type未指定或者为‘message’时，就查询个人消息，否则就是群体消息）}
 * @param {string} req.body.receiverID - 接受者id.
 * @param {string} req.body.senderID - 发送者id.
 * @param {string} req.body.type - 发送类型.broadcast或者message，当为broadcast时，senderID会忽略，否则会用上
 * @param {datetime} req.body.startTime - 开始时间.
 * @param {datetime} req.body.lastTime - 结束时间.
 * @param res
 */
var getMessagesInATimeSpanFromWho = function(req, res) {
    // //console.log('call getMessagesInATimeSpanFromWho');
    //for(var i in req.body){ //console.log("getMessagesInATimeSpanFromWho 请求内容body子项："+i+"<>\n")};
    var receiverID=req.body.receiverID,
        senderID=req.body.senderID,
        startTime=req.body.startTime,
        lastTime=req.body.lastTime;
    // 调用方法
    // messageObj.getMessagesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // //console.log('senderID:'+senderID);
    //待扩展实现
    messageDAO.getMessagesInATimeSpanFromWho(receiverID,senderID,startTime,lastTime,function( err,obj){
        if(!err) {
            // //console.log('getMessagesInATimeSpanFromWho 查询所有'+senderID+'发送的消息id:'+obj);
            res.send(obj);
        } else{
            // //console.log('getMessagesInATimeSpanFromWho 查询所有'+senderID+'发送的消息为空:'+err);
            res.send(null);
        }});
};


/**
 * 根据用户id得到所有未读信息
 * @param {json} req - 传来的参数是接受者的id{receiverID:"58dd96c9ac015a0809000070"}
 * @param {json} res - 发回所有未读消息，如果没有就是null，如果有，类似{ create_date: 2017-04-02T11:04:34.638Z,
  images: {},
  location:
   [ { positioningdate: 2017-04-02T11:04:34.639Z,
       SRS: '4326',
       _id: 58e0dac2e978587014e67f23,
       geolocation: [Object] } ],
  __v: 0,
  status: 0,
  receiver: 58dd96c9ac015a0809000070,
  sender: 58c043cc40cbb100091c640d,
  image: 'images/24368180-1794-11e7-a741-7d4b0ed433e3.jpg',
  text: '',
  _id: 58e0dac2e978587014e67f22 }
 */
var getAllUnreadMessages = function(req, res) {
    // //console.log('call getMessagesInATimeSpanFromWho');
    //for(var i in req.body){ //console.log("getMessagesInATimeSpanFromWho 请求内容body子项："+i+"<>\n")};
    var receiverID=req.body.receiverID;
    // 调用方法
    // messageObj.getMessagesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // //console.log('senderID:'+senderID);
    messageDAO.getAllUnreadMessages(receiverID,function( err,obj){
        if(!err) {
            // //console.log('getMessagesInATimeSpanFromWho 查询所有'+senderID+'发送的消息id:'+obj);
            res.send(obj);
        } else{
            // //console.log('getMessagesInATimeSpanFromWho 查询所有'+senderID+'发送的消息为空:'+err);
            res.send(null);
        }});
};
messagerouter.get('/add',messageAdd);//增加
messagerouter.post('/sendAMessage',sendAMessage);//增加
messagerouter.post('/readtMessage',readtMessage);//提交
messagerouter.post('/getMyNewestMessageFromWho',getMyNewestMessageFromWho);//编辑查询
messagerouter.post('/getMessagesInATimeSpanFromWho',getMessagesInATimeSpanFromWho);//编辑查询
messagerouter.post('/getAllUnreadMessages',getAllUnreadMessages);//编辑查询
messagerouter.post('/sendBroadcast',sendBroadcast);//编辑查询

// messagerouter.post('/checkWorkMessagesCount',checkWorkMessagesCount);//提交
//
// messagerouter.post('/checkHandlingEventsCount',checkHandlingEventsCount);//提交
//
//
// messagerouter.post('/checkTemperyBroadcast',checkTemperyBroadcast);//提交
//
// messagerouter.post('/getUnreadMessageList',getUnreadMessageList);//提交
module.exports = messagerouter;