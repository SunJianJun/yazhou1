/**
 * @module 个人信息配置模块 url:  /personalinfo
 */
var express = require('express');
var personinfo = express.Router();

//获取数据模型
var personDAO = require('../dbmodels/personDAO.js');
var depertmentDAO=require('../dbmodels/departmentDao.js');
var attendanceRecordDao=require('../dbmodels/attendanceRecordDao.js');
//console.log(attendanceRecordDao)


/**
 * 人员请假
 * @param {json} req - 传入人员请假json数据，例如{personID:'123456',startTime:date,endTime:Date,reason:'请假理由'}
 * @param {json} res - 返回成功后的json 例如：{success:''}
 */
var sendpersonaskforleave=function(req,res){
    var datt=req.body;
  var start=datt.startTime,end=datt.endTime,reason=datt.reason;
  if(start&&end&&reason) {
    var leave={};
    leave.personID=datt.personID;
    leave.askforleave={};
    leave.askforleave.startDateTime=start;
    leave.askforleave.endDateTime=end;
    leave.askforleave.reason=reason;
    //leave.abnormal = true;
    leave.status=2;
    //res.send(leave)
    attendanceRecordDao.save(leave,function(err,obj){
          if(err) {
            res.send({error:'发生错误'});
          } else{
            res.send(obj);
          }
      });
  }else{
    res.send({error:'参数错误'})
  }
};
/**
 * 添加正常考勤记录
 * @param {json} req - 传入人员和时间json数据，例如{personID:'123456'}
 * @param {json} res - 返回成功后的json 例如：{success:''}
 */
var sendpersoncheckdate=function(req,res){
    var datt=req.body;
  var id=datt.personID;
  if(id) {
    datt.checkdate=new Date().toLocaleDateString();
    //console.log(datt)
    attendanceRecordDao.save(datt, function (err, obj) {
      if (err) {
        res.send({error: '发生错误'});
      } else {
        res.send(obj);
      }
    });
  }else{
    res.send({error: '参数错误'});
  }
};
/**
 * 换班
 * @param {json} req - 传入人员和时间json数据，例如{personID:'123456',startTime:date,endTime:Date,shift:'换班人ID'}
 * @param {json} res - 返回成功后的json 例如：{success:''}
 */
var sendpersonshift=function(req,res){
    var datt=req.body;
    if(!datt){return;}
    var alternateattendanceRecord=datt.shift,
        start=datt.startTime,
        end=datt.endTime;
  var leave={};
  leave.shift={};
  leave.personID=datt.personID;
  leave.shift.startDateTime=start;
  leave.shift.endDateTime=end;
    attendanceRecordDao.save(leave,function(err,obj){
          if(!err) {
              res.send(obj);
          } else{
              res.send({error:null});
          }
      })
};
/**
 * 脱岗 - 暂时不做
 * @param {json} req - 传入人员和时间json数据，例如{personID:'123456',startTime:date,endTime:Date}
 * @param {json} res - 返回成功后的json 例如：{success:''}
 */
var sendpersonleave=function(req,res){
  res.send({success:'暂时不做，请重换接口'})
    //attendanceRecordDao.sendperson()
};
/**
 * 离职 - 暂时不做
 * @param {json} req - 传入人员和时间json数据，例如{personID:'123456',startTime:date,endTime:Date}
 * @param {json} res - 返回成功后的json 例如：{success:''}
 */
var personjsResignation=function(req,res){
  res.send({success:'暂时不做，请重换接口'})
  //attendanceRecordDao.sendpersoResignation()
}
/**
 * 获取一个人的考勤记录
 * @param {json} req - 传入人员和时间段json数据，例如{personID:'123456',startTime:date,endTime:Date}
 * @param {json} res - 返回成功后的json 例如：[{}]
 */
var getpersontoid=function(req,res){
  var datt=req.body;
  var person=datt.personID,
    start=datt.startTime,
    end=datt.endTime;
  if(person&&start&&end) {
    attendanceRecordDao.getpersontoid(person, start, end, function (err, obj) {
      if (!err) {
        res.send(obj);
      } else {
        res.send({error:'获取错误'});
      }
    })
  }else{
    res.send({error:'参数错误'});
  }
};
/**
 * 修改自己的个人密码，必须输入原密码
 * @param {json} req - 客户端提交json，没有id可以提交身份证号， 例如{_id:'用户id',idNum:'用户身份证',opwd:'原密码',npwd:'新密码'}
 * @param {json} res  返回提示修改成功，或者原密码错误
 */
var updatepersonpassword=function(req,res){
    var json=req.body,
        uid=json._id,
        idNum=json.idNum,
        opwd=json.opwd,
        npwd=json.npwd;
    personDAO.updatepersonpassword(uid,idNum,opwd,npwd,function(err,obj){
        if(err){
            res.send('修改失败')
        }else{
            res.send(obj)
        }
    })
}
/**
 * 身份信息有误上报 - 待完善
 * @param {json} req
 * @param {json} res
 */
var sendpersoninfoerr=function(req,res){

}
/**
 * 二维码扫描，登录桌面端 - 待完善
 * @param {json} req - 客户端提交json，例如{_id:'用户id',idNum:'用户身份证'}
 * @param {json} res - 手机自动填入登陆信息，登陆客户端界面
 */
var getpersontwocode=function(req,res){

}



personinfo.post('/sendpersonaskforleave',sendpersonaskforleave);//提交
personinfo.post('/sendpersoncheckdate',sendpersoncheckdate);
personinfo.post('/sendpersonshift',sendpersonshift);
personinfo.post('/getpersontoid',getpersontoid);

module.exports = personinfo;