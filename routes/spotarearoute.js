var express = require('express');
var spotarearouter = express.Router();


var spotarea = require('../dbmodels/spotareaschema.js');
	 // console.log('spotarea数据模型是否存在：'+spotarea);

//获取数据模型
var spotareaDAO = require('../dbmodels/spotareaDao');


var getNewestSpotarea = function(req, res) {

        // console.log('senderID:'+senderID);
    spotareaDAO.getNewestSpotarea(function( err,obj){
        if(!err) {
            res.send(obj);
        } else{
            // //console.log('getNewestSpotarea 查询所有'+senderID+'发送的消息为空:'+err);
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
            console.log('sendPersontarea 查询所有'+name+'发送的消息:'+obj);
            res.send(name);
        }else{
            console.log('sendPersontarea 查询所有'+name+'发送的消息为空:'+err);
            res.send(null);
        }
    })
}

//工作区域解除绑定人员
var removespotareapeople=function(req,res){
    var areaID=req.body.areaId;
    var person=req.body.person;
    spotareaDAO.removespotareapeople(areaID,person,function(err,obj){
        if(!err){
            res.send(obj);
        }else{
            res.send(null);
        }
    })
}



var sendPersontarea = function(req, res) {
    //console.log('call sendPersontarea');
    // for(var i in req.body){ 
    //     console.log("sendPersontarea 请求内容body子项："+i+"<>\n")
    // };
    // console.log(req.body);
    var eve=req.body;
    // console.log(name);
    // 调用方法
    // spotareaObj.getSpotareasInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // console.log('messID:'+messID);
    spotareaDAO.sendPersontarea(eve,function( err,obj){
        if(!err) {
            // console.log('没有错误')
            console.log('sendPersontarea 查询所有'+eve+'发送的消息:'+obj);
            // console.log(obj);
            res.send(eve);
        } else{
            console.log('sendPersontarea 查询所有'+eve+'发送的消息为空:'+err);
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
//{“_id”:"图层ID",name:"南六环",geometry:{coordinates:["116.430587","39.909989","116.430587","39.899989","116.446587","39.899989","116.446587","39.909989"],type:"Polygon"}}
var updateASpotarea=function(req,res){
    var date=req.body;
    var _id=date._id,
        name=date.name,
        coordinates=date.geometry;
    spotareaDAO.updateASpotarea(_id,name,coordinates,function(err,obj){
        if(err){
            res.send(null)
        }else{
            res.send(obj)
            //res(obj)
        }
    })
}
/**
 * 查找人员所安排的区域(工作日程)
 * @param {json} req 客户端请求数据{personID:'58ddcce6ac015a08090007ce'}//人员id
 * @param {json} res {}
 */
var getASpotareatoperson=function(req,res){
    var personID=req.body.personID;
    spotareaDAO.getASpotareatoperson(personID,function(err,obj){
        if(err){
            console.log({error:err})
        }else{
            res.send({success:obj})
        }
    })
}
//getASpotareatoperson('58e0c199e978587014e67a50')




spotarearouter.post('/sendASpotarea',sendASpotarea);//增加
spotarearouter.post('/sendPersontarea',sendPersontarea);//绑定人员
spotarearouter.post('/getNewestSpotarea',getNewestSpotarea);//编辑查询
spotarearouter.post('/getSpotareasInATimeSpanFromWho',getSpotareasInATimeSpanFromWho);//编辑查询
spotarearouter.post('/spotareaDelete',spotareaDelete);//查找  
spotarearouter.post('/removespotareapeople',removespotareapeople);//查找
spotarearouter.post('/getASpotareatoperson',getASpotareatoperson);
module.exports = spotarearouter;