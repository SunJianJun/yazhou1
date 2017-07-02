/**
 * @module 工作消息和群体通知模块
 */

var express = require('express');
var messagerouter = express.Router();

//获取数据模型
var personDAO = require('../dbmodels/personDAO.js');
var departmentDAO=require('../dbmodels/departmentDAO.js');
var attendanceRecordDao=require('../dbmodels/attendanceRecordDao.js');

var message = require('../dbmodels/messageschema.js');
	 //console.log('message数据模型是否存在：'+message);

//获取数据模型
var messageDAO = require('../dbmodels/messageDao');

/**
 * 得到一个人发送来的最新未读消息
 * @param {json} req - {receiverID:"58c043cc40cbb100091c640d",senderID:"58bff0836253fd4008b3d41b",isAbstract:false（是否需要摘要信息）// 如果是需要摘要信息，而且指定来源的消息数量》0// 如果不需要摘要信息，而且消息数量大于0}
 * @param {json} res - 如果是需要摘要的，就是这样{sender:senderID,count:消息数量,abstract:自动摘要,
                    startTime:消息起始时间("yyyy-MM-dd hh:mm:ss"),
                    lastTime:消息结束时间("yyyy-MM-dd hh:mm:ss")}，如果不需要摘要就是消息的数组【{ create_date: 2017-04-02T11:04:34.638Z,
                      images: {},
                      location:
                       [ { positioningdate: 2017-04-02T11:04:34.639Z,
                           SRS: '4326',
                           _id: 58e0dac2e978587014e67f23,
                           geolocation: [Object] } ],
                      __v: 0,
                      status: 0,
                      receiver: 58dd96c9ac015a0809000070,
                      sender: 58c043cc40cbb100091c640d,
                      image: 'images/24368180-1794-11e7-a741-7d4b0ed433e3.jpg',
                      text: '',
                      _id: 58e0dac2e978587014e67f22 }，。。。】
 */
var getMyNewestMessageFromWho = function(req, res) {
    // //console.log('call getMyNewestMessageFromWho');
    //for(var i in req.body){ //console.log("getMyNewestMessageFromWho 请求内容body子项："+i+"<>\n")};
    var receiverID=req.body.receiverID,
    senderID=req.body.senderID,
    isAbstract=req.body.isAbstract;
    //var receiverID="593e5b56c6178a040fa757ae",
    //    senderID="594cc13fc6178a040fa76063",
    //    isAbstract=true;

    // //console.log('senderID:'+senderID);
    messageDAO.getMyNewestMessageFromWho(receiverID,senderID,isAbstract,function( err,obj){
        if(!err) {
             //console.log('getMyNewestMessageFromWho 查询所有'+senderID+'发送的消息:'+obj);
            res.send(obj);
            //console.log('返回消息')
            //console.log(obj)
        } else{
            // //console.log('getMyNewestMessageFromWho 查询所有'+senderID+'发送的消息为空:'+err);
            res.send(null);
        }});
};


/**
 *读取了一个消息，将一个消息设置为已读，在查询未读消息的操作中就不会包括这个消息了
 * @param {string} req - req.body.messID消息的唯一id
 * @param {string} res - 成功返回该消息id，失败返回null
 */
var readtMessage = function(req, res) {
    // //console.log('call readtMessage');
    //for(var i in req.body){ //console.log("readtMessage 请求内容body子项："+i+"<>\n")};
    var messID=req.body.messID;
    var curUserID=req.body.curUserID?req.body.curUserID:"";
    // 调用方法
    // messageObj.getMessagesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // //console.log('messID:'+messID);
    messageDAO.readtMessage(messID,curUserID,function( err,obj){
        if(!err) {
            // //console.log('readtMessage 查询所有'+messID+'发送的消息:'+obj);
            res.send(messID);
        } else{
            // //console.log('readtMessage 查询所有'+messID+'发送的消息为空:'+err);
            res.send(null);
        }});
};

var messageAdd = function(req, res) {

};
/**
 * 发送个人消息
 * @param {json} req - json形式：(senderID:“发送者id",type:"message"(可以不写),receiverID:"接受者id",messageObj：{
 * text:"文本内容",voice:"语音消息",video:"视频消息",image:"图片消息"（四种消息必有一种）}")
 * @param {json} res - 发送成功返回 消息本身，发送失败发回 null
 */
var sendAMessage = function(req, res) {
    // //console.log('call sendAMessage');
    //for(var i in req.body){ //console.log("sendAMessage 请求内容body子项："+i+"<>\n")};
    var receiverID=req.body.receiverID,
        senderID=req.body.senderID;
    if(!req.body.messageObj){return;}
    // //console.log('senderID:'+senderID);
    messageDAO.sendAMessage(req.body.messageObj,senderID,receiverID,function( err,obj){
        if(!err) {
            // //console.log('sendAMessage 查询所有'+senderID+'发送的消息:'+obj._id);
            res.send(obj);
        } else{
            // //console.log('sendAMessage 查询所有'+senderID+'发送的消息为空:'+err);
            res.send(null);
        }});
};

