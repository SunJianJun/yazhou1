var express = require('express');
var abstracttyperouter = express.Router();

//获取数据模型
var attendanceRecordDAO = require('../dbmodels/attendanceRecordDAO');



var updateAbstracttype = function (req, res) {
    var data = req.body;
    console.log('修改');
    console.log(data)
    var id = data.typeid;
    var newName = data.typeName;
    var step = data.step;
    var newer = data.newer;
    if (id) {
        attendanceRecordDAO.updateAbstracttype(id, newName, step, newer, function (err, obj) {
            if (!err) {
                console.log(obj);
                res.send(data);
            } else {
                console.log(err);
                res.send(null);
            }
        })
    } else {
        res.send(null);
    }
}
var abstracttypepeopleDelete = function (req, res) {
    var areaID = req.body.areaId;
    var position = req.body.position;
    attendanceRecordDAO.abstracttypepeopleDelete(areaID, position, function (err, obj) {
        if (!err) {
            console.log('readtAbstracttype 查询所有' + areaID + '发送的消息:' + obj);
            res.send(areaID);
        } else {
            console.log('readtAbstracttype 查询所有' + areaID + '发送的消息为空:' + err);
            res.send(null);
        }
    })
}



abstracttyperouter.post('/getpersonrecordtoid', getpersonrecordtoid);//根据用户id得到当前需要处理的事件
abstracttyperouter.post('/getIncompletesteps', getIncompletesteps);//根据事件得到当前未完成的步骤
//
//根据步骤得到当前未填报的信息  stepsGetnotfillingInfo
//根据部门得到所有的人员title     getPersontit
//根据部门得到当前本部门所有的事件类型 departmentGetAlleventtype
//根据部门得到本部门所有的事件  departmentGetGetAllevent
//根据用户id得到工作消息提醒   userGetworkmessage
module.exports = abstracttyperouter;