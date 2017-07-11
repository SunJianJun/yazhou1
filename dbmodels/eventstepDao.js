var mongodb = require('./mongodb');
var EventstepSchema = require('./eventstepschema');
var PersonSchema = require('./personschema');//这里相当于PersonSchema的export，真正要引用PersonSchema，应该这样PersonSchema.PersonSchema
var db = mongodb.mongoose.connection; 
db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){
  
console.log('mongodb connection is ok!:'+mongodb);
});
    

//console.log('mongodb Schema:'+Schema);

var Eventstepmodel = EventstepSchema.Eventstepmodel;
//console.log('mongodb Schema:'+Schema);
var Personmodel=PersonSchema.Personmodel;

var EventstepDAO = function(){};
EventstepDAO.prototype.save = function(obj, callback) {
	Eventstepmodel.create();
	// 终端打印如下信息
console.log('called Eventstep save');
var instance = new Eventstepmodel(obj);
console.log('instance.save:'+instance.name);
instance.save(function(err){
	console.log('save Eventstep'+instance+' fail:'+err);
callback(err);
});
};

EventstepDAO.prototype.findByName = function(name, callback) {
Eventstepmodel.findOne({name:name}, function(err, obj){
callback(err, obj);
});
};



EventstepDAO.prototype.sendAEventstep = function(eventstepObj,senderID,receiverID, outcallback) {
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                //console.log('callback sendAEventstep 出错：'+'<>'+err);
            }else{
                //console.log('callback sendAEventstep 成功：'+'<>'+obj);
            }
        };

    if(!(eventstepObj.text || eventstepObj.image || eventstepObj.voice || eventstepObj.video)){
        callback("你没有发送任何内容！",null);
        return;
	}
    if(!senderID || !receiverID){
        callback("消息没有明确的发送和接收者！",null);
        return;
    }
    eventstepObj.sender=senderID;

    eventstepObj.receiver=receiverID;
    eventstepObj.status=0;//消息是未读的
    var newM=new Eventstepmodel(eventstepObj);
    newM.save( function(err,uobj){
            callback(err, uobj);
    });
    // });
};



EventstepDAO.prototype.getMyNewestEventstep = function(receiverID, outcallback) {
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                //console.log('callback getMyNewestEventstep 出错：'+'<>'+err);
            }else{
            	for(var index =0;index<obj.length;index++)
				{
					console.log('callback getMyNewestEventstep 成功：'+'<>'+obj[index]);
				}
                //console.log('callback getMyNewestEventstep 成功：'+'<>');
            }
        };

    var query = Eventstepmodel.find({'receiver': receiverID,status:0});
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


EventstepDAO.prototype.readtEventstep = function(mid, outcallback) {
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                //console.log('callback readtEventstep 出错：'+'<>'+err);
            }else{
                for(var index =0;index<obj.length;index++)
                {
                    //console.log('callback readtEventstep 成功：'+'<>'+obj[index]);
                }
                //console.log('callback readtEventstep 成功：'+'<>');
            }
        };

    Eventstepmodel.findOne({_id:mid}, function(err, obj){
        if(!err){
            obj.status=1;
            delete obj._id;    //再将其删除
            Eventstepmodel.update({_id:mid},obj,function(err,uobj){
                callback(err, uobj);
            });
        }
        else {
            callback(err,null);
        }
    });
};


var eventstepObj=new EventstepDAO();
// eventstepObj.sendAEventstep(
// 	{text:'今天吃过饭了吗？'},"58bff0836253fd4008b3d41b","58c043cc40cbb100091c640d"
// );
// eventstepObj.sendAEventstep(
//     {text:'今天还没吃过'},"58c043cc40cbb100091c640d","58bff0836253fd4008b3d41b"
// );
// eventstepObj.sendAEventstep(
//     {text:'给我带份饭吧'},"58bff0836253fd4008b3d41b","58c043cc40cbb100091c640d"
// );
// eventstepObj.getMyNewestEventstep("58bff0836253fd4008b3d41b");
// eventstepObj.readtEventstep("58c85b9628b792000a779bfa");
module.exports = eventstepObj;