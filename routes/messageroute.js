/**
 * @module 工作消息和群体通知模块
 */

var express = require('express');
var messagerouter = express.Router();

var MessageSchema = require('../dbmodels/messageschema');
var mScheme = MessageSchema.MessageSchema;
var uuid = require('node-uuid');
//获取数据模型
var personDAO = require('../dbmodels/personDAO.js');
var departmentDAO = require('../dbmodels/departmentDAO.js');
var attendanceRecordDao = require('../dbmodels/attendanceRecordDao.js');

var message = require('../dbmodels/messageschema.js');
//console.log('message数据模型是否存在：'+message);
//获取数据模型
var messageDAO = require('../dbmodels/messageDao');

var JPush = require("../node_modules/jpush-sdk/lib/JPush/JPush.js")
var JPushclient = JPush.buildClient('8c95bceebb7459c9bcb29f94', '98fd64a9ac6ac47f3011b641')

/**
 * 保存每条消息就自动的发送推送消息
 * @param doc
 */
var afterSave = function (doc) {

  // console.log('已经保存了%s ', JSON.stringify(doc));
  if (doc.status == 0) {
    personDAO.getIMid(doc.receiver, function (immmid) {
      console.log('未读消息,且接收者有极光id，开始极光推送 ');
      if (immmid && !immmid.error) {
        //easy push
        JPushclient.push().setPlatform(JPush.ALL)
          .setAudience({registration_id: [immmid]})
          .setNotification(doc.text ? doc.text :
            "您有一条" + doc.type == "message" ? "工作" :
              (doc.type == "broadcast" ? "系统" :
                (doc.type == "takeoff" ? "请假申请" :
                  (doc.type == "shift" ? "换班申请" :
                      (doc.type == "stepgo" ? "事件审核":
                        (doc.type == "backoff" ? "事件驳回":
                    ""))))) + "消息", JPush.ios('ios alert'), JPush.android('android alert', null, 1))
          .send(function (err, res) {
            if (err) {
              console.log(err.message)
            } else {
              console.log('Sendno: ' + res.sendno)
              console.log('Msg_id: ' + res.msg_id)
            }
          });
      }
    })
  }
}

// var afterSave=function(doc) {
//     console.log('%s has been saved', JSON.stringify(doc));
// }

//每个消息在保存之后就发送一条极光推送
mScheme.post('save', afterSave);

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
var getMyNewestMessageFromWho = function (req, res) {
  // //console.log('call getMyNewestMessageFromWho');
  //for(var i in req.body){ //console.log("getMyNewestMessageFromWho 请求内容body子项："+i+"<>\n")};
  var receiverID = req.body.receiverID,
    senderID = req.body.senderID,
    isAbstract = req.body.isAbstract;
  //var receiverID="593e5b56c6178a040fa757ae",
  //    senderID="594cc13fc6178a040fa76063",
  //    isAbstract=true;

  // //console.log('senderID:'+senderID);
  messageDAO.getMyNewestMessageFromWho(receiverID, senderID, isAbstract, function (err, obj) {
    if (!err) {
      //console.log('getMyNewestMessageFromWho 查询所有'+senderID+'发送的消息:'+obj);
      res.send(obj);
      //console.log('返回消息')
      //console.log(obj)
    } else {
      // //console.log('getMyNewestMessageFromWho 查询所有'+senderID+'发送的消息为空:'+err);
      res.send(null);
    }
  });
};


/**
 *读取了一个消息，将一个消息设置为已读，在查询未读消息的操作中就不会包括这个消息了
 * @param {string} req - req.body.messID消息的唯一id
 * @param {string} res - 成功返回该消息id，失败返回null
 */
var readtMessage = function (req, res) {
  // //console.log('call readtMessage');
  //for(var i in req.body){ //console.log("readtMessage 请求内容body子项："+i+"<>\n")};
  var messID = req.body.messID;
  var curUserID = req.body.curUserID ? req.body.curUserID : "";
  // 调用方法
  // messageObj.getMessagesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
  // //console.log('messID:'+messID);
  messageDAO.readtMessage(messID, curUserID, function (err, obj) {
    if (!err) {
      // //console.log('readtMessage 查询所有'+messID+'发送的消息:'+obj);
      res.send(messID);
    } else {
      // //console.log('readtMessage 查询所有'+messID+'发送的消息为空:'+err);
      res.send(null);
    }
  });
};

