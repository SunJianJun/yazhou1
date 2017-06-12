var express = require('express');
var spotarearouter = express.Router();


var spotarea = require('../dbmodels/spotareaschema.js');
	 // console.log('spotarea数据模型是否存在：'+spotarea);

//获取数据模型
var spotareaDAO = require('../dbmodels/spotareaDao');


var getMyNewestSpotareaFromWho = function(req, res) {
    // //console.log('call getMyNewestSpotareaFromWho');
    //for(var i in req.body){ //console.log("getMyNewestSpotareaFromWho 请求内容body子项："+i+"<>\n")};
    var receiverID=req.body.receiverID,
    senderID=req.body.senderID,
    isAbstract=req.body.isAbstract;

        // console.log('senderID:'+senderID);
    spotareaDAO.getMyNewestSpotareaFromWho(receiverID,senderID,isAbstract,function( err,obj){
        if(!err) {
            // //console.log('getMyNewestSpotareaFromWho 查询所有'+senderID+'发送的消息:'+obj);
            res.send(obj);
        } else{
            // //console.log('getMyNewestSpotareaFromWho 查询所有'+senderID+'发送的消息为空:'+err);
            res.send(null);
        }});
};
var spotareaAdd = function(req, res) {

};
var spotareaDelete=function(req,res){
    var name=req.body.name;
    console.log('删除'+name);
    spotareaDAO.spotareaDelete(name,function(err,obj){
        if(!err){
            console.log('readtSpotarea 查询所有'+name+'发送的消息:'+obj);
            res.send(name);
        }else{
            console.log('readtSpotarea 查询所有'+name+'发送的消息为空:'+err);
            res.send(null);
        }
    })
}
var spotareapeopleDelete=function(req,res){
    var areaID=req.body.areaId;
    var position=req.body.position;
    spotareaDAO.spotareapeopleDelete(areaID,position,function(err,obj){
        if(!err){
            console.log('readtSpotarea 查询所有'+areaID+'发送的消息:'+obj);
            res.send(areaID);
        }else{
            console.log('readtSpotarea 查询所有'+areaID+'发送的消息为空:'+err);
            res.send(null);
        }
    })
}



var readtSpotarea = function(req, res) {
    //console.log('call readtSpotarea');
    // for(var i in req.body){ 
    //     console.log("readtSpotarea 请求内容body子项："+i+"<>\n")
    // };
    // console.log(req.body);
    var name=req.body;
    // console.log(name);
    // 调用方法
    // spotareaObj.getSpotareasInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // console.log('messID:'+messID);
    spotareaDAO.readtSpotarea(name,function( err,obj){
        if(!err) {
            // console.log('没有错误')
            console.log('readtSpotarea 查询所有'+name+'发送的消息:'+obj);
            // console.log(obj);
            res.send(name);
        } else{
            console.log('readtSpotarea 查询所有'+name+'发送的消息为空:'+err);
            res.send(null);
        }});
};

var sendASpotarea = function(req, res) {
    // //console.log('call sendASpotarea');
    //for(var i in req.body){ //console.log("sendASpotarea 请求内容body子项："+i+"<>\n")};
    var datt=req.body;
    if(!datt){return;}
    spotareaDAO.sendASpotarea(datt,function( err,obj){
        if(!err) {
            console.log('sendASpotarea 查询所有发送的消息:'+obj._id);
            res.send(obj);
        } else{
            console.log('sendASpotarea 查询所有发送的消息为空:'+err);
            res.send(null);
        }});
};
var getSpotareasInATimeSpanFromWho = function(req, res) {
    // //console.log('call getSpotareasInATimeSpanFromWho');
    //for(var i in req.body){ //console.log("getSpotareasInATimeSpanFromWho 请求内容body子项："+i+"<>\n")};
    var receiverID=req.body.receiverID,
        senderID=req.body.senderID,
        startTime=req.body.startTime,
        lastTime=req.body.lastTime;
    // 调用方法
    // spotareaObj.getSpotareasInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // //console.log('senderID:'+senderID);
    spotareaDAO.getSpotareasInATimeSpanFromWho(receiverID,senderID,startTime,lastTime,function( err,obj){
        if(!err) {
            // console.log('getSpotareasInATimeSpanFromWho 查询所有'+senderID+'发送的消息id:'+obj);
            res.send(obj);
        } else{
            //console.log('getSpotareasInATimeSpanFromWho 查询所有'+senderID+'发送的消息为空:'+err);
            res.send(null);
        }});
};


spotarearouter.post('/sendASpotarea',sendASpotarea);//增加
spotarearouter.post('/readtSpotarea',readtSpotarea);//提交
spotarearouter.post('/getMyNewestSpotareaFromWho',getMyNewestSpotareaFromWho);//编辑查询
spotarearouter.post('/getSpotareasInATimeSpanFromWho',getSpotareasInATimeSpanFromWho);//编辑查询
spotarearouter.post('/spotareaDelete',spotareaDelete);//查找  
spotarearouter.post('/spotareapeopleDelete',spotareapeopleDelete);//查找  
module.exports = spotarearouter;