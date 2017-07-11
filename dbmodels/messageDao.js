﻿var mongodb = require('./mongodb');
var MessageSchema = require('./messageschema');
var PersonSchema = require('./personschema');//这里相当于PersonSchema的export，真正要引用PersonSchema，应该这样PersonSchema.PersonSchema
var db = mongodb.mongoose.connection;
db.on('error',
console.error.bind(console,'连接错误:')
);
db.once('open',function(){

console.log('mongodb connection is ok!:'+mongodb);
});

//console.log('mongodb Schema:'+Schema);

var Messagemodel = MessageSchema.Messagemodel;
var mScheme=MessageSchema.MessageSchema;
//console.log('mongodb Schema:'+Schema);
var Personmodel=PersonSchema.Personmodel;






var MessageDAO = function(){};
MessageDAO.prototype.save = function(obj, callback) {
	Messagemodel.create();
	// 终端打印如下信息
console.log('called Message save');
var instance = new Messagemodel(obj);
console.log('instance.save:'+instance.name);
instance.save(function(err){
	console.log('save Message'+instance+' fail:'+err);
callback(err);
});
};



MessageDAO.prototype.findByName = function(name, callback) {
Messagemodel.findOne({name:name}, function(err, obj){
callback(err, obj);
});
};



MessageDAO.prototype.sendAMessage = function(messageObj,senderID,receiverID, outcallback) {
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                //console.log('callback sendAMessage 出错：'+'<>'+err);
            }else{
                //console.log('callback sendAMessage 成功：'+'<>'+obj);
            }
        };

    if(!(messageObj.text || messageObj.image || messageObj.voice || messageObj.video)){
        callback("你没有发送任何内容！",null);
        return;
	}
    if(!senderID || !receiverID){
        callback("消息没有明确的发送和接收者！",null);
        return;
    }
    messageObj.sender=senderID;

    messageObj.receiver=receiverID;
    messageObj.status=0;//消息是未读的
    messageObj.type="message";
    var newM=new Messagemodel(messageObj);
    newM.save( function(err,uobj){
            if(err)
        {
            //console.log('callback sendAMessage 出错：'+'<>'+err);
            callback(err, null);
        }else{
                //console.log('callback sendAMessage 成功：'+'<>'+uobj._id);
                callback(err, uobj);
        }
    });
    // });
};


MessageDAO.prototype.sendBroadcast = function(messageObj,senderID,receiverID, outcallback) {
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                //console.log('callback sendAMessage 出错：'+'<>'+err);
            }else{
                //console.log('callback sendAMessage 成功：'+'<>'+obj);
            }
        };

    // console.log('messageObj ：'+'<>'+messageObj);
    // messageObj=JSON.parse(messageObj);
    if(!(messageObj.text || messageObj.image || messageObj.voice || messageObj.video || messageObj.abnormalShiftPersonId)){
        callback("你没有发送任何内容！",null);
        return;
    }
    if(!senderID || !receiverID){
        callback("消息没有明确的发送和接收者！",null);
        return;
    }
    messageObj.sender=senderID;
    // messageObj.abnormalID=abnormalID;
    messageObj.receiver=receiverID;
    messageObj.status=0;//消息是未读的
    // messageObj.type=type?type:"broadcast";
    var newM=new Messagemodel(messageObj);
    newM.save( function(err,uobj){
        if(err)
        {
            //console.log('callback sendAMessage 出错：'+'<>'+err);
            callback(err, null);
        }else{
            //console.log('callback sendAMessage 成功：'+'<>'+uobj._id);
            callback(err, uobj);
        }
    });
    // });
};




MessageDAO.prototype.getMyNewestMessage = function(receiverID, outcallback) {
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                //console.log('callback getMyNewestMessage 出错：'+'<>'+err);
            }else{
            	for(var index =0;index<obj.length;index++)
				{
					console.log('callback getMyNewestMessage 成功：'+'<>'+obj[index]);
				}
                //console.log('callback getMyNewestMessage 成功：'+'<>');
            }
        };

    var query = Messagemodel.find({'receiver': receiverID,status:0});
    var opts = [{
        path: 'sender'
        //上下两种写法效果一样，都可以将关联查询的字段进行筛选
        // ,
        // select : '-personlocations'
        ,
        select: {name: 1}
    }];
    query.populate(opts);
    // 排序，不过好像对子文档无效
    query.sort({'create_date':1});//desc asc
    // query.limit(1);

    query.exec(function (err, docs) {
        if(!err){
            callback(err,docs);
        }
        else {
            callback(err,null);
        }
    });
};
/**
 * getMyNewestMessageFromWho
 * @param receiverID 接收者id
 * @param senderID 发送者id
 * @param isAbstract 是否需要摘要 如果有超过1条的消息 而且此变量为真，则自动生成消息摘要
 * @param outcallback 回调函数
 */
MessageDAO.prototype.getMyNewestMessageFromWho = function(receiverID,senderID,isAbstract, outcallback) {
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                //console.log('callback getMyNewestMessageFromWho 出错：'+'<>'+err);
            }else{
                for(var index =0;index<obj.length;index++)
                {
                    //console.log('callback getMyNewestMessageFromWho 成功：'+'<>'+obj[index]);
                }
                if(obj.abstract){

                    //console.log('callback getMyNewestMessageFromWho 成功：'+'<>'+obj.abstract+'<>'+obj.count+'<>'+obj.lastTime);
                }

            }
        };

    var query = Messagemodel.find({'receiver': receiverID,sender:senderID,status:0},{});
    var opts = [{
        path: 'sender'
        //上下两种写法效果一样，都可以将关联查询的字段进行筛选
        // ,
        // select : '-personlocations'
        // ,'images':0
        ,
        select: {'name': 1}
    }];
    query.populate(opts);
    // 排序，不过好像对子文档无效
    query.sort({'create_date':1});//desc asc
    // query.limit(1);

    query.exec(function (err, docs) {
        if(!err){
            // 如果是需要摘要信息，而且指定来源的消息数量》0
            if(isAbstract && docs.length>0){
                var count=docs.length;
                var abstract=docs[docs.length-1].text?docs[docs.length-1].text.substr(0,6)+'...':((docs[docs.length-1].image|| docs[docs.length-1].video|| docs[docs.length-1].voice)?'多媒体消息...':'....');
                var output={sender:docs[docs.length-1].sender,count:count,abstract:abstract,
                    startTime:docs[0].create_date.Format("yyyy-MM-dd hh:mm:ss"),
                    lastTime:docs[docs.length-1].create_date.Format("yyyy-MM-dd hh:mm:ss")
                    // ,
                    // unreadmessages:docs
                };
                callback(err,output);
            }
            // 如果不需要摘要信息，而且消息数量大于0
            else if(docs.length>0) {
                callback(err,docs);
            }else{
                // 虽然没有错，但是也没有消息
                callback(err,null);
            }
        }
        else {
        }
    });
};



MessageDAO.prototype.getMessagesInATimeSpanFromWho = function(receiverID,senderID,startTime,endtime,type, outcallback) {
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                //console.log('callback getMessagesInATimeSpanFromWho 出错：'+'<>'+err);
            }else{
                for(var index =0;index<obj.length;index++)
                {
                    //console.log('callback getMessagesInATimeSpanFromWho 成功：'+'<>'+obj[index]);
                }
                if(obj.abstract){

                    //console.log('callback getMessagesInATimeSpanFromWho 成功：'+'<>'+obj.abstract+'<>'+obj.count+'<>'+obj.lastTime);
                }

            }
        };
    //默认就是message
    var jjtype=type;//?type:"message";type可以为空
    var query = Messagemodel.find();
    query.or([{'receiver': receiverID,'type':jjtype,sender:senderID,create_date:{
        "$gte": new Date(startTime),
        "$lt":new Date(endtime)
    }}, {'receiver':senderID,sender:receiverID,'type':jjtype,create_date:{
        "$gte": new Date(startTime),
        "$lt":new Date(endtime)
    }}
    // ,
        // type是为了向前兼容
    //     {'receiver': receiverID,'type':null,sender:senderID,create_date:{
    //     "$gte": new Date(startTime),
    //     "$lt":new Date(endtime)
    // }}, {'receiver':senderID,sender:receiverID,'type':null,create_date:{
    //     "$gte": new Date(startTime),
    //     "$lt":new Date(endtime)
    // }}
    ]);
    var opts = [{
        path: 'sender'
        //上下两种写法效果一样，都可以将关联查询的字段进行筛选
        // ,
        // select : '-personlocations'
        // ,'images':0
        ,
        select: {'name': 1}
    }];
    query.populate(opts);
    // 排序，不过好像对子文档无效
    query.sort({'create_date':1});//desc asc
    // query.limit(1);

    query.exec(function (err, docs) {
        if(!err){
            // 如果是需要摘要信息，而且指定来源的消息数量》0
            if(docs.length>0){
                // var count=docs.length;
                // var abstract=docs[docs.length-1].text?docs[docs.length-1].text.substr(0,6)+'...':(docs[docs.length-1].image?'图片消息...':(docs[docs.length-1].video?'视频消息...':'....'));
                // var output={sender:docs[docs.length-1].sender,count:count,abstract:abstract,
                //     firstTime:docs[0].create_date.Format("yyyy-MM-dd hh:mm:ss"),
                //     lastTime:docs[docs.length-1].create_date.Format("yyyy-MM-dd hh:mm:ss"),
                //     unreadmessages:docs
                // };
                callback(err,docs);
            }
            else{
                // 虽然没有错，但是也没有消息
                callback(err,null);
            }
        }
        else {
        }
    });
};


MessageDAO.prototype.getMyUnreadMessagesCount = function(receiverID, outcallback) {
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                //console.log('callback getMyUnreadMessagesCount 出错：'+'<>'+err);
            }else{
                for(var index =0;index<obj.length;index++)
                {
                    //console.log('callback getMyUnreadMessagesCount 成功：'+'<>'+obj[index]);
                }
                //console.log('callback getMyUnreadMessagesCount 成功：'+'<>未读消息数量:'+obj);
            }
        };

    var query = Messagemodel.find({'receiver': receiverID,status:0},{_id:1});
    query.exec(function (err, docs) {
        if(!err){
            callback(err,docs.length);
        }
        else {
            callback(err,0);
        }
    });
};



MessageDAO.prototype.readtMessage = function(mid,curUserID, outcallback) {
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                //console.log('callback readtMessage 出错：'+'<>'+err);
            }else{
                for(var index =0;index<obj.length;index++)
                {
                    //console.log('callback readtMessage 成功：'+'<>'+obj[index]);
                }
                //console.log('callback readtMessage 成功：'+'<>');
            }
        };

    Messagemodel.findOne({_id:mid}, function(err, obj){
        if(!err && obj){
            if(curUserID && obj.receiver==curUserID){
                Messagemodel.update({_id:mid},{status:1},function(err,uobj){
                    callback(err, uobj);
                });
            }else if(curUserID==""){
                Messagemodel.update({_id:mid},{status:1},function(err,uobj){
                    callback(err, uobj);
                });

            }
        }
        else {
            callback(err,null);
        }
    });
};

//是根据唯一的AbnormalId来更新消息
MessageDAO.prototype.readtAbnormalMessage = function(mid,curUserID,decision,abnormalID, outcallback) {
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                //console.log('callback readtMessage 出错：'+'<>'+err);
            }else{
                for(var index =0;index<obj.length;index++)
                {
                    //console.log('callback readtMessage 成功：'+'<>'+obj[index]);
                }
                //console.log('callback readtMessage 成功：'+'<>');
            }
        };

        //multi批量更新
        Messagemodel.update({"abnormalID":abnormalID},{status:1}, { multi: true },function(errr,uobj){
                if(!errr){
                    Messagemodel.update({_id:mid,"abnormalID":abnormalID},{"abnormaldecision":decision},function(errr,uobj){
                            if(!errr){
                                Messagemodel.find({"abnormalID":abnormalID}, function(err, obj){

                                    console.log('callback readtMessage update成功：'+obj+'<>'+abnormalID);

                                    callback(err, obj);
                                });
                            }else{

                                callback({error:errr}, uobj);
                            }
                        }
                    );
                }else{

                    callback({error:errr}, uobj);
                }
            }
        );
};



MessageDAO.prototype.getAllUnreadMessages = function(receiverId, outcallback) {
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                console.log('callback getAllUnreadMessages 出错：'+'<>'+err);
            }else{
                for(var index =0;index<obj.length;index++)
                {
                    console.log('callback getAllUnreadMessages 成功：'+'<>'+obj[index]);
                }
                console.log('callback getAllUnreadMessages 成功：'+'<>');
            }
        };

    Messagemodel.find({receiver:receiverId,status:0}, function(err, obj){
        if(!err && obj){
            callback(err,obj);
        }
        else {
            callback(err,null);
        }
    });
};


/**
 * 对消息进行统计分析
 * @param personId - 人员id
 * @param sTime  - 统计时间段开始
 * @param eTime  - 统计时间段结束
 * @param countType  - 哪种统计方式 sendMessage|receiveMessage
 * @param timespan -  时间采样类型 day|week|month
 * @param outcallback
 */
MessageDAO.prototype.countByMessages=function(personId,sTime,eTime,countType,timespan,outcallback) {

    // console.log('1countType sendMessage ：<>'+personId);

    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                console.log('callback countByMessages 出错：'+'<>'+err);
            }else{
                // console.log('3countType sendMessage ：'+'<>'+countType);
                console.log('callback countByMessages 成功：'+'<>'+JSON.stringify(obj));
            }
        };

    if(!personId || !sTime || !eTime || !countType || !timespan){
        callback({error:"统计参数不完整"},null)
    }

    switch (countType){
        case "sendMessage":
            // console.log('2countType sendMessage ：'+'<>'+countType);
            Messagemodel.aggregate()
                .match({
                    "sender":mongodb.mongoose.Types.ObjectId(personId)
                }
            ).project (
                {
                    day : {$substr: [{"$add":["$create_date", 28800000]}, 0, 10] },//时区数据校准，8小时换算成毫秒数为8*60*60*1000=288000后分割成YYYY-MM-DD日期格式便于分组
                    week:{$week: "$create_date" },
                    month:{$month: "$create_date" },
                    "text": {$cond:{if:{$and:[{$not :{$not :"$text"}},{$ne :["$text",null]},{$ne :["$text",""]}]},then:1,else:0}},
                    "image": {$cond:{if:{$and:[{$not :{$not :"$image"}},{$ne :["$image",null]},{$ne :["$image",""]}]},then:1,else:0}},
                    "video": {$cond:{if:{$and:[{$not :{$not :"$video"}},{$ne :["$video",null]},{$ne :["$video",""]}]},then:1,else:0}},
                    "voice": {$cond:{if:{$and:[{$not :{$not :"$voice"}},{$ne :["$voice",null]},{$ne :["$voice",""]}]},then:1,else:0}},
                    "mesaageType": {$cond:{if:{$and:[{$not :{$not :"$type"}},{$ne :["$type",null]},{$ne :["$type",""]},{$eq:["$type","message"]}]},then:1,else:0}},
                    "broadcastType": {$cond:{if:{$and:[{$not :{$not :"$type"}},{$ne :["$type",null]},{$ne :["$type",""]},{$eq:["$type","broadcast"]}]},then:1,else:0}},
                    "takeoffType": {$cond:{if:{$and:[{$not :{$not :"$type"}},{$ne :["$type",null]},{$ne :["$type",""]},{$eq:["$type","takeoff"]}]},then:1,else:0}},
                    "takeoffDecision": {$cond:{if:{$and:[{$not :{$not :"$abnormaldecision"}},{$ne :["$abnormaldecision",null]},{$ne :["$abnormaldecision",""]},{$eq:["$abnormaldecision","approve"]}]},then:1,else:0}},
                    "shiftType": {$cond:{if:{$and:[{$not :{$not :"$type"}},{$ne :["$type",null]},{$ne :["$type",""]},{$eq:["$type","shift"]}]},then:1,else:0}},
                    "sender":"$sender"
                }
            )
                .group(
                {
                    // _id : "$day",//按天统计
                    // _id : "$week",//按周统计
                    // _id : "$month",//按月统计
                    _id : "$"+timespan,//按设定统计
                    // dd:"$textTT",
                    all:{$sum: 1},
                    textCount:{$sum: "$text"},
                    imageCount:{$sum: "$image"},
                    videoCount:{$sum: "$video"},
                    voiceCount:{$sum: "$voice"},
                    mesaageTypeCount:{$sum: "$mesaageType"},
                    broadcastTypeCount:{$sum: "$broadcastType"},
                    takeoffTypeCount:{$sum: "$takeoffType"},
                    takeoffApprove:{$sum: "$takeoffDecision"},//对于接受者，这里是请假成功
                    shiftTypeCount:{$sum: "$shiftType"},
                    sender:{$first: "$sender"}
                }
            ).sort(
                 {_id: 1}
            ).exec(function(err,obj){
                if(!err){
                    //for(var i=0;i<obj.length;i++){

                    callback(err,obj);
                    //}
                }else {
                    callback(err,null);
                }
            })
            break;

        case "receiveMessage":
            console.log('2countType sendMessage ：'+'<>'+countType);
            Messagemodel.aggregate()
                .match({
                        "receiver":mongodb.mongoose.Types.ObjectId(personId),
                        "create_date":{
                            "$gte": new Date(sTime),
                            "$lte": new Date(eTime)
                        }
                    }
                ).project (
                {
                    day : {$substr: [{"$add":["$create_date", 28800000]}, 0, 10] },//时区数据校准，8小时换算成毫秒数为8*60*60*1000=288000后分割成YYYY-MM-DD日期格式便于分组
                    week:{$week: "$create_date" },
                    month:{$week: "$create_date" },
                    "text": {$cond:{if:{$and:[{$not :{$not :"$text"}},{$ne :["$text",null]},{$ne :["$text",""]}]},then:1,else:0}},
                    "image": {$cond:{if:{$and:[{$not :{$not :"$image"}},{$ne :["$image",null]},{$ne :["$image",""]}]},then:1,else:0}},
                    "video": {$cond:{if:{$and:[{$not :{$not :"$video"}},{$ne :["$video",null]},{$ne :["$video",""]}]},then:1,else:0}},
                    "voice": {$cond:{if:{$and:[{$not :{$not :"$voice"}},{$ne :["$voice",null]},{$ne :["$voice",""]}]},then:1,else:0}},
                    "mesaageType": {$cond:{if:{$and:[{$not :{$not :"$type"}},{$ne :["$type",null]},{$ne :["$type",""]},{$eq:["$type","message"]}]},then:1,else:0}},
                    "broadcastType": {$cond:{if:{$and:[{$not :{$not :"$type"}},{$ne :["$type",null]},{$ne :["$type",""]},{$eq:["$type","broadcast"]}]},then:1,else:0}},
                    "takeoffType": {$cond:{if:{$and:[{$not :{$not :"$type"}},{$ne :["$type",null]},{$ne :["$type",""]},{$eq:["$type","takeoff"]}]},then:1,else:0}},
                    "takeoffDecision": {$cond:{if:{$and:[{$not :{$not :"$abnormaldecision"}},{$ne :["$abnormaldecision",null]},{$ne :["$abnormaldecision",""]},{$eq:["$abnormaldecision","approve"]}]},then:1,else:0}},
                    "shiftType": {$cond:{if:{$and:[{$not :{$not :"$type"}},{$ne :["$type",null]},{$ne :["$type",""]},{$eq:["$type","shift"]}]},then:1,else:0}},
                    "receiver":"$receiver"
                }
            )
                .group(
                    {
                        // _id : "$day",//按天统计
                        // _id : "$week",//按周统计
                        // _id : "$month",//按月统计
                        _id : "$"+timespan,//按设定统计
                        // dd:"$textTT",
                        all:{$sum: 1},
                        textCount:{$sum: "$text"},
                        imageCount:{$sum: "$image"},
                        videoCount:{$sum: "$video"},
                        voiceCount:{$sum: "$voice"},
                        mesaageTypeCount:{$sum: "$mesaageType"},
                        broadcastTypeCount:{$sum: "$broadcastType"},
                        takeoffTypeCount:{$sum: "$takeoffType"},
                        takeoffApprove:{$sum: "$takeoffDecision"},//对于接受者，这里是请假批准
                        shiftTypeCount:{$sum: "$shiftType"},
                        receiver:{$first: "$receiver"}
                    }
                ).sort(
                {_id: 1}
            ).exec(function(err,obj){
                if(!err){
                    //for(var i=0;i<obj.length;i++){

                    callback(err,obj);
                    //}
                }else {
                    callback(err,null);
                }
            })
            break;

        default:
            break;
    }
}



MessageDAO.prototype.getAbnormaldMessageFeedback = function(senderID, outcallback,abnormalID) {
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                console.log('callback getAbnormaldMessageFeedback 出错：'+'<>'+err);
            }else{
                for(var index =0;index<obj.length;index++)
                {
                    console.log('callback getAbnormaldMessageFeedback 成功：'+'<>'+obj[index]);
                }
                console.log('callback getAbnormaldMessageFeedback 成功：'+'<>');
            }
        };

    var querystr=abnormalID?{sender:senderID,status:1,abnormalID:abnormalID,$and:[{"abnormaldecision":{$ne :null}},{"abnormaldecision":{$ne :""}}]}:
        {sender:senderID,status:1,$and:[{"abnormaldecision":{$ne :null}},{"abnormaldecision":{$ne :""}}]};

    // console.log('callback getAbnormaldMessageFeedback querystr：'+querystr.sender+'<>'+JSON.stringify(querystr));
    Messagemodel.find(querystr, function(err, obj){
        if(!err && obj){
            callback(err,obj);
        }
        else {
            callback(err,null);
        }
    });
};


var messageObj=new MessageDAO();
// messageObj.sendAMessage(
// 	{text:'今天吃过饭了吗？'},"58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b"
// );
// messageObj.sendAMessage(
//     {text:'今天还没吃过'},"58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b"
// );
// messageObj.sendAMessage(
//     {text:'这里有个事故',image:'message_123.jpg',location:{geolocation:[116.385929,39.996695]}},"58cb2031e68197ec0c7b935b","58c043cc40cbb100091c640d"
// );
// messageObj.sendAMessage(
//     {text:'看看事故现场',video:'message_321.mp4',location:{geolocation:[116.385029,39.992495]}},"58cb3361e68197ec0c7b96c0","58c043cc40cbb100091c640d"
// );
//
// messageObj.sendAMessage(
//     {text:'今天吃过饭了吗？'},"58bff0836253fd4008b3d41b","58c043cc40cbb100091c640d"
// );
// messageObj.sendAMessage(
//     {text:'今天还没吃过'},"58c043cc40cbb100091c640d","58cb3361e68197ec0c7b96c0"
// );
// messageObj.sendAMessage(
//     {text:'这里有个事故kjhkjh123',image:'message_123.jpg',location:{geolocation:[116.385929,39.996695]}},"58cb2031e68197ec0c7b935b","58c043cc40cbb100091c640d"
// );
// messageObj.sendAMessage(
//     {text:'看看事故现场jkhkjh123',video:'message_321.mp4',location:{geolocation:[116.385029,39.992495]}},"58cb2031e68197ec0c7b935b","58c043cc40cbb100091c640d"
// );
// ObjectId("58c96cb24fd511384b81cba5")ObjectId("58c043cc40cbb100091c640d")
// messageObj.getMyNewestMessage("58c043cc40cbb100091c640d");
// messageObj.getMyUnreadMessagesCount("58bff0836253fd4008b3d41b");
// messageObj.readtMessage("58c85b9628b792000a779bfa");
// messageObj.sendAMessage(
//     {text:'这里有个事故kjhkjh123'},"58c043cc40cbb100091c640d","58cb2031e68197ec0c7b935b"
// );
// messageObj.getMessagesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');

// messageObj.getMyNewestMessageFromWho("58c043cc40cbb100091c640d","58bff0836253fd4008b3d41b",false);
// messageObj.getAllUnreadMessages("58dd96c9ac015a0809000070");
// messageObj.countByMessages("594cc13fc6178a040fa76063","2017-01-01","2017-07-01","sendMessage","week|day|month",null);
// messageObj.countByMessages("594cc13fc6178a040fa76063","2017-01-01","2017-07-01","receiveMessage","day",null);
// messageObj.getAbnormaldMessageFeedback("58dd96c9ac015a0809000070",null,null);
module.exports = messageObj;