var messageAdd = function (req, res) {

};
/**
 * 发送个人消息
 * @param {json} req - json形式：(senderID:“发送者id",type:"message"(可以不写),receiverID:"接受者id",messageObj：{
 * text:"文本内容",voice:"语音消息",video:"视频消息",image:"图片消息"（四种消息必有一种）}")
 * @param {json} res - 发送成功返回 消息本身，发送失败发回 null
 */
var sendAMessage = function (req, res) {
  // //console.log('call sendAMessage');
  //for(var i in req.body){ //console.log("sendAMessage 请求内容body子项："+i+"<>\n")};
  var receiverID = req.body.receiverID,
    senderID = req.body.senderID;
  if (!req.body.messageObj) {
    return;
  }
  // //console.log('senderID:'+senderID);
  messageDAO.sendAMessage(req.body.messageObj, senderID, receiverID, function (err, obj) {
    if (!err) {
      // //console.log('sendAMessage 查询所有'+senderID+'发送的消息:'+obj._id);
      res.send(obj);
    } else {
      // //console.log('sendAMessage 查询所有'+senderID+'发送的消息为空:'+err);
      res.send(null);
    }
  });
};

/**
 * 发送群体性消息
 * @param {json} req - json形式：(senderID:“dfdf",type:"broadcast",receiverType:"department(按部门发送)|title（按头衔发送）|persons（选择一些人发送）",messageObj：{
 * text:"文本内容",voice:"语音消息",video:"视频消息",image:"图片消息"（四种消息必有一种）}，receiverInfo:"(如果是部门，就是部门id数组，如果是title，就是title的id数组，如果是人员，就是人员的id数组)")
 * @param {json} res - 发送失败 null，发送成功， 消息本身
 */
