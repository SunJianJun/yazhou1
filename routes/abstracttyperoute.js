var express = require('express');
var abstracttyperouter = express.Router();


var abstracttype = require('../dbmodels/abstracttypeschema.js');
// console.log('abstracttype数据模型是否存在：'+abstracttype);

//获取数据模型
var abstracttypeDAO = require('../dbmodels/abstracttypeDao');

var getMyNewestAbstracttypeFromWho = function (req, res) {
    // //console.log('call getMyNewestAbstracttypeFromWho');
    //for(var i in req.body){ //console.log("getMyNewestAbstracttypeFromWho 请求内容body子项："+i+"<>\n")};
    var receiverID = req.body.receiverID,
        senderID = req.body.senderID,
        isAbstract = req.body.isAbstract;

    // console.log('senderID:'+senderID);
    abstracttypeDAO.getMyNewestAbstracttypeFromWho(receiverID, senderID, isAbstract, function (err, obj) {
        if (!err) {
            // //console.log('getMyNewestAbstracttypeFromWho 查询所有'+senderID+'发送的消息:'+obj);
            res.send(obj);
        } else {
            // //console.log('getMyNewestAbstracttypeFromWho 查询所有'+senderID+'发送的消息为空:'+err);
            res.send(null);
        }
    });
};
var abstracttypeAdd = function (req, res) {

};
var abstracttypeDelete = function (req, res) {
    var id = req.body.id;
    console.log('删除' + id);
    abstracttypeDAO.abstracttypeDelete(id, function (err, obj) {
        if (!err) {
            console.log('readtAbstracttype 查询所有' + id + '发送的消息:' + obj);
            res.send(id);
        } else {
            console.log('readtAbstracttype 查询所有' + id + '发送的消息为空:' + err);
            res.send(null);
        }
    })
}

/**
 * 类型修改，步骤添加
 * @param req
 * @param res
 */
var updateAbstracttype = function (req, res) {
    var data = req.body;
    console.log('修改');
    console.log(data)
    var id = data.typeid;
    var newName = data.typeName;
    var step = data.step;
    if (id) {
        abstracttypeDAO.updateAbstracttype(id, newName, step, function (err, obj) {
            if (!err) {
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
    abstracttypeDAO.abstracttypepeopleDelete(areaID, position, function (err, obj) {
        if (!err) {
            console.log('readtAbstracttype 查询所有' + areaID + '发送的消息:' + obj);
            res.send(areaID);
        } else {
            console.log('readtAbstracttype 查询所有' + areaID + '发送的消息为空:' + err);
            res.send(null);
        }
    })
}

/**
 *
 * @param req
 * @param res
 */
var readtAbstracttype = function (req, res) {
    //console.log('call readtAbstracttype');
    // for(var i in req.body){
    //     console.log("readtAbstracttype 请求内容body子项："+i+"<>\n")
    // };
    // console.log(req.body);
    var name = req.body;
    // console.log(name);
    // 调用方法
    // abstracttypeObj.getAbstracttypesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // console.log('messID:'+messID);
    abstracttypeDAO.readtAbstracttype(name, function (err, obj) {
        if (!err) {
            // console.log('没有错误')
            console.log('readtAbstracttype 查询所有' + name + '发送的消息:' + obj);
            // console.log(obj);
            res.send(name);
        } else {
            console.log('readtAbstracttype 查询所有' + name + '发送的消息为空:' + err);
            res.send(null);
        }
    });
};
/**
 * 根据部门获取所有的事件类型
 * @param req
 * @param res
 */
var getAllAbstracttype = function (req, res) {
    var dep = req.body.department;
    console.log(dep)



    if (dep) {
        abstracttypeDAO.getAllAbstracttype(dep, function (err, obj) {
            if (!err) {
                res.send(obj);
            } else {
                res.send({error: null});
            }
        })
    }else{
        res.send({error: '参数错误'});
    }
}
var getoneeventtype = function (req, res) {
    var type = req.body.type;

    abstracttypeDAO.getoneeventtype(type, function (err, obj) {
        if (!err) {
            res.send(obj);
            //console.log(obj);
        } else {
            //console.log(err);
            res.send(null);
        }
    })
}

/**
 * 新建一个部门的事件类型
 * @param {json} req - {typeName:'',createparent:'',department:''}
 * @param {json} res - 成功返回新建类型，失败{error: '参数错误'}
 */
var sendAAbstracttype = function (req, res) {
    // //console.log('call sendAAbstracttype');
    //for(var i in req.body){ //console.log("sendAAbstracttype 请求内容body子项："+i+"<>\n")};
    var datt = req.body;
    // console.log(datt+'')
    if (!datt.typeName && !datt.createparent) {
        res.send({error: '参数错误'});
        return;
    }
    // //console.log('senderID:'+senderID);
    abstracttypeDAO.sendAAbstracttype(datt, function (err, obj) {
        if (!err) {
            console.log('sendAAbstracttype 查询所有发送的消息:' + obj._id);
            res.send(obj);
        } else {
            console.log('sendAAbstracttype 查询所有发送的消息为空:' + err);
            res.send(null);
        }
    });
};



var getAbstracttypesInATimeSpanFromWho = function (req, res) {
    // //console.log('call getAbstracttypesInATimeSpanFromWho');
    //for(var i in req.body){ //console.log("getAbstracttypesInATimeSpanFromWho 请求内容body子项："+i+"<>\n")};
    var receiverID = req.body.receiverID,
        senderID = req.body.senderID,
        startTime = req.body.startTime,
        lastTime = req.body.lastTime;
    // 调用方法
    // abstracttypeObj.getAbstracttypesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // //console.log('senderID:'+senderID);
    abstracttypeDAO.getAbstracttypesInATimeSpanFromWho(receiverID, senderID, startTime, lastTime, function (err, obj) {
        if (!err) {
            // console.log('getAbstracttypesInATimeSpanFromWho 查询所有'+senderID+'发送的消息id:'+obj);
            res.send(obj);
        } else {
            //console.log('getAbstracttypesInATimeSpanFromWho 查询所有'+senderID+'发送的消息为空:'+err);
            res.send(null);
        }
    });
};


abstracttyperouter.post('/sendAAbstracttype', sendAAbstracttype);//增加
abstracttyperouter.post('/readtAbstracttype', readtAbstracttype);//提交
abstracttyperouter.post('/getAllAbstracttype', getAllAbstracttype);// 获得所有类型
abstracttyperouter.post('/getoneeventtype', getoneeventtype);//根据类型名得到一个事件类型

abstracttyperouter.post('/getMyNewestAbstracttypeFromWho', getMyNewestAbstracttypeFromWho);//编辑查询
abstracttyperouter.post('/getAbstracttypesInATimeSpanFromWho', getAbstracttypesInATimeSpanFromWho);//编辑查询
abstracttyperouter.post('/abstracttypeDelete', abstracttypeDelete);//类型删除
abstracttyperouter.post('/updateAbstracttype', updateAbstracttype);//类型修改，步骤添加
abstracttyperouter.post('/abstracttypepeopleDelete', abstracttypepeopleDelete);//人员删除

//
//根据步骤得到当前未填报的信息  stepsGetnotfillingInfo
//根据部门得到所有的人员title     getPersontit
//根据部门得到当前本部门所有的事件类型 departmentGetAlleventtype
//根据部门得到本部门所有的事件  departmentGetGetAllevent
//根据用户id得到工作消息提醒   userGetworkmessage
module.exports = abstracttyperouter;