/**
 * 发送群体性消息
 * @param {json} req - json形式：(senderID:“dfdf",type:"broadcast",receiverType:"department(按部门发送)|title（按头衔发送）|persons（选择一些人发送）",messageObj：{
 * text:"文本内容",voice:"语音消息",video:"视频消息",image:"图片消息"（四种消息必有一种）}，receiverInfo:"(如果是部门，就是部门id数组，如果是title，就是title的id数组，如果是人员，就是人员的id数组)")
 * @param {json} res - 发送失败 null，发送成功， 消息本身
 */
var sendBroadcast = function(req, res) {
    //实现后删掉这一行
    // res.send(null);

    // //console.log('call sendAMessage');
    //for(var i in req.body){ //console.log("sendAMessage 请求内容body子项："+i+"<>\n")};
    var senderID=req.body.senderID;
    var messType=req.body.type;
    var receiverType=req.body.receiverType;
    var receiverInfo=req.body.receiverInfo;
    //如果没有类型，或者类型不是广播，就返回
    if(!req.body.type || req.body.type!="broadcast" || !messType || !receiverType || !receiverInfo){
        // //console.log("客户端发来的json有空值");
        res.send({error:"客户端发来的json有空值"});
        return;
    };
        // //console.log('senderID:'+senderID);
    var recieverIds=[];
    switch (receiverType){
        case "department":
            if(receiverInfo && receiverInfo.length>0)
            //receiverInfo这是departmentid的数组
            {
                    departmentDAO.getAllpersonsByDepartIds(receiverInfo,function (err,persons) {
                        if(!err){
                            if(persons && persons.length){
                                var output=new  Array();
                                for (var index = 0; index < persons.length; index++) {
                                messageDAO.sendBroadcast(req.body.messageObj,senderID,persons[index]._id,function( err,obj){
                                    if(!err) {
                                        // //console.log('sendAMessage 查询所有'+senderID+'发送的消息:'+obj._id);
                                        output.push(obj);
                                    } else{
                                        // //console.log('sendAMessage 查询所有'+senderID+'发送的消息为空:'+err);
                                        output.push({error:err});
                                    }});
                                 }
                                 res.send(output);
                            }
                        }
                    });
            }
            break;
        case "title":
            if(receiverInfo && receiverInfo.length>0)
            //receiverInfo这是title id的数组
            {
                personDAO.gettitleIdsToperson(receiverInfo,function (err,persons) {
                    if(!err){
                        if(persons && persons.length){
                            var output=new  Array();
                            for (var index = 0; index < persons.length; index++) {
                                messageDAO.sendBroadcast(req.body.messageObj,senderID,persons[index]._id,function( err,obj){
                                    if(!err) {
                                        // //console.log('sendAMessage 查询所有'+senderID+'发送的消息:'+obj._id);
                                        output.push(obj);
                                    } else{
                                        // //console.log('sendAMessage 查询所有'+senderID+'发送的消息为空:'+err);
                                        output.push({error:err});
                                    }});
                            }
                            res.send(output);
                        }
                    }
                });
            }
            break;
        case "persons":
            if(receiverInfo && receiverInfo.length>0)
            //receiverInfo这是person id的数组
            {
                var persons=receiverInfo;
                for (var index = 0; index < persons.length; index++) {
                    messageDAO.sendBroadcast(req.body.messageObj,senderID,persons[index]._id,function( err,obj){
                        if(!err) {
                            // //console.log('sendAMessage 查询所有'+senderID+'发送的消息:'+obj._id);
                            output.push(obj);
                        } else{
                            // //console.log('sendAMessage 查询所有'+senderID+'发送的消息为空:'+err);
                            output.push({error:err});
                        }});
                }
                res.send(output);
            }
            break;
        default:
            break;
    }

    };



/**
 * 发送异常性消息（主要是考勤中的请假和换班消息）
 * @param {json} req - json形式：(senderID:“dfdf",type:"takeoff|shift",receiverType:"title（按头衔发送）|person（选择一个人发送）",messageObj：{
 * text:"文本内容",startTime:"语音消息",video:"视频消息",image:"图片消息"（四种消息必有一种）
//异常状态也是一种消息
abnormaldecision :String,//approve；reject,
abnormalID:String,//唯一标示异常值的id，如果给多人发，通过这个就可以把多条信息全部设为已读
//请假事由 由message.text兼任
abnormalStartTime:{ type: Date, default: Date.now},
abnormalEndTime:{ type: Date, default: Date.now},
abnormalShiftPersonId:String,//换班人员id
    abnormald:String,//一个异常具有唯一的id，这个id表示这个异常是同一个，用于如果请假申请发给同一级的多人时}，receiverInfo:"(如果是部门，就是部门id数组，如果是title，就是title的id数组，如果是人员，就是人员的id数组)")
 * @param {json} res - 发送失败 null，发送成功， 消息本身
 */