var sendBroadcast = function (req, res) {
  //实现后删掉这一行
  // res.send(null);

  // console.log('call sendBroadcast'+req.body.messageObj);
  for (var i in req.body) {
    console.log("sendBroadcast 请求内容body子项：" + i + "<>\n")
  }
  ;
  var senderID = req.body.senderID;
  var messType = req.body.type;
  var receiverType = req.body.receiverType;
  var receiverInfo = req.body.receiverInfo;
  var messageObj = req.body.messageObj ? req.body.messageObj : {};
  messageObj = (messageObj.text || messageObj.video || messageObj.voice || messageObj.image) ? messageObj : JSON.parse(req.body.messageObj);
  console.log('call sendBroadcast2');
  //如果没有类型，或者类型不是广播，就返回
  if (!req.body.type || req.body.type != "broadcast" || !messType || !receiverType || !receiverInfo || !(messageObj.text || messageObj.video || messageObj.voice || messageObj.image)) {
    // //console.log("客户端发来的json有空值");
    res.send({error: "客户端发来的json有空值"});
    return;
  }
  ;
  console.log('senderID:' + senderID);
  var recieverIds = [];
  switch (receiverType) {
    case "department":
      // 传过来的id数组解码
      var dpts;
      if (receiverInfo.length && receiverInfo[0] == '[')
        dpts = JSON.parse(receiverInfo);
      else
        dpts = receiverInfo;
      if (receiverInfo && receiverInfo.length > 0)
      //receiverInfo这是departmentid的数组
      {
        departmentDAO.getAllpersonsByDepartIds(dpts, function (err, persons) {
          if (!err) {
            if (persons && persons.length) {
              var output = new Array();
              for (var index = 0; index < persons.length; index++) {
                // console.log('getAllpersonsByDepartIds 查询所有persons:'+index+"<>"+JSON.stringify(persons[index].person)+'发送的消息:'+persons[index].person?persons[index].person:"没有person");
                if (persons[index].person) {
                  messageObj.type = "broadcast";
                  messageDAO.sendBroadcast(messageObj, senderID, persons[index].person._id, function (err, obj) {
                    if (!err) {
                      // //console.log('sendAMessage 查询所有'+senderID+'发送的消息:'+obj._id);
                      output.push(obj);
                    } else {
                      // //console.log('sendAMessage 查询所有'+senderID+'发送的消息为空:'+err);
                      output.push({error: err});
                    }
                  });
                }
              }

              res.send(output);
            }
          }
        });
      }
      break;
    case "title":
      //5952112dea76066818fd6dd4
      //5952112dea76066818fd6dd2
      // 传过来的id数组解码
      var titles;
      if (receiverInfo.length && receiverInfo[0] == '[')
        titles = JSON.parse(receiverInfo);
      else
        titles = receiverInfo;
      if (receiverInfo && receiverInfo.length > 0)
      //receiverInfo这是title id的数组
      {
        personDAO.gettitleIdsToperson(titles, function (err, persons) {
          if (!err) {
            if (persons && persons.length) {
              var output = new Array();
              for (var index = 0; index < persons.length; index++) {
                messageObj.type = "broadcast";
                messageDAO.sendBroadcast(messageObj, senderID, persons[index]._id, function (err, obj) {
                  if (!err) {
                    // //console.log('sendAMessage 查询所有'+senderID+'发送的消息:'+obj._id);
                    output.push(obj);
                  } else {
                    // //console.log('sendAMessage 查询所有'+senderID+'发送的消息为空:'+err);
                    output.push({error: err});
                  }
                });
              }
              res.send(output);
            }
          }
        });
      }
      break;
    case "persons":
      if (receiverInfo && receiverInfo.length > 0)
      //receiverInfo这是person id的数组
      {
        var persons = receiverInfo;
        var output = new Array();
        messageObj.type = "broadcast";
        // 传过来的id数组解码
        if (persons.length && persons[0] == '[')
          persons = JSON.parse(receiverInfo);
        else
          persons = receiverInfo;

        console.log('sendBroadcast 查询所有' + persons + '发送的消息:' + persons[0]);
        for (var index = 0; index < persons.length; index++) {
          messageDAO.sendBroadcast(messageObj, senderID, persons[index], function (err, obj) {
            if (!err) {
              // //console.log('sendAMessage 查询所有'+senderID+'发送的消息:'+obj._id);
              output.push(obj);
            } else {
              // //console.log('sendAMessage 查询所有'+senderID+'发送的消息为空:'+err);
              output.push({error: err});
            }
          });
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
 * @param {json} req - json形式：<br>{senderID:“dfdf",<br>type:"takeoff|shift",<br>receiverType:"title（按头衔发送）|person（选择一个人发送）",<br>messageObj：{
 * text:"文本内容",startTime:"语音消息",video:"视频消息",image:"图片消息"（四种消息必有一种）
//异常状态也是一种消息//请假事由 由message.text兼任<br>
abnormalStartTime:{ type: Date, default: Date.now},<br>
abnormalEndTime:{ type: Date, default: Date.now},<br>
abnormalShiftPersonId:String,//换班人员id<br>
receiverInfo:"接收者信息(如果是title，就是title的id数组，如果是人员，就是人员的id数组)"}
 * @param {json} res - 发送失败 null，发送成功， 消息本身
 */
var sendAbnormalMessage = function (req, res) {
  //实现后删掉这一行
  // res.send(null);

  // //console.log('call sendAMessage');
  //for(var i in req.body){ //console.log("sendAMessage 请求内容body子项："+i+"<>\n")};
  var senderID = req.body.senderID;
  var messType = req.body.type;
  var receiverType = req.body.receiverType;
  var receiverInfo = req.body.receiverInfo;
  //如果没有类型，或者类型不是广播，就返回
  if (!req.body.type || (req.body.type != "takeoff" && req.body.type != "shift" ) || !messType || !receiverType || !receiverInfo) {
    // //console.log("客户端发来的json有空值");
    res.send({error: "客户端发来的json有空值"});
    return;
  }
  ;
  var recieverIds = [];
  console.log('1senderID:' + senderID + "<>receiverType:" + receiverType + "<>(receiverInfo && receiverInfo.length>0):" + (receiverInfo && receiverInfo.length > 0));
  switch (receiverType) {
    case "title":
      console.log('2senderID:' + senderID + "<>receiverType:" + receiverType + "<>(receiverInfo && receiverInfo.length>0):" + (receiverInfo && receiverInfo.length > 0));
      if (receiverInfo && receiverInfo.length > 0)
      //receiverInfo这是title id的数组
      {
        console.log('sendAMessage 查询所有title:' + receiverInfo + 'personDAO.gettitleIdsToperson:' + personDAO.gettitleIdsToperson);
        personDAO.gettitleIdsToperson(receiverInfo, function (err, persons) {
          if (!err) {
            console.log('gettitleIdsToperson 查询所有title:' + receiverInfo + '发送的消息:' + persons.length);
            if (persons && persons.length) {
              var output = new Array();
              var abnormalID = uuid.v1();
              console.log('messageObj ：' + '<>' + req.body.messageObj);
              var messageObj = req.body.messageObj ? JSON.parse(req.body.messageObj) : {};
              messageObj.abnormalID = abnormalID;
              messageObj.abnormaldecision = "";
              messageObj.type = req.body.type;
              messageObj.abnormalStartTime = req.body.abnormalStartTime;
              messageObj.abnormalEndTime = req.body.abnormalEndTime;
              messageObj.abnormalShiftPersonId = req.body.abnormalShiftPersonId;
              for (var index = 0; index < persons.length; index++) {
                messageDAO.sendBroadcast(messageObj, senderID, persons[index]._id, function (err, obj) {
                  if (!err) {
                    // //console.log('sendAMessage 查询所有'+senderID+'发送的消息:'+obj._id);
                    output.push(obj);
                  } else {
                    // //console.log('sendAMessage 查询所有'+senderID+'发送的消息为空:'+err);
                    output.push({error: err});
                  }
                });
              }
              res.send(output.length ? output : messageObj);
            }
          } else {
            res.send(err);
          }
        });
      }
      break;
    case "person":
      if (receiverInfo)
      //receiverInfo这是person id的数组
      {
        var abnormalID = uuid.v1();
        console.log('messageObj ：' + '<>' + req.body.messageObj);
        var messageObj = req.body.messageObj ? JSON.parse(req.body.messageObj) : {};
        messageObj.abnormalID = abnormalID;
        messageObj.abnormaldecision = "";
        messageObj.type = req.body.type;
        messageObj.abnormalStartTime = req.body.abnormalStartTime;
        messageObj.abnormalEndTime = req.body.abnormalEndTime;
        messageObj.abnormalShiftPersonId = req.body.abnormalShiftPersonId;
        messageDAO.sendBroadcast(messageObj, senderID, receiverInfo, function (err, obj) {
          if (!err) {
            // //console.log('sendAMessage 查询所有'+senderID+'发送的消息:'+obj._id);
            res.send(obj);
          } else {
            // //console.log('sendAMessage 查询所有'+senderID+'发送的消息为空:'+err);
            res.send({error: err});
          }
        });
      } else {
        res.send(err);
      }
      break;
    default:
      break;
  }

};


/**
 *读取了一个异常消息，将一个异常消息设置为已读，并且有同意和驳回两种选项
 * @param {string} req - req.body.messID消息的唯一id，req.body.decision ：approve；reject 同意，驳回,curUserID 当前用户id,abnormalID:一个异常可能给多人发，比如请假的申请，只要有一个人批准，就全部已读
 * @param {string} res - 成功返回该消息id，失败返回null.对于请假消息，同意之后会在考勤状态表中生成一条请假状态，这样在计算考勤的时候，就不会被计入了
 */
var readtAbnormalMessage = function (req, res) {
  // //console.log('call readtMessage');
  //for(var i in req.body){ //console.log("readtMessage 请求内容body子项："+i+"<>\n")};
  var messID = req.body.messID;
  var curUserID = req.body.curUserID ? req.body.curUserID : "";
  var decision = req.body.decision ? req.body.decision : "approve";
  var abnormalID = req.body.abnormalID;
  if (!abnormalID) {
    res.send({error: "无abnormald！"});
    return;
  }
  // 调用方法
  // messageObj.getMessagesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
  // //console.log('messID:'+messID);
  messageDAO.readtAbnormalMessage(messID, curUserID, decision, abnormalID, function (err, oobj) {
    if (!err) {
      if (!oobj) {
        res.send({error: "查无此消息！"});
        return;
      }

      var sampleObj = oobj.length ? oobj[0] : oobj;

      var abnormalAttendenceObj = {};
      // console.log('readtAbnormalMessage 查询sampleObj.type'+sampleObj.type+'q全部的消息:'+JSON.stringify(oobj));
      if (decision == "approve") {
        if (sampleObj.type == "takeoff") {
          abnormalAttendenceObj.person = sampleObj.sender;
          abnormalAttendenceObj.askforleave = {};
          abnormalAttendenceObj.askforleave.reason = sampleObj.text;
          abnormalAttendenceObj.askforleave.startDateTime = sampleObj.abnormalStartTime;
          abnormalAttendenceObj.askforleave.endDateTime = sampleObj.abnormalEndTime;
          abnormalAttendenceObj.abnormal = true;
          // console.log('readtAbnormalMessage takeoff查询所有'+abnormalAttendenceObj+'发送的消息:'+abnormalAttendenceObj.abnormal);
        }
        else if (sampleObj.type == "shift") {
          abnormalAttendenceObj.shift = {};
          abnormalAttendenceObj.shift.startDateTime = sampleObj.abnormalStartTime;
          abnormalAttendenceObj.shift.endDateTime = sampleObj.abnormalEndTime;
          abnormalAttendenceObj.shift.alternateattendanceRecord = sampleObj.receiver;
          abnormalAttendenceObj.abnormal = true;
          // console.log('readtAbnormalMessage shift查询所有'+abnormalAttendenceObj+'发送的消息:'+abnormalAttendenceObj.abnormal);
        }
        attendanceRecordDao.sendpersonaskforleave(abnormalAttendenceObj, function (err, obj) {
          if (!err) {
            res.send(oobj);
          }
          else {
            res.send({error: err});
          }
        });
      }

    } else {
      // //console.log('readtMessage 查询所有'+messID+'发送的消息为空:'+err);
      res.send({error: err});
    }
  });
};

/**
 *得到一个时间段内某人发来的消息(type:“message“) 或者 群体消息(type:”broadcast“)
 * @param {Object} req - 客户端提交的json{receiverID:"sdfdsf",startTime:"开始时间",lastTime:"结束时间","senderID":"发送者id"，type：“broadcast|message”（跟发送者id不同时作用，可以只发送type为broadcast而不指定senderid，如果有明确的发送者id，且type未指定或者为‘message’时，就查询个人消息，否则就是群体消息）}
 * @param {string} req.body.receiverID - 接受者id.
 * @param {string} req.body.senderID - 发送者id.
 * @param {string} req.body.type - 发送类型.broadcast或者message，当为broadcast时，senderID会忽略，否则会用上，"takeoff放假|shift换班"
 * @param {datetime} req.body.startTime - 开始时间.
 * @param {datetime} req.body.lastTime - 结束时间.
 * @param res
 */
var getMessagesInATimeSpanFromWho = function (req, res) {
  // //console.log('call getMessagesInATimeSpanFromWho');
  //for(var i in req.body){ //console.log("getMessagesInATimeSpanFromWho 请求内容body子项："+i+"<>\n")};
  var receiverID = req.body.receiverID,
    senderID = req.body.senderID,
    startTime = req.body.startTime,
    lastTime = req.body.lastTime,
    type = req.body.type;
  // 调用方法
  // messageObj.getMessagesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
  // //console.log('senderID:'+senderID);
  //待扩展实现
  messageDAO.getMessagesInATimeSpanFromWho(receiverID, senderID, startTime, lastTime, type, function (err, obj) {
    if (!err) {
      // //console.log('getMessagesInATimeSpanFromWho 查询所有'+senderID+'发送的消息id:'+obj);
      res.send(obj);
    } else {
      // //console.log('getMessagesInATimeSpanFromWho 查询所有'+senderID+'发送的消息为空:'+err);
      res.send(null);
    }
  });
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
var getAllUnreadMessages = function (req, res) {
  // //console.log('call getMessagesInATimeSpanFromWho');
  //for(var i in req.body){ //console.log("getMessagesInATimeSpanFromWho 请求内容body子项："+i+"<>\n")};
  var receiverID = req.body.receiverID;
  // 调用方法
  // messageObj.getMessagesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
  // //console.log('senderID:'+senderID);
  messageDAO.getAllUnreadMessages(receiverID, function (err, obj) {
    if (!err) {
      // //console.log('getMessagesInATimeSpanFromWho 查询所有'+senderID+'发送的消息id:'+obj);
      res.send(obj);
    } else {
      // //console.log('getMessagesInATimeSpanFromWho 查询所有'+senderID+'发送的消息为空:'+err);
      res.send(null);
    }
  });
};


/**
 * 得到已回复的异常消息，用于异常消息的申请者查看自己的申请有没有批复
 * @param {json} req - senderId发送者id，这里一般是异常消息的申请者 abnormalID唯一的异常消息id（可以为null，这时就查出所有的已回复的异常消息）
 * @param {json}  res - 异常消息的数组 或者1个异常消息 或者 null 出错会返回{error:err}
 */
var getAbnormaldMessageFeedback = function (req, res) {
  // //console.log('call getMessagesInATimeSpanFromWho');
  // for(var i in req.body){
  //     console.log("getMessagesInATimeSpanFromWho 请求内容body子项："+i+"<>\n")
  //     };
  var senderID = req.body.senderID;
  var abnormalID = req.body.abnormalID;
  // 调用方法
  // messageObj.getMessagesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
  console.log('ROUTE getAbnormaldMessageFeedback senderID:' + senderID);
  messageDAO.getAbnormaldMessageFeedback(senderID, function (err, obj) {
    if (!err) {
      console.log('callback getAbnormaldMessageFeedback obj：' + '<>' + JSON.stringify(obj));
      // //console.log('getMessagesInATimeSpanFromWho 查询所有'+senderID+'发送的消息id:'+obj);
      res.send(obj);
    } else {
      // //console.log('getMessagesInATimeSpanFromWho 查询所有'+senderID+'发送的消息为空:'+err);
      res.send({error: err});
    }
  }, abnormalID);
};

/**
 * 对消息进行统计分析
 * @param {json} req - personId 人员id，sTime 统计时间段开始，eTime 统计时间段结束，countType 哪种统计方式 sendMessage|receiveMessage，timespan 时间采样类型 day|week|month
 * @param {json}  res - 异常消息的数组 或者1个异常消息 或者 null 出错会返回{error:err} 统计结果说明： _id : 按timespan设定统计，如果timespan为day，就是直接的日期，week就是星期编号，0-53，month就是月份编号0-11
 all,timespan内的消息总数量
 textCount,timespan内的文本消息数量
 imageCount,timespan内的图片消息数量
 videoCount,timespan内的视频消息数量
 voiceCount,timespan内的音频消息数量
 mesaageTypeCount,timespan内的工作消息数量
 broadcastTypeCount,timespan内的广播消息数量
 takeoffTypeCount,timespan内的放假消息数量
 takeoffApprove,timespan内的，对于接受者，这里是请假成功的次数
 shiftTypeCount,timespan内的换班消息数量
 sender消息的发送者
 receiver消息的接收者
 */
var countByMessages = function (req, res) {
  // for(var i in req.body){
  //     console.log("countByMessages 请求内容body子项："+i+"<>\n")
  // };
  var personId = req.body.personId;
  var sTime = req.body.sTime;
  var eTime = req.body.eTime;
  var countType = req.body.countType ? req.body.countType : "sendMessage";
  var timespan = req.body.timespan ? req.body.timespan : "day";
// messageObj.countByMessages("594cc13fc6178a040fa76063","2017-01-01","2017-07-01","sendMessage","week|day|month",null);
// messageObj.countByMessages("594cc13fc6178a040fa76063","2017-01-01","2017-07-01","receiveMessage","day",null);
  messageDAO.countByMessages(personId, sTime, eTime, countType, timespan, function (err, obj) {
    if (!err) {
      // console.log('callback countByMessages obj：'+'<>'+JSON.stringify(obj));
      // //console.log('getMessagesInATimeSpanFromWho 查询所有'+senderID+'发送的消息id:'+obj);
      res.send(obj);
    } else {
      // //console.log('getMessagesInATimeSpanFromWho 查询所有'+senderID+'发送的消息为空:'+err);
      res.send({error: err});
    }
  })
}


messagerouter.get('/add', messageAdd);//增加
messagerouter.post('/sendAMessage', sendAMessage);//发送普通消息
messagerouter.post('/readtMessage', readtMessage);//已读普通消息
messagerouter.post('/getMyNewestMessageFromWho', getMyNewestMessageFromWho);//得到从某人那里来的最新消息
messagerouter.post('/getMessagesInATimeSpanFromWho', getMessagesInATimeSpanFromWho);//得到一段时间内某人发来的消息
messagerouter.post('/getAllUnreadMessages', getAllUnreadMessages);//得到一个人的所有未读消息
messagerouter.post('/sendBroadcast', sendBroadcast);//发送系统广播消息
messagerouter.post('/sendAbnormalMessage', sendAbnormalMessage);//发送异常消息
messagerouter.post('/readtAbnormalMessage', readtAbnormalMessage);//读一条异常消息
messagerouter.post('/getAbnormaldMessageFeedback', getAbnormaldMessageFeedback);//得到已回复的异常消息，用于异常消息的申请者查看自己的申请有没有批复
messagerouter.post('/countByMessages', countByMessages);//对消息进行统计分析


// messagerouter.post('/checkWorkMessagesCount',checkWorkMessagesCount);//提交
//
// messagerouter.post('/checkHandlingEventsCount',checkHandlingEventsCount);//提交
//
//
// messagerouter.post('/checkTemperyBroadcast',checkTemperyBroadcast);//提交
//
// messagerouter.post('/getUnreadMessageList',getUnreadMessageList);//提交
module.exports = messagerouter;
