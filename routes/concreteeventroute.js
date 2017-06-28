var express = require('express');
var concreteeventrouter = express.Router();


var concreteevent = require('../dbmodels/concreteeventschema.js');
// console.log('concreteevent数据模型是否存在：'+concreteevent);

//获取数据模型
var concreteeventDAO = require('../dbmodels/concreteeventDao');//具体事件表
var abstracttypeDAO = require('../dbmodels/abstracttypeDao'); //抽象类型
var abstractstepDAO = require('../dbmodels/abstractstepDao'); //抽象步骤

var concretearguDAO = require('../dbmodels/concretearguDao');//具体参数表
var concretestepDAO = require('../dbmodels/concretestepDao');//具体步骤表


var getMyNewestConcreteeventFromWho = function (req, res) {
    // //console.log('call getMyNewestConcreteeventFromWho');
    //for(var i in req.body){ //console.log("getMyNewestConcreteeventFromWho 请求内容body子项："+i+"<>\n")};
    var receiverID = req.body.receiverID,
        senderID = req.body.senderID,
        isAbstract = req.body.isAbstract;

    // console.log('senderID:'+senderID);
    concreteeventDAO.getMyNewestConcreteeventFromWho(receiverID, senderID, isAbstract, function (err, obj) {
        if (!err) {
            // //console.log('getMyNewestConcreteeventFromWho 查询所有'+senderID+'发送的消息:'+obj);
            res.send(obj);
        } else {
            // //console.log('getMyNewestConcreteeventFromWho 查询所有'+senderID+'发送的消息为空:'+err);
            res.send(null);
        }
    });
};

var concreteeventDelete = function (req, res) {
    var id = req.body.id;
    console.log('删除' + id);
    concreteeventDAO.concreteeventDelete(id, function (err, obj) {
        if (!err) {
            console.log('readtConcreteevent 查询所有' +id+ '发送的消息:' + obj);
            res.send(id);
        } else {
            console.log('readtConcreteevent 查询所有' + id + '发送的消息为空:' + err);
            res.send(null);
        }
    })
}
var concreteeventpeopleDelete = function (req, res) {
    var areaID = req.body.areaId;
    var position = req.body.position;
    concreteeventDAO.concreteeventpeopleDelete(areaID, position, function (err, obj) {
        if (!err) {
            console.log('readtConcreteevent 查询所有' + areaID + '发送的消息:' + obj);
            res.send(areaID);
        } else {
            console.log('readtConcreteevent 查询所有' + areaID + '发送的消息为空:' + err);
            res.send(null);
        }
    })
}


