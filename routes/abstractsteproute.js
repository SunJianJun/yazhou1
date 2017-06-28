var express = require('express');
var abstractsteprouter = express.Router();


var abstractstep = require('../dbmodels/abstractstepschema.js');
// console.log('abstractstep数据模型是否存在：'+abstractstep);

//获取数据模型
var abstractstepDAO = require('../dbmodels/abstractstepDao');


var getpersonTiele = function (req, res) {
  abstractstepDAO.getpersonTiele (function(err,obj){
        console.log(err,obj)
        if(err){
            res.send(err);
        }else{
            res.send(obj);
        }
  });
};
var getstepsName = function (req, res) {
    var idArr=req.body.id;

    abstractstepDAO.getstepsName(idArr,function(err,obj){
        if(err){
            res.send(null);
        }else{
            res.send(obj);
        }
    });
    //var nameArr=[],
    //    idcount=0,
    //    idlength=idArr.length;
    //console.log('-------------华丽的分割线---------------')
    var idLoad=function(){
        //console.log(idArr)
        //console.log('人员步骤')
        //console.log(idArr[idcount])
        //    abstractstepDAO.getstepsName(idArr[idcount], function (err, obj) {
        //        if (err) {
        //            res.send(null);
        //        } else {
        //
        //
        //        }
        //    });
        idcount++;
        if(idcount<idlength){
            console.log(idArr[idcount])
            //nameArr.push(obj)
            //console.log(nameArr)
            idLoad();
        }
        else{
            console.log('完成')
            console.log(nameArr)
            res.send(nameArr);
        }
    }
    //idLoad();
};
var updatepersonpower= function (req, res) {
    var idArr=req.body.id;
    var pagscon=req.body.pagscon;
    abstractstepDAO.updatepersonpower(idArr,pagscon,function(err,obj){
        console.log(err,obj)
        if(err){
            res.send(err);
        }else{
            res.send(obj);
        }
    });
};
var removepersonpower= function (req, res) {
    var idArr=req.body.id;
    abstractstepDAO.removepersonpower(idArr,function(err,obj){
        console.log(err,obj)
        if(err){
            res.send(err);
        }else{
            res.send(obj);
        }
    });
};


var getMyNewestAbstractstepFromWho = function (req, res) {
    // //console.log('call getMyNewestAbstractstepFromWho');
    //for(var i in req.body){ //console.log("getMyNewestAbstractstepFromWho 请求内容body子项："+i+"<>\n")};
    var receiverID = req.body.receiverID,
        senderID = req.body.senderID,
        isAbstract = req.body.isAbstract;

    // console.log('senderID:'+senderID);
    abstractstepDAO.getMyNewestAbstractstepFromWho(receiverID, senderID, isAbstract, function (err, obj) {
        if (!err) {
            // //console.log('getMyNewestAbstractstepFromWho 查询所有'+senderID+'发送的消息:'+obj);
            res.send(obj);
        } else {
            // //console.log('getMyNewestAbstractstepFromWho 查询所有'+senderID+'发送的消息为空:'+err);
            res.send(null);
        }
    });
};
var abstractstepAdd = function (req, res) {

};
var abstractstepDelete = function (req, res) {
    var name = req.body.name;
    console.log('删除' + name);
    abstractstepDAO.abstractstepDelete(name, function (err, obj) {
        if (!err) {
            console.log('readtAbstractstep 查询所有' + name + '发送的消息:' + obj);
            res.send(name);
        } else {
            console.log('readtAbstractstep 查询所有' + name + '发送的消息为空:' + err);
            res.send(null);
        }
    })
}
var abstractsteppeopleDelete = function (req, res) {
    var areaID = req.body.areaId;
    var position = req.body.position;
    abstractstepDAO.abstractsteppeopleDelete(areaID, position, function (err, obj) {
        if (!err) {
            console.log('readtAbstractstep 查询所有' + areaID + '发送的消息:' + obj);
            res.send(areaID);
        } else {
            console.log('readtAbstractstep 查询所有' + areaID + '发送的消息为空:' + err);
            res.send(null);
        }
    })
}
var getoneeventstep = function (req, res) {
    var ID = req.body.id;
    abstractstepDAO.getoneeventstep(ID,function (err, obj) {
        if (!err) {
            res.send(obj);
            console.log(obj);
        } else {
            console.log(err);
            res.send(null);
        }
    })
}
var geteventsteps= function (req, res) {
    var ID = req.body.id;
    abstractstepDAO.geteventsteps(ID,function (err, obj) {
        if (!err) {
            res.send(obj);
            console.log(obj);
        } else {
            console.log(err);
            res.send(null);
        }
    })
}


