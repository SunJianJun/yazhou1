var express = require('express');
var caseprocessrouter = express.Router();


var caseprocess = require('../dbmodels/caseprocessschema.js');
// console.log('caseprocess数据模型是否存在：'+caseprocess);

//获取数据模型
var caseprocessDAO = require('../dbmodels/caseprocessDao');


var getMyNewestCaseprocessFromWho = function (req, res) {
  // //console.log('call getMyNewestCaseprocessFromWho');
  //for(var i in req.body){ //console.log("getMyNewestCaseprocessFromWho 请求内容body子项："+i+"<>\n")};
  var receiverID = req.body.receiverID,
    senderID = req.body.senderID,
    isAbstract = req.body.isAbstract;

  // console.log('senderID:'+senderID);
  caseprocessDAO.getMyNewestCaseprocessFromWho(receiverID, senderID, isAbstract, function (err, obj) {
    if (!err) {
      // //console.log('getMyNewestCaseprocessFromWho 查询所有'+senderID+'发送的消息:'+obj);
      res.send(obj);
    } else {
      // //console.log('getMyNewestCaseprocessFromWho 查询所有'+senderID+'发送的消息为空:'+err);
      res.send(null);
    }
  });
};
var caseprocessAdd = function (req, res) {

};
var caseprocessDelete = function (req, res) {
  var name = req.body.name;
  console.log('删除' + name);
  caseprocessDAO.caseprocessDelete(name, function (err, obj) {
    if (!err) {
      console.log('readtCaseprocess 查询所有' + name + '发送的消息:' + obj);
      res.send(name);
    } else {
      console.log('readtCaseprocess 查询所有' + name + '发送的消息为空:' + err);
      res.send(null);
    }
  })
}
var caseprocesspeopleDelete = function (req, res) {
  var areaID = req.body.areaId;
  var position = req.body.position;
  caseprocessDAO.caseprocesspeopleDelete(areaID, position, function (err, obj) {
    if (!err) {
      console.log('readtCaseprocess 查询所有' + areaID + '发送的消息:' + obj);
      res.send(areaID);
    } else {
      console.log('readtCaseprocess 查询所有' + areaID + '发送的消息为空:' + err);
      res.send(null);
    }
  })
}


var readtCaseprocess = function (req, res) {
  //console.log('call readtCaseprocess');
  // for(var i in req.body){
  //     console.log("readtCaseprocess 请求内容body子项："+i+"<>\n")
  // };
  // console.log(req.body);
  var name = req.body;
  // console.log(name);
  // 调用方法
  // caseprocessObj.getCaseprocesssInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
  // console.log('messID:'+messID);
  caseprocessDAO.readtCaseprocess(name, function (err, obj) {
    if (!err) {
      // console.log('没有错误')
      console.log('readtCaseprocess 查询所有' + name + '发送的消息:' + obj);
      // console.log(obj);
      res.send(name);
    } else {
      console.log('readtCaseprocess 查询所有' + name + '发送的消息为空:' + err);
      res.send(null);
    }
  });
};

var sendACaseprocess = function (req, res) {
  // //console.log('call sendACaseprocess');
  //for(var i in req.body){ //console.log("sendACaseprocess 请求内容body子项："+i+"<>\n")};
  var datt = req.body;
  if (!datt) {
    return;
  }
  // //console.log('senderID:'+senderID);
  caseprocessDAO.sendACaseprocess(datt, function (err, obj) {
    if (!err) {
      console.log('sendACaseprocess 查询所有发送的消息:' + obj._id);
      res.send(obj);
    } else {
      console.log('sendACaseprocess 查询所有发送的消息为空:' + err);
      res.send(null);
    }
  });
};
var getCaseprocesssInATimeSpanFromWho = function (req, res) {
  // //console.log('call getCaseprocesssInATimeSpanFromWho');
  //for(var i in req.body){ //console.log("getCaseprocesssInATimeSpanFromWho 请求内容body子项："+i+"<>\n")};
  var receiverID = req.body.receiverID,
    senderID = req.body.senderID,
    startTime = req.body.startTime,
    lastTime = req.body.lastTime;
  // 调用方法
  // caseprocessObj.getCaseprocesssInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
  // //console.log('senderID:'+senderID);
  caseprocessDAO.getCaseprocesssInATimeSpanFromWho(receiverID, senderID, startTime, lastTime, function (err, obj) {
    if (!err) {
      // console.log('getCaseprocesssInATimeSpanFromWho 查询所有'+senderID+'发送的消息id:'+obj);
      res.send(obj);
    } else {
      //console.log('getCaseprocesssInATimeSpanFromWho 查询所有'+senderID+'发送的消息为空:'+err);
      res.send(null);
    }
  });
};


caseprocessrouter.post('/sendACaseprocess', sendACaseprocess);//增加
caseprocessrouter.post('/readtCaseprocess', readtCaseprocess);//提交
caseprocessrouter.post('/getMyNewestCaseprocessFromWho', getMyNewestCaseprocessFromWho);//编辑查询
caseprocessrouter.post('/getCaseprocesssInATimeSpanFromWho', getCaseprocesssInATimeSpanFromWho);//编辑查询
caseprocessrouter.post('/caseprocessDelete', caseprocessDelete);//查找
caseprocessrouter.post('/caseprocesspeopleDelete', caseprocesspeopleDelete);//查找
module.exports = caseprocessrouter;