var sendAbnormalMessage = function(req, res) {
    //实现后删掉这一行
    // res.send(null);

    // //console.log('call sendAMessage');
    //for(var i in req.body){ //console.log("sendAMessage 请求内容body子项："+i+"<>\n")};
    var senderID=req.body.senderID;
    var messType=req.body.type;
    var receiverType=req.body.receiverType;
    var receiverInfo=req.body.receiverInfo;
    //如果没有类型，或者类型不是广播，就返回
    if(!req.body.type || (req.body.type!="takeoff" || req.body.type!="shift" )|| !messType || !receiverType || !receiverInfo){
        // //console.log("客户端发来的json有空值");
        res.send({error:"客户端发来的json有空值"});
        return;
    };
    // //console.log('senderID:'+senderID);
    var recieverIds=[];
    switch (receiverType){
        case "title":
            if(receiverInfo && receiverInfo.length>0)
            //receiverInfo这是title id的数组
            {
                personDAO.gettitleIdsToperson(receiverInfo,function (err,persons) {
                    if(!err){
                        if(persons && persons.length){
                            var output=new  Array();
                            for (var index = 0; index < persons.length; index++) {
                                messageDAO.sendBroadcast(req.body.messageObj,senderID,persons[index]._id,function( err,obj){
                                    if(!err) {
                                        // //console.log('sendAMessage 查询所有'+senderID+'发送的消息:'+obj._id);
                                        output.push(obj);
                                    } else{
                                        // //console.log('sendAMessage 查询所有'+senderID+'发送的消息为空:'+err);
                                        output.push({error:err});
                                    }});
                            }
                            res.send(output);
                        }
                    }
                });
            }
            break;
        case "person":
            if(receiverInfo)
            //receiverInfo这是person id的数组
            {
                    messageDAO.sendBroadcast(req.body.messageObj,senderID,receiverInfo,function( err,obj){
                        if(!err) {
                            // //console.log('sendAMessage 查询所有'+senderID+'发送的消息:'+obj._id);
                            res.send(obj);
                        } else{
                            // //console.log('sendAMessage 查询所有'+senderID+'发送的消息为空:'+err);
                            res.send({error:err});
                        }});
            }
            break;
        default:
            break;
    }

};


/**
 *读取了一个异常消息，将一个异常消息设置为已读，并且有同意和驳回两种选项
 * @param {string} req - req.body.messID消息的唯一id，req.body.decision ：approve；reject 同意，驳回,curUserID 当前用户id
 * @param {string} res - 成功返回该消息id，失败返回null.对于请假消息，同意之后会在考勤状态表中生成一条请假状态，这样在计算考勤的时候，就不会被计入了
 */
var readtAbnormalMessage = function(req, res) {
    // //console.log('call readtMessage');
    //for(var i in req.body){ //console.log("readtMessage 请求内容body子项："+i+"<>\n")};
    var messID=req.body.messID;
    var curUserID=req.body.curUserID?req.body.curUserID:"";
    var decision=req.body.decision?req.body.decision:"approve";
    // 调用方法
    // messageObj.getMessagesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // //console.log('messID:'+messID);
    messageDAO.readtAbnormalMessage(messID,curUserID,decision,function( err,obj){
        if(!err) {
            if(!(obj && obj.length))
            {res.send({error:"查无此消息！"});return;}

            var abnormalAttendenceObj={};
            // //console.log('readtMessage 查询所有'+messID+'发送的消息:'+obj);
            if(decision=="approve"){
                if(obj[0].type=="takeoff" ){
                    abnormalAttendenceObj.person=obj[0].sender;
                    abnormalAttendenceObj.askforleave.reason=obj[0].text;
                    abnormalAttendenceObj.askforleave.startDateTime=obj[0].abnormalStartTime;
                    abnormalAttendenceObj.askforleave.endDateTime=obj[0].abnormalEndTime;
                    abnormalAttendenceObj.abnormal=true;

                }
                else if(obj.type=="shift" ){
                    abnormalAttendenceObj.shift.startDateTime=obj[0].abnormalStartTime;
                    abnormalAttendenceObj.shift.endDateTime=obj[0].abnormalEndTime;
                    abnormalAttendenceObj.shift.alternateattendanceRecord=obj[0].receiver;
                    abnormalAttendenceObj.abnormal=true;

                }
                attendanceRecordDao.sendpersonaskforleave(abnormalAttendenceObj,function( err,obj){
                    if(!err) {
                        res.send(obj);}
                    else{
                        res.send({error:err});
                    }
                });
            }

        } else{
            // //console.log('readtMessage 查询所有'+messID+'发送的消息为空:'+err);
            res.send({error:err});
        }});
};

