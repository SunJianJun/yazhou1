var express = require('express');
var concretesteprouter = express.Router();


var concretestep = require('../dbmodels/concretestepschema.js');
// console.log('concretestep数据模型是否存在：'+concretestep);

//获取数据模型
var concreteeventDAO = require('../dbmodels/concreteeventDao');//具体事件表
var concretestepDAO = require('../dbmodels/concretestepDao');


var getMyNewestConcretestepFromWho = function (req, res) {
  // //console.log('call getMyNewestConcretestepFromWho');
  //for(var i in req.body){ //console.log("getMyNewestConcretestepFromWho 请求内容body子项："+i+"<>\n")};
  var receiverID = req.body.receiverID,
    senderID = req.body.senderID,
    isAbstract = req.body.isAbstract;

  // console.log('senderID:'+senderID);
  concretestepDAO.getMyNewestConcretestepFromWho(receiverID, senderID, isAbstract, function (err, obj) {
    if (!err) {
      // //console.log('getMyNewestConcretestepFromWho 查询所有'+senderID+'发送的消息:'+obj);
      res.send(obj);
    } else {
      // //console.log('getMyNewestConcretestepFromWho 查询所有'+senderID+'发送的消息为空:'+err);
      res.send(null);
    }
  });
};
var concretestepAdd = function (req, res) {

};
var concretestepDelete = function (req, res) {
  var name = req.body.name;
  console.log('删除' + name);
  concretestepDAO.concretestepDelete(name, function (err, obj) {
    if (!err) {
      console.log('readtConcretestep 查询所有' + name + '发送的消息:' + obj);
      res.send(name);
    } else {
      console.log('readtConcretestep 查询所有' + name + '发送的消息为空:' + err);
      res.send(null);
    }
  })
}
var concretesteppeopleDelete = function (req, res) {
  var areaID = req.body.areaId;
  var position = req.body.position;
  concretestepDAO.concretesteppeopleDelete(areaID, position, function (err, obj) {
    if (!err) {
      console.log('readtConcretestep 查询所有' + areaID + '发送的消息:' + obj);
      res.send(areaID);
    } else {
      console.log('readtConcretestep 查询所有' + areaID + '发送的消息为空:' + err);
      res.send(null);
    }
  })
}


var readtConcretestep = function (req, res) {
  //console.log('call readtConcretestep');
  // for(var i in req.body){
  //     console.log("readtConcretestep 请求内容body子项："+i+"<>\n")
  // };
  // console.log(req.body);
  var name = req.body;
  // console.log(name);
  // 调用方法
  // concretestepObj.getConcretestepsInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
  // console.log('messID:'+messID);
  concretestepDAO.readtConcretestep(name, function (err, obj) {
    if (!err) {
      // console.log('没有错误')
      console.log('readtConcretestep 查询所有' + name + '发送的消息:' + obj);
      // console.log(obj);
      res.send(name);
    } else {
      console.log('readtConcretestep 查询所有' + name + '发送的消息为空:' + err);
      res.send(null);
    }
  });
};

var sendAConcretestep = function (req, res) {
  // //console.log('call sendAConcretestep');
  //for(var i in req.body){ //console.log("sendAConcretestep 请求内容body子项："+i+"<>\n")};
  var datt = req.body;
  if (!datt) {
    return;
  }
  // //console.log('senderID:'+senderID);
  concretestepDAO.sendAConcretestep(datt, function (err, obj) {
    if (!err) {
      console.log('sendAConcretestep 查询所有发送的消息:' + obj._id);
      res.send(obj);
    } else {
      console.log('sendAConcretestep 查询所有发送的消息为空:' + err);
      res.send(null);
    }
  });
};
var geteventstep = function (req, res) {
  // //console.log('call geteventstep');
  //for(var i in req.body){ //console.log("geteventstep 请求内容body子项："+i+"<>\n")};
  var datt = req.body.id;//传入事件id
  console.log(datt)
  if (!datt) {
    res.send({error:'参数错误'});
  }else {
    concreteeventDAO.getIncompletesteps(datt, function (err, obj) {
      if (obj) {
        //console.log('getIncompletesteps 成功-' + obj)
        concretestepDAO.geteventstep(obj.step, function (err, obj) {
          // var jjj=obj.clone();
          // jjj.newproperty="11";
          if (!err) {
            res.send({success:obj});
          } else {
            res.send({error:'获取步骤出错'});
          }
        });
      } else {
        res.send({error:'获取步骤出错'})
      }
    })
    // //console.log('senderID:'+senderID);

  }
};

var getcurrentstep = function (req,res){
  console.log('123')
}

var getConcretestepsInATimeSpanFromWho = function (req, res) {
  // //console.log('call getConcretestepsInATimeSpanFromWho');
  //for(var i in req.body){ //console.log("getConcretestepsInATimeSpanFromWho 请求内容body子项："+i+"<>\n")};
  var receiverID = req.body.receiverID,
    senderID = req.body.senderID,
    startTime = req.body.startTime,
    lastTime = req.body.lastTime;
  // 调用方法
  // concretestepObj.getConcretestepsInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
  // //console.log('senderID:'+senderID);
  concretestepDAO.getConcretestepsInATimeSpanFromWho(receiverID, senderID, startTime, lastTime, function (err, obj) {
    if (!err) {
      // console.log('getConcretestepsInATimeSpanFromWho 查询所有'+senderID+'发送的消息id:'+obj);
      res.send(obj);
    } else {
      //console.log('getConcretestepsInATimeSpanFromWho 查询所有'+senderID+'发送的消息为空:'+err);
      res.send(null);
    }
  });
};
var getoneeventstep = function (req, res) {
  var ID = req.body.id;
  concretestepDAO.getoneeventstep(ID,function (err, obj) {
    if (!err) {
      res.send(obj);
      // console.log(obj);
    } else {
      // console.log(err);
      res.send(null);
    }
  })
}


concretesteprouter.post('/sendAConcretestep', sendAConcretestep);//增加
concretesteprouter.post('/geteventstep', geteventstep);
concretesteprouter.post('/getcurrentstep',getcurrentstep);//获取当前进行的步骤
concretesteprouter.post('/readtConcretestep', readtConcretestep);//提交
concretesteprouter.post('/getMyNewestConcretestepFromWho', getMyNewestConcretestepFromWho);//编辑查询
concretesteprouter.post('/getConcretestepsInATimeSpanFromWho', getConcretestepsInATimeSpanFromWho);//编辑查询
concretesteprouter.post('/getoneeventstep',getoneeventstep);//根据用户id得到事件步骤

concretesteprouter.post('/concretestepDelete', concretestepDelete);//查找
concretesteprouter.post('/concretesteppeopleDelete', concretesteppeopleDelete);//查找
module.exports = concretesteprouter;