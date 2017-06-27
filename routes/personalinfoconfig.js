/**
 * @module 个人信息配置模块
 */
var express = require('express');
var personinfo = express.Router();

//获取数据模型
var personDAO = require('../dbmodels/personDAO.js');
var depertmentDAO=require('../dbmodels/departmentDao.js');


/**
 * 请假
 * @param {json} req - 传入绘制网格json数据，例如{}
 * @param {json} res - 返回成功后的json 例如：{}
 */
var personjs=function(req,res){

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
}
/**
 * 换班
 * @param {json} req
 * @param {json} res
 */
var personjs=function(req,res){

}
/**
 * 脱岗
 * @param {json} req
 * @param {json} res
 */
var personjs=function(req,res){

}
/**
 * 离职
 * @param {json} req
 * @param {json} res
 */
var personjs=function(req,res){

}
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
 * 身份信息有误上报
 * @param {json} req
 * @param {json} res
 */
var personjs=function(req,res){

}
/**
 * 二维码扫描，登录桌面端
 * @param {json} req
 * @param {json} res
 */
var personjs=function(req,res){

}



personinfo.post('/sendASpotarea',personjs);//提交
module.exports = personinfo;