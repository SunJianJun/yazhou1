var express = require('express');
var concreteargurouter = express.Router();


var concreteargu = require('../dbmodels/concretearguschema.js');
// console.log('concreteargu数据模型是否存在：'+concreteargu);

//获取数据模型
var concretearguDAO = require('../dbmodels/concretearguDao');

//根据参数ID数组获取到参数
var getparametersaccordingtoParameter = function (req, res) {
  // //console.log('call getparametersaccordingtoParameter');
  //for(var i in req.body){ //console.log("getparametersaccordingtoParameter 请求内容body子项："+i+"<>\n")};
  var arguID = req.body.argu; //得到参数ID数组
// console.log(arguID)
  concretearguDAO.getparametersaccordingtoParameter(arguID,function (err, obj) {
    if (!err) {
      res.send(obj);
    } else {
      // //console.log('getparametersaccordingtoParameter 查询所有'+senderID+'发送的消息为空:'+err);
      res.send(null);
    }
  });
};
var concretearguAdd = function (req, res) {

};
var concretearguDelete = function (req, res) {
  var name = req.body.name;
  console.log('删除' + name);
  concretearguDAO.concretearguDelete(name, function (err, obj) {
    if (!err) {
      console.log('readtCaseprocess 查询所有' + name + '发送的消息:' + obj);
      res.send(name);
    } else {
      console.log('readtCaseprocess 查询所有' + name + '发送的消息为空:' + err);
      res.send(null);
    }
  })
}
var concreteargupeopleDelete = function (req, res) {
  var areaID = req.body.areaId;
  var position = req.body.position;
  concretearguDAO.concreteargupeopleDelete(areaID, position, function (err, obj) {
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
  // concretearguObj.getCaseprocesssInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
  // console.log('messID:'+messID);
  concretearguDAO.readtCaseprocess(name, function (err, obj) {
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

var sendAConcreteargu = function (req, res) {
  // //console.log('call sendAConcreteargu');
  //for(var i in req.body){ //console.log("sendAConcreteargu 请求内容body子项："+i+"<>\n")};
  var datt = req.body;
  if (!datt) {
    return;
  }
  // //console.log('senderID:'+senderID);
  concretearguDAO.sendAConcreteargu(datt, function (err, obj) {
    if (!err) {
      console.log('sendAConcreteargu 查询所有发送的消息:' + obj._id);
      res.send(obj);
    } else {
      console.log('sendAConcreteargu 查询所有发送的消息为空:' + err);
      res.send(null);
    }
  });
};
var sendAllConcreteargu = function (req, res) { //////////////////////////////////////////////
  // //console.log('call sendAllConcreteargu');
  //for(var i in req.body){ //console.log("sendAllConcreteargu 请求内容body子项："+i+"<>\n")};
  var datt = req.body;
  if (!datt) {
    return;
  }
  // //console.log('senderID:'+senderID);
  concretearguDAO.sendAllConcreteargu(datt, function (err, obj) {
    if (!err) {
      console.log('sendAllConcreteargu 查询所有发送的消息:' + obj._id);
      res.send(obj);
    } else {
      console.log('sendAllConcreteargu 查询所有发送的消息为空:' + err);
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
  // concretearguObj.getCaseprocesssInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
  // //console.log('senderID:'+senderID);
  concretearguDAO.getCaseprocesssInATimeSpanFromWho(receiverID, senderID, startTime, lastTime, function (err, obj) {
    if (!err) {
      // console.log('getCaseprocesssInATimeSpanFromWho 查询所有'+senderID+'发送的消息id:'+obj);
      res.send(obj);
    } else {
      //console.log('getCaseprocesssInATimeSpanFromWho 查询所有'+senderID+'发送的消息为空:'+err);
      res.send(null);
    }
  });
};


concreteargurouter.post('/sendAConcreteargu', sendAConcreteargu);//增加
concreteargurouter.post('/sendAllConcreteargu', sendAllConcreteargu);//增加
concreteargurouter.post('/readtCaseprocess', readtCaseprocess);//提交
concreteargurouter.post('/getparametersaccordingtoParameter',getparametersaccordingtoParameter);//编辑查询
concreteargurouter.post('/getCaseprocesssInATimeSpanFromWho', getCaseprocesssInATimeSpanFromWho);//编辑查询
concreteargurouter.post('/concretearguDelete', concretearguDelete);//查找
concreteargurouter.post('/concreteargupeopleDelete', concreteargupeopleDelete);//查找
module.exports = concreteargurouter;
