var express = require('express');
var abstractsteprouter = express.Router();


var abstractstep = require('../dbmodels/abstractstepschema.js');
// console.log('abstractstep数据模型是否存在：'+abstractstep);

//获取数据模型
var abstractstepDAO = require('../dbmodels/abstractstepDao');
var persontitleDAO=require('../dbmodels/persontitleDao');

/*
* 获取人员title
*/
var getpersonTiele = function (req, res) {
    var deparment=req.body.departmentID;
    deparment=deparment?deparment:'58c3a5e9a63cf24c16a50b8c';
  persontitleDAO.getpersontitleTodepartment(deparment,function(err,obj){
        if(err){
            res.send({error:err});
        }else{
            res.send({success:obj});
        }
  });
};
var getstepsName = function (req, res) {
    var idArr=req.body.id;
    // console.log(idArr)
  if(!idArr){

  }else {
    for (var i = 0, arr = []; i < idArr.length; i++) {
      arr.push(idArr[i].step)
    }
    // console.log(arr)
    abstractstepDAO.getstepsName(arr,function(err,obj){
        if(err){
            res.send(null);
        }else{
            res.send(obj);
        }
    });
  }
};
var updatepersonpower= function (req, res) {
    var idArr=req.body.id;
    var pagscon=req.body.pagscon;
  pagscon.updateTime=new Date();
    abstractstepDAO.updatepersonpower(idArr,pagscon,function(err,obj){
        // console.log(err,obj)
        if(err){
            res.send(err);
        }else{
            res.send(obj);
        }
    });
};
var removepersonpower= function (req, res){
    var idArr=req.body.id;
    abstractstepDAO.removepersonpower(idArr,function(err,obj){
        if(err){
            res.send(err);
        }else{
            res.send(obj);
        }
    });
};


var abstractsteppeopleDelete = function (req, res) {
    var areaID = req.body.areaId;
    var position = req.body.position;
    abstractstepDAO.abstractsteppeopleDelete(areaID, position, function (err, obj) {
        if (!err) {
            res.send(areaID);
        } else {
            res.send(null);
        }
    })
}
var getoneeventstep = function (req, res) {
    var ID =req.body.id;
    //console.log(ID)
    abstractstepDAO.getoneeventstep(ID,function (err, obj) {
        if (!err) {
            res.send(obj);
        } else {
            res.send(null);
        }
    })
}

var readtAbstractstep = function (req, res) {
    var name = req.body;
    // console.log(name);
    // 调用方法
    // abstractstepObj.getAbstractstepsInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // console.log('messID:'+messID);
    abstractstepDAO.readtAbstractstep(name, function (err, obj) {
        if (!err) {
            res.send(name);
        } else {
            res.send(null);
        }
    });
};

/**
 *
 * @param req
 * @param res
 */
var getAllAbstractstep = function (req, res) {

    // console.log('获取所有步骤')
    var department=req.body.department;
    // console.log(department)
    abstractstepDAO.getAllAbstractstep(department,function (err, obj) {
        if (!err) {
            res.send(obj);
        } else {
            res.send(null);
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
            res.send(obj);
        } else {
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

abstractsteprouter.post('/abstractsteppeopleDelete', abstractsteppeopleDelete);//查找
abstractsteprouter.post('/getoneeventstep',getoneeventstep);//根据用户id得到事件步骤


//
//根据步骤得到当前未填报的信息  stepsGetnotfillingInfo
//根据部门得到所有的人员title     getPersontit
//根据部门得到当前本部门所有的事件类型 departmentGetAlleventType
//根据部门得到本部门所有的事件  departmentGetGetAllevent
//根据用户id得到工作消息提醒   userGetworkmessage
module.exports = abstractsteprouter;