var express = require('express');
var messagerouter = express.Router();


var message = require('../dbmodels/messageschema.js');
	 //console.log('message数据模型是否存在：'+message);

//获取数据模型
var messageDAO = require('../dbmodels/messageDao');

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



var readtMessage = function(req, res) {
    // //console.log('call readtMessage');
    //for(var i in req.body){ //console.log("readtMessage 请求内容body子项："+i+"<>\n")};
    var messID=req.body.messID;
    // 调用方法
    // messageObj.getMessagesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // //console.log('messID:'+messID);
    messageDAO.readtMessage(messID,function( err,obj){
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
    messageDAO.getMessagesInATimeSpanFromWho(receiverID,senderID,startTime,lastTime,function( err,obj){
        if(!err) {
            // //console.log('getMessagesInATimeSpanFromWho 查询所有'+senderID+'发送的消息id:'+obj);
            res.send(obj);
        } else{
            // //console.log('getMessagesInATimeSpanFromWho 查询所有'+senderID+'发送的消息为空:'+err);
            res.send(null);
        }});
};


messagerouter.post('/sendAMessage',sendAMessage);//增加
messagerouter.post('/readtMessage',readtMessage);//提交
messagerouter.post('/getMyNewestMessageFromWho',getMyNewestMessageFromWho);//编辑查询
messagerouter.post('/getMessagesInATimeSpanFromWho',getMessagesInATimeSpanFromWho);//编辑查询

module.exports = messagerouter;