var express = require('express');
var casesteprouter = express.Router();


var casestep = require('../dbmodels/casestepschema.js');
// console.log('casestep数据模型是否存在：'+casestep);

//获取数据模型
var casestepDAO = require('../dbmodels/casestepDao');


var getMyNewestCasestepFromWho = function (req, res) {
  // //console.log('call getMyNewestCasestepFromWho');
  //for(var i in req.body){ //console.log("getMyNewestCasestepFromWho 请求内容body子项："+i+"<>\n")};
  var receiverID = req.body.receiverID,
    senderID = req.body.senderID,
    isAbstract = req.body.isAbstract;

  // console.log('senderID:'+senderID);
  casestepDAO.getMyNewestCasestepFromWho(receiverID, senderID, isAbstract, function (err, obj) {
    if (!err) {
      // //console.log('getMyNewestCasestepFromWho 查询所有'+senderID+'发送的消息:'+obj);
      res.send(obj);
    } else {
      // //console.log('getMyNewestCasestepFromWho 查询所有'+senderID+'发送的消息为空:'+err);
      res.send(null);
    }
  });
};
var casestepAdd = function (req, res) {

};
var casestepDelete = function (req, res) {
  var name = req.body.name;
  console.log('删除' + name);
  casestepDAO.casestepDelete(name, function (err, obj) {
    if (!err) {
      console.log('readtCasestep 查询所有' + name + '发送的消息:' + obj);
      res.send(name);
    } else {
      console.log('readtCasestep 查询所有' + name + '发送的消息为空:' + err);
      res.send(null);
    }
  })
}
var casesteppeopleDelete = function (req, res) {
  var areaID = req.body.areaId;
  var position = req.body.position;
  casestepDAO.casesteppeopleDelete(areaID, position, function (err, obj) {
    if (!err) {
      console.log('readtCasestep 查询所有' + areaID + '发送的消息:' + obj);
      res.send(areaID);
    } else {
      console.log('readtCasestep 查询所有' + areaID + '发送的消息为空:' + err);
      res.send(null);
    }
  })
}


var readtCasestep = function (req, res) {
  //console.log('call readtCasestep');
  // for(var i in req.body){
  //     console.log("readtCasestep 请求内容body子项："+i+"<>\n")
  // };
  // console.log(req.body);
  var name = req.body;
  // console.log(name);
  // 调用方法
  // casestepObj.getCasestepsInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
  // console.log('messID:'+messID);
  casestepDAO.readtCasestep(name, function (err, obj) {
    if (!err) {
      // console.log('没有错误')
      console.log('readtCasestep 查询所有' + name + '发送的消息:' + obj);
      // console.log(obj);
      res.send(name);
    } else {
      console.log('readtCasestep 查询所有' + name + '发送的消息为空:' + err);
      res.send(null);
    }
  });
};

var sendACasestep = function (req, res) {
  // //console.log('call sendACasestep');
  //for(var i in req.body){ //console.log("sendACasestep 请求内容body子项："+i+"<>\n")};
  var datt = req.body;
  if (!datt) {
    return;
  }
  // //console.log('senderID:'+senderID);
  casestepDAO.sendACasestep(datt, function (err, obj) {
    if (!err) {
      console.log('sendACasestep 查询所有发送的消息:' + obj._id);
      res.send(obj);
    } else {
      console.log('sendACasestep 查询所有发送的消息为空:' + err);
      res.send(null);
    }
  });
};
var getCasestepsInATimeSpanFromWho = function (req, res) {
  // //console.log('call getCasestepsInATimeSpanFromWho');
  //for(var i in req.body){ //console.log("getCasestepsInATimeSpanFromWho 请求内容body子项："+i+"<>\n")};
  var receiverID = req.body.receiverID,
    senderID = req.body.senderID,
    startTime = req.body.startTime,
    lastTime = req.body.lastTime;
  // 调用方法
  // casestepObj.getCasestepsInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
  // //console.log('senderID:'+senderID);
  casestepDAO.getCasestepsInATimeSpanFromWho(receiverID, senderID, startTime, lastTime, function (err, obj) {
    if (!err) {
      // console.log('getCasestepsInATimeSpanFromWho 查询所有'+senderID+'发送的消息id:'+obj);
      res.send(obj);
    } else {
      //console.log('getCasestepsInATimeSpanFromWho 查询所有'+senderID+'发送的消息为空:'+err);
      res.send(null);
    }
  });
};


casesteprouter.post('/sendACasestep', sendACasestep);//增加
casesteprouter.post('/readtCasestep', readtCasestep);//提交
casesteprouter.post('/getMyNewestCasestepFromWho', getMyNewestCasestepFromWho);//编辑查询
casesteprouter.post('/getCasestepsInATimeSpanFromWho', getCasestepsInATimeSpanFromWho);//编辑查询
casesteprouter.post('/casestepDelete', casestepDelete);//查找
casesteprouter.post('/casesteppeopleDelete', casesteppeopleDelete);//查找
module.exports = casesteprouter;