/**
 *得到一个时间段内某人发来的消息(type:“message“) 或者 群体消息(type:”broadcast“)
 * @param {Object} req - 客户端提交的json{receiverID:"sdfdsf",startTime:"开始时间",lastTime:"结束时间","senderID":"发送者id"，type：“broadcast|message”（跟发送者id不同时作用，可以只发送type为broadcast而不指定senderid，如果有明确的发送者id，且type未指定或者为‘message’时，就查询个人消息，否则就是群体消息）}
 * @param {string} req.body.receiverID - 接受者id.
 * @param {string} req.body.senderID - 发送者id.
 * @param {string} req.body.type - 发送类型.broadcast或者message，当为broadcast时，senderID会忽略，否则会用上
 * @param {datetime} req.body.startTime - 开始时间.
 * @param {datetime} req.body.lastTime - 结束时间.
 * @param res
 */
var getMessagesInATimeSpanFromWho = function(req, res) {
    // //console.log('call getMessagesInATimeSpanFromWho');
    //for(var i in req.body){ //console.log("getMessagesInATimeSpanFromWho 请求内容body子项："+i+"<>\n")};
    var receiverID=req.body.receiverID,
        senderID=req.body.senderID,
        startTime=req.body.startTime,
        lastTime=req.body.lastTime,
        type =req.body.type;
    // 调用方法
    // messageObj.getMessagesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // //console.log('senderID:'+senderID);
    //待扩展实现
    messageDAO.getMessagesInATimeSpanFromWho(receiverID,senderID,startTime,lastTime,type,function( err,obj){
        if(!err) {
            // //console.log('getMessagesInATimeSpanFromWho 查询所有'+senderID+'发送的消息id:'+obj);
            res.send(obj);
        } else{
            // //console.log('getMessagesInATimeSpanFromWho 查询所有'+senderID+'发送的消息为空:'+err);
            res.send(null);
        }});
};


/**
 * 根据用户id得到所有未读信息
 * @param {json} req - 传来的参数是接受者的id{receiverID:"58dd96c9ac015a0809000070"}
 * @param {json} res - 发回所有未读消息，如果没有就是null，如果有，类似{ create_date: 2017-04-02T11:04:34.638Z,
  images: {},
  location:
   [ { positioningdate: 2017-04-02T11:04:34.639Z,
       SRS: '4326',
       _id: 58e0dac2e978587014e67f23,
       geolocation: [Object] } ],
  __v: 0,
  status: 0,
  receiver: 58dd96c9ac015a0809000070,
  sender: 58c043cc40cbb100091c640d,
  image: 'images/24368180-1794-11e7-a741-7d4b0ed433e3.jpg',
  text: '',
  _id: 58e0dac2e978587014e67f22 }
 */
var getAllUnreadMessages = function(req, res) {
    // //console.log('call getMessagesInATimeSpanFromWho');
    //for(var i in req.body){ //console.log("getMessagesInATimeSpanFromWho 请求内容body子项："+i+"<>\n")};
    var receiverID=req.body.receiverID;
    // 调用方法
    // messageObj.getMessagesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // //console.log('senderID:'+senderID);
    messageDAO.getAllUnreadMessages(receiverID,function( err,obj){
        if(!err) {
            // //console.log('getMessagesInATimeSpanFromWho 查询所有'+senderID+'发送的消息id:'+obj);
            res.send(obj);
        } else{
            // //console.log('getMessagesInATimeSpanFromWho 查询所有'+senderID+'发送的消息为空:'+err);
            res.send(null);
        }});
};
messagerouter.get('/add',messageAdd);//增加
messagerouter.post('/sendAMessage',sendAMessage);//增加
messagerouter.post('/readtMessage',readtMessage);//提交
messagerouter.post('/getMyNewestMessageFromWho',getMyNewestMessageFromWho);//编辑查询
messagerouter.post('/getMessagesInATimeSpanFromWho',getMessagesInATimeSpanFromWho);//编辑查询
messagerouter.post('/getAllUnreadMessages',getAllUnreadMessages);//编辑查询
messagerouter.post('/sendBroadcast',sendBroadcast);//编辑查询

// messagerouter.post('/checkWorkMessagesCount',checkWorkMessagesCount);//提交
//
// messagerouter.post('/checkHandlingEventsCount',checkHandlingEventsCount);//提交
//
//
// messagerouter.post('/checkTemperyBroadcast',checkTemperyBroadcast);//提交
//
// messagerouter.post('/getUnreadMessageList',getUnreadMessageList);//提交
module.exports = messagerouter;
