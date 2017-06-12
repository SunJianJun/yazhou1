var express = require('express');
var casetyperouter = express.Router();


var casetype = require('../dbmodels/casetypeschema.js');
// console.log('casetype数据模型是否存在：'+casetype);

//获取数据模型
var casetypeDAO = require('../dbmodels/casetypeDao');


var getMyNewestCasetypeFromWho = function (req, res) {
  // //console.log('call getMyNewestCasetypeFromWho');
  //for(var i in req.body){ //console.log("getMyNewestCasetypeFromWho 请求内容body子项："+i+"<>\n")};
  var receiverID = req.body.receiverID,
    senderID = req.body.senderID,
    isAbstract = req.body.isAbstract;

  // console.log('senderID:'+senderID);
  casetypeDAO.getMyNewestCasetypeFromWho(receiverID, senderID, isAbstract, function (err, obj) {
    if (!err) {
      // //console.log('getMyNewestCasetypeFromWho 查询所有'+senderID+'发送的消息:'+obj);
      res.send(obj);
    } else {
      // //console.log('getMyNewestCasetypeFromWho 查询所有'+senderID+'发送的消息为空:'+err);
      res.send(null);
    }
  });
};
var casetypeAdd = function (req, res) {

};
var casetypeDelete = function (req, res) {
  var name = req.body.name;
  console.log('删除' + name);
  casetypeDAO.casetypeDelete(name, function (err, obj) {
    if (!err) {
      console.log('readtCasetype 查询所有' + name + '发送的消息:' + obj);
      res.send(name);
    } else {
      console.log('readtCasetype 查询所有' + name + '发送的消息为空:' + err);
      res.send(null);
    }
  })
}
var casetypepeopleDelete = function (req, res) {
  var areaID = req.body.areaId;
  var position = req.body.position;
  casetypeDAO.casetypepeopleDelete(areaID, position, function (err, obj) {
    if (!err) {
      console.log('readtCasetype 查询所有' + areaID + '发送的消息:' + obj);
      res.send(areaID);
    } else {
      console.log('readtCasetype 查询所有' + areaID + '发送的消息为空:' + err);
      res.send(null);
    }
  })
}


var readtCasetype = function (req, res) {
  //console.log('call readtCasetype');
  // for(var i in req.body){
  //     console.log("readtCasetype 请求内容body子项："+i+"<>\n")
  // };
  // console.log(req.body);
  var name = req.body;
  // console.log(name);
  // 调用方法
  // casetypeObj.getCasetypesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
  // console.log('messID:'+messID);
  casetypeDAO.readtCasetype(name, function (err, obj) {
    if (!err) {
      // console.log('没有错误')
      console.log('readtCasetype 查询所有' + name + '发送的消息:' + obj);
      // console.log(obj);
      res.send(name);
    } else {
      console.log('readtCasetype 查询所有' + name + '发送的消息为空:' + err);
      res.send(null);
    }
  });
};
var getAllCasetype=function(req,res){

  console.log('----------')
	casetypeDAO.getAllCasetype(function(err,obj){
		if(!err){
			// console.log(obj)
			res.send(obj);
		}else{
			console.log(err)
		}
	})
}
var sendACasetype = function (req, res) {
  // //console.log('call sendACasetype');
  //for(var i in req.body){ //console.log("sendACasetype 请求内容body子项："+i+"<>\n")};
  var datt = req.body;
  if (!datt) {
    return;
  }
  // //console.log('senderID:'+senderID);
  casetypeDAO.sendACasetype(datt, function (err, obj) {
    if (!err) {
      console.log('sendACasetype 查询所有发送的消息:' + obj._id);
      res.send(obj);
    } else {
      console.log('sendACasetype 查询所有发送的消息为空:' + err);
      res.send(null);
    }
  });
};
var getCasetypesInATimeSpanFromWho = function (req, res) {
  // //console.log('call getCasetypesInATimeSpanFromWho');
  //for(var i in req.body){ //console.log("getCasetypesInATimeSpanFromWho 请求内容body子项："+i+"<>\n")};
  var receiverID = req.body.receiverID,
    senderID = req.body.senderID,
    startTime = req.body.startTime,
    lastTime = req.body.lastTime;
  // 调用方法
  // casetypeObj.getCasetypesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
  // //console.log('senderID:'+senderID);
  casetypeDAO.getCasetypesInATimeSpanFromWho(receiverID, senderID, startTime, lastTime, function (err, obj) {
    if (!err) {
      // console.log('getCasetypesInATimeSpanFromWho 查询所有'+senderID+'发送的消息id:'+obj);
      res.send(obj);
    } else {
      //console.log('getCasetypesInATimeSpanFromWho 查询所有'+senderID+'发送的消息为空:'+err);
      res.send(null);
    }
  });
};


casetyperouter.post('/sendACasetype', sendACasetype);//增加
casetyperouter.post('/readtCasetype', readtCasetype);//提交
casetyperouter.post('/getAllCasetype', getAllCasetype);//提交

casetyperouter.post('/getMyNewestCasetypeFromWho', getMyNewestCasetypeFromWho);//编辑查询
casetyperouter.post('/getCasetypesInATimeSpanFromWho', getCasetypesInATimeSpanFromWho);//编辑查询
casetyperouter.post('/casetypeDelete', casetypeDelete);//查找
casetyperouter.post('/casetypepeopleDelete', casetypepeopleDelete);//查找
module.exports = casetyperouter;