var readtConcreteevent = function (req, res) {
    //console.log('call readtConcreteevent');
    // for(var i in req.body){
    //     console.log("readtConcreteevent 请求内容body子项："+i+"<>\n")
    // };
    // console.log(req.body);
    var name = req.body;
    // console.log(name);
    // 调用方法
    // concreteeventObj.getConcreteeventsInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // console.log('messID:'+messID);
    concreteeventDAO.readtConcreteevent(name, function (err, obj) {
        if (!err) {
            // console.log('没有错误')
            console.log('readtConcreteevent 查询所有' + name + '发送的消息:' + obj);
            // console.log(obj);
            res.send(name);
        } else {
            console.log('readtConcreteevent 查询所有' + name + '发送的消息为空:' + err);
            res.send(null);
        }
    });
};
var getAllConcreteevent = function (req, res) {

    concreteeventDAO.getAllConcreteevent(function (err, obj){
        if (err) {
            console.log('没有数据')
            res.send(null)
        } else {
            console.log('正常数据')
            res.send(obj);
        }
    })
};
var sendAConcreteevent = function (req, res){
    // //console.log('call sendAConcreteevent');
    //for(var i in req.body){ //console.log("sendAConcreteevent 请求内容body子项："+i+"<>\n")};
    var datt = req.body;
    var name = datt.name;  //名称
    var typeID = datt.type; //类型
    if (!datt) {
        return;
    }
    //console.log(typeID);
    abstracttypeDAO.getoneeventtype(typeID, function (err, obj) { //抽象类型
        if (err) {
            console.log(err);
        } else {
            for (var i = 0, stepid = []; i < obj.steps.length; i++) { //循环出人员id数组
                stepid.push(obj.steps[i]);
            }
            console.log(stepid); //抽象步骤 id
            var Allobj = {};//存储所有公共变量

            Allobj.eventstepID=[];

            var eventJson = {};
            eventJson.type = obj.typeName;
            eventJson.name = name;
            eventJson.newer = new Date();
            eventJson.status = 1;
            eventJson.step = [];
            obj.steps.forEach(function (val, key) {
                //eventJson.step.push({types: val.stepName, status: 1});
            })
            //console.log(eventJson)
            concreteeventDAO.sendAConcreteevent(eventJson, function (coneventerr, coneventobj) { //具体类型
                if (coneventerr) {
                    console.log(coneventerr)
                } else {
                    Allobj.ConcreteeventID = coneventobj._id; //创建的具体类型ID 添加步骤id
                    console.log(coneventobj._id);
                    geteventsteps(stepid) //获取抽象步骤
                }
            })
            var geteventsteps = function (stepid) {
                abstractstepDAO.geteventsteps(stepid, function (err, stepobj) { //查到人员json数据  抽象步骤
                    if (err) {
                        console.log(err);
                    } else {
                                    //stepobj 抽象步骤 数组 多条记录
                        var steplength=stepobj.length;
                        var count=0, argu1 = {};

                        var jiazai=function(){
                            console.log(count>=steplength)
                            if (count>=steplength) {
                                console.log('跳出')
                                return;
                            }
                            argu1.name = stepobj[count].type;
                            argu1.type = obj.typeName;
                            argu1.status = 1;
                            argu1.wordTemplate = stepobj[count].wordTemplate;
                            argu1.currentPusher = 'null';
                            argu1.argu = [];
                            //console.log(stepobj[count]); //得到抽象表步骤 实例化成具体步骤和参数
                                console.log('再来一次'+count);

                                sendAConcretestep(argu1, stepobj[count], function (a) {
                                    //console.log($scope.abstracttype)
                                    if (count < steplength) {
                                        count++;
                                        jiazai();
                                    }
                                    console.log(count + '----' + steplength)
                                })

                        }
                        jiazai();
                    }
                })
            }
            var sendAConcretestep = function (argu1,stepobj,call) {

                concretestepDAO.sendAConcretestep(argu1, function (err, Concretestepobj) { //具体步骤表
                    if (err) {
                        console.log(err)
                    } else {
                        Allobj.eventstepID.push(Concretestepobj._id);
                        Allobj.iseventstep = Concretestepobj._id;
                        Allobj.eventargu = [];

                        //garmentsConcret(argujson);//添加具体参数表
                        //console.log('ceshi+++++++')
                        //console.log(Concretestepobj)
                        console.log("添加具体参数表")
                        console.log(Allobj)

                        updateaddsetp(Allobj,stepobj,function(e){//把具体步骤的id存到具体类型中
                                console.log('把具体步骤的id存到具体类型中') //应该调取两次
                            res.send(e);
                            call('true')
                                //console.log(stepobj)
                        })  //修改步骤 //把具体步骤的id存到具体类型中

                    }
                });

            }
            var updateaddsetp=function(Allobj,stepobj,call){

                //console.log('ceshi+++++++')
                //console.log(stepobj)
                //console.log('ceshi--------')
                concreteeventDAO.updateaddsetp(Allobj.ConcreteeventID, Allobj.eventstepID, function (err, obj) {//把具体步骤的id存到具体类型中
                    if (err) {
                        console.log(err)
                    } else {
                        Allobj.eventargu.push(obj._id)
                        //console.log(obj)
                        // 添加具体参数表
                        var concretestep = {},arguArr=[];
                        var json = stepobj; //抽象步骤
                        var argu1 = json.argument;
                        //console.log(json)
                        for (var k = 0; k < argu1.length; k++) {
                            var  newObj = {};
                            newObj.identified = '1';
                            newObj.setTime = new Date();
                            newObj.setByWho = json.author;
                            newObj.type = argu1[k].argutype;
                            newObj.value = [argu1[k].name];
                            arguArr.push(newObj);
                            //console.log('抽象步骤');
                        }
                        sendAllConcreteargu(arguArr,function(){
                            call()

                        }); //具体参数表
                    }
                })
            }
            var sendAllConcreteargu=function(ARR,call){
                //console.log('次数')
                //console.log(ARR)
                var arguID = [];
                concretearguDAO.sendAllConcreteargu(ARR, function (err, obj) { //具体参数表
                    if (err) {
                        console.log(err);
                    } else {
                        arguID.push(obj._id)
                        //console.log(arguID)

                        //for (var i = 0; i < Allobj.eventstepID.length; i++) {
                            updateaddargu(Allobj.iseventstep, arguID,function(id,argu){
                                call()
                            })//步骤表添加参数id
                        //}
                        //console.log('--+--')
                        //concretestepDAO.sendAConcretestep()
                    }
                })
            }
            var updateaddargu=function(ID,argu,call){  //步骤表添加参数id

                console.log('次数测量')
                console.log(ID,argu)
                concretestepDAO.updateaddargu(ID,argu, function (err, arguupdate) {
                    if (err) {

                    } else {
                        call()
                    }
                })
            }
        }
    })
    var garmentsConcret = function (data) {

    }

    // concreteeventDAO.sendAConcreteevent(datt, function (err, obj) {
    //   if (!err) {
    //     console.log('sendAConcreteevent 查询所有发送的消息:' + obj._id);
    //     res.send(obj);
    //   } else {
    //     console.log('sendAConcreteevent 查询所有发送的消息为空:' + err);
    //     res.send(null);
    //   }
    // });
};
var currentProcessedevents = function (req, res) {
    var Id = req.body.id;
    if (Id) {
        concreteeventDAO.currentProcessedevents(Id, function (err, obj) {
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
    concreteeventDAO.getIncompletesteps(event, function (err, obj) {
        if (event) {
            console.log('getIncompletesteps 成功-' + obj)
            res.send(obj)
        } else {
            console.log('getIncompletesteps 错误- ' + err)
        }
    })
}
var getConcreteeventsInATimeSpanFromWho = function (req, res) {
    // //console.log('call getConcreteeventsInATimeSpanFromWho');
    //for(var i in req.body){ //console.log("getConcreteeventsInATimeSpanFromWho 请求内容body子项："+i+"<>\n")};
    var receiverID = req.body.receiverID,
        senderID = req.body.senderID,
        startTime = req.body.startTime,
        lastTime = req.body.lastTime;
    // 调用方法
    // concreteeventObj.getConcreteeventsInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // //console.log('senderID:'+senderID);
    concreteeventDAO.getConcreteeventsInATimeSpanFromWho(receiverID, senderID, startTime, lastTime, function (err, obj) {
        if (!err) {
            // console.log('getConcreteeventsInATimeSpanFromWho 查询所有'+senderID+'发送的消息id:'+obj);
            res.send(obj);
        } else {
            //console.log('getConcreteeventsInATimeSpanFromWho 查询所有'+senderID+'发送的消息为空:'+err);
            res.send(null);
        }
    });
};


concreteeventrouter.post('/sendAConcreteevent', sendAConcreteevent);//增加
concreteeventrouter.post('/readtConcreteevent', readtConcreteevent);//提交
concreteeventrouter.post('/getAllConcreteevent', getAllConcreteevent);//提交
//concreteeventrouter.post('/getAllConcreteevent', getAllConcreteevent);//提交

concreteeventrouter.post('/getMyNewestConcreteeventFromWho', getMyNewestConcreteeventFromWho);//编辑查询
concreteeventrouter.post('/getConcreteeventsInATimeSpanFromWho', getConcreteeventsInATimeSpanFromWho);//编辑查询
concreteeventrouter.post('/concreteeventDelete', concreteeventDelete);//查找
concreteeventrouter.post('/concreteeventpeopleDelete', concreteeventpeopleDelete);//查找

concreteeventrouter.post('/currentProcessedevents', currentProcessedevents);//根据用户id得到当前需要处理的事件
concreteeventrouter.post('/getIncompletesteps', getIncompletesteps);//根据事件得到当前未完成的步骤


//
//根据步骤得到当前未填报的信息  stepsGetnotfillingInfo
//根据部门得到所有的人员title     getPersontit
//根据部门得到当前本部门所有的事件类型 departmentGetAlleventType
//根据部门得到本部门所有的事件  departmentGetGetAllevent
//根据用户id得到工作消息提醒   userGetworkmessage
module.exports = concreteeventrouter;