var readtAbstractstep = function (req, res) {
    //console.log('call readtAbstractstep');
    // for(var i in req.body){
    //     console.log("readtAbstractstep 请求内容body子项："+i+"<>\n")
    // };
    // console.log(req.body);
    var name = req.body;
    // console.log(name);
    // 调用方法
    // abstractstepObj.getAbstractstepsInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // console.log('messID:'+messID);
    abstractstepDAO.readtAbstractstep(name, function (err, obj) {
        if (!err) {
            // console.log('没有错误')
            console.log('readtAbstractstep 查询所有' + name + '发送的消息:' + obj);
            // console.log(obj);
            res.send(name);
        } else {
            console.log('readtAbstractstep 查询所有' + name + '发送的消息为空:' + err);
            res.send(null);
        }
    });
};
var getAllAbstractstep = function (req, res) {

    console.log('获取所有步骤')
    var department=req.body.department;
    console.log(department)
    abstractstepDAO.getAllAbstractstep(department,function (err, obj) {
        if (!err) {
            res.send(obj);
            console.log(obj);
        } else {
            res.send(null);
            //console.log(err);
        }
    })
}
var geteventstepname=function (req, res) {

    console.log('获取步骤名称')
    var department=req.body.department;
    console.log(department)
    abstractstepDAO.geteventstepname(department,function (err, obj) {
        if (!err) {
            res.send(obj);
            console.log(obj);
        } else {
            res.send(null);
            //console.log(err);
        }
    })
}
var sendAAbstractstep = function (req, res) {
    // //console.log('call sendAAbstractstep');
    //for(var i in req.body){ //console.log("sendAAbstractstep 请求内容body子项："+i+"<>\n")};
    var datt = req.body;
    console.log(datt)
    if (!datt) {
        return;
    }
    abstractstepDAO.sendAAbstractstep(datt, function (err, obj) {
        if (!err) {
            console.log('sendAAbstractstep 查询所有发送的消息:' + obj._id);
            res.send(obj);
        } else {
            console.log('sendAAbstractstep 查询所有发送的消息为空:' + err);
            res.send(null);
        }
    });
};
var currentProcessedevents = function (req, res) {
    var Id = req.body.id;
    if (Id) {
        abstractstepDAO.currentProcessedevents(Id, function (err, obj) {
            if (err) {
                console.log('currentProcessedevents 查询出错：' + err);
            } else {
                console.log('currentProcessedevents 查询当前事件：' + obj)
            }
        })
    }
}
var getIncompletesteps = function (req, res) {
    var event = req.body;
    abstractstepDAO.getIncompletesteps(event, function (err, obj) {
        if (event) {
            console.log('getIncompletesteps 成功-' + obj)
            res.send(obj)
        } else {
            console.log('getIncompletesteps 错误- ' + err)
        }
    })
}
var getAbstractstepsInATimeSpanFromWho = function (req, res) {
    // //console.log('call getAbstractstepsInATimeSpanFromWho');
    //for(var i in req.body){ //console.log("getAbstractstepsInATimeSpanFromWho 请求内容body子项："+i+"<>\n")};
    var receiverID = req.body.receiverID,
        senderID = req.body.senderID,
        startTime = req.body.startTime,
        lastTime = req.body.lastTime;
    // 调用方法
    // abstractstepObj.getAbstractstepsInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // //console.log('senderID:'+senderID);
    abstractstepDAO.getAbstractstepsInATimeSpanFromWho(receiverID, senderID, startTime, lastTime, function (err, obj) {
        if (!err) {
            // console.log('getAbstractstepsInATimeSpanFromWho 查询所有'+senderID+'发送的消息id:'+obj);
            res.send(obj);
        } else {
            //console.log('getAbstractstepsInATimeSpanFromWho 查询所有'+senderID+'发送的消息为空:'+err);
            res.send(null);
        }
    });
};


abstractsteprouter.post('/getpersonTiele', getpersonTiele);//增加
abstractsteprouter.post('/getstepsName', getstepsName);//增加
abstractsteprouter.post('/updatepersonpower', updatepersonpower);//修改步骤信息
abstractsteprouter.post('/removepersonpower', removepersonpower);//修改步骤信息

abstractsteprouter.post('/sendAAbstractstep', sendAAbstractstep);//增加
abstractsteprouter.post('/readtAbstractstep', readtAbstractstep);//提交
abstractsteprouter.post('/getAllAbstractstep', getAllAbstractstep);//提交
abstractsteprouter.post('/geteventstepname',geteventstepname);//根据用户id得到事件步骤名称

abstractsteprouter.post('/getMyNewestAbstractstepFromWho', getMyNewestAbstractstepFromWho);//编辑查询
abstractsteprouter.post('/getAbstractstepsInATimeSpanFromWho', getAbstractstepsInATimeSpanFromWho);//编辑查询
abstractsteprouter.post('/abstractstepDelete', abstractstepDelete);//查找
abstractsteprouter.post('/abstractsteppeopleDelete', abstractsteppeopleDelete);//查找
abstractsteprouter.post('/getoneeventstep',getoneeventstep);//根据用户id得到事件步骤
abstractsteprouter.post('/geteventsteps',geteventsteps);//根据用户id得到事件多项步骤

abstractsteprouter.post('/currentProcessedevents', currentProcessedevents);//根据用户id得到当前需要处理的事件
abstractsteprouter.post('/getIncompletesteps', getIncompletesteps);//根据事件得到当前未完成的步骤

//
//根据步骤得到当前未填报的信息  stepsGetnotfillingInfo
//根据部门得到所有的人员title     getPersontit
//根据部门得到当前本部门所有的事件类型 departmentGetAlleventType
//根据部门得到本部门所有的事件  departmentGetGetAllevent
//根据用户id得到工作消息提醒   userGetworkmessage
module.exports = abstractsteprouter;