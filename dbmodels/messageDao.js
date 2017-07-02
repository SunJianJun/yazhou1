var mongodb = require('./mongodb');
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
    messageObj.type="broadcast";
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
    var jjtype=type?type:"message";
    var query = Messagemodel.find();
    query.or([{'receiver': receiverID,'type':jjtype,sender:senderID,create_date:{
        "$gte": new Date(startTime),
        "$lt":new Date(endtime)
    }}, {'receiver':senderID,sender:receiverID,'type':jjtype,create_date:{
        "$gte": new Date(startTime),
        "$lt":new Date(endtime)
    }}]);
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


MessageDAO.prototype.readtAbnormalMessage = function(mid,curUserID,decision, outcallback) {
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
                Messagemodel.update({_id:mid},{status:1,"decision":decision},function(err,uobj){
                    callback(err, uobj);
                });
            }else if(curUserID==""){
                Messagemodel.update({_id:mid},{status:1,"decision":decision},function(err,uobj){
                    callback(err, uobj);
                });

            }
        }
        else {
            callback(err,null);
        }
    });
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
module.exports = messageObj;