var mongodb = require('./mongodb');
var mongoose = require('mongoose');
var SpotareaSchema = require('./spotareaschema');
var PersonSchema = require('./personschema');//这里相当于PersonSchema的export，真正要引用PersonSchema，应该这样PersonSchema.PersonSchema
var db = mongodb.mongoose.connection; 
db.on('error',
console.error.bind(console,'连接错误:')
);
db.once('open',function(){
  
console.log('mongodb connection is ok!:a'+mongodb);
});
    

//console.log('mongodb Schema:'+Schema);

var Spotareamodel = SpotareaSchema.Spotareamodel;
// console.log('mongodb Schema:'+Schema);
var Personmodel=PersonSchema.Personmodel;

var SpotareaDAO = function(){};
SpotareaDAO.prototype.save = function(obj, callback) {
	Spotareamodel.create();
	// 终端打印如下信息
console.log('called Spotarea save');
var instance = new Spotareamodel(obj);
console.log('instance.save:'+instance.name);
instance.save(function(err){
	console.log('save Spotarea'+instance+' fail:'+err);
callback(err);
});
};

SpotareaDAO.prototype.findByName = function(name, callback) {
    Spotareamodel.findOne({name:name}, function(err, obj){
        callback(err, obj);
    });
};

SpotareaDAO.prototype.sendASpotarea = function(spotareaObj, outcallback) {

    console.log('添加数据');
    // console.log(outcallback);
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                console.log('callback sendASpotarea 出错：-'+'<>'+err);
            }else{
                console.log('callback sendASpotarea 成功：-'+'<>'+obj);
            }
        };

    // spotareaObj.sender=senderID;

    // spotareaObj.receiver=receiverID;
    spotareaObj.status=1;
    var newM=new Spotareamodel(spotareaObj);
    newM.save( function(err,uobj){
            if(err)
        {
            console.log('callback sendASpotarea 出错：'+'<>'+err);
            callback(err, null);
        }else{
                console.log('callback sendASpotarea 成功：'+'<>'+uobj._id);
                callback(err, uobj);
        }
    });
};



SpotareaDAO.prototype.getMyNewestSpotarea = function(receiverID, outcallback) {
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                //console.log('callback getMyNewestSpotarea 出错：'+'<>'+err);
            }else{
            	for(var index =0;index<obj.length;index++)
				{
					console.log('callback getMyNewestSpotarea 成功：'+'<>'+obj[index]);
				}
                //console.log('callback getMyNewestSpotarea 成功：'+'<>');
            }
        };

    var query = Spotareamodel.find({'receiver': receiverID,status:0});
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

SpotareaDAO.prototype.getNewestSpotarea = function(outcallback) {
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                console.log('callback getMyNewestSpotareaFromWho 出错：');
            }else{
                console.log('callback getMyNewestSpotareaFromWho 成功：');
            }
        };

    var query = Spotareamodel.find({status:1});
    // 排序，不过好像对子文档无效
    query.exec(function (err, docs) {
        if(!err){
            callback(err,docs);
        }else{
            callback(null)
        }
    });
};


SpotareaDAO.prototype.spotareaDelete=function(name,outcallback){
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                console.log('callback spotareaDelete 出错：'+'<>'+err);
            }else{
                for(var index =0;index<obj.length;index++)
                {
                    console.log('callback spotareaDelete 成功：'+'<>'+obj[index]);
                }
                if(obj.abstract){
                    console.log('callback spotareaDelete 成功：'+'<>'+obj.abstract+'<>'+obj.count+'<>'+obj.lastTime);
                }
            }
        };
    var query = Spotareamodel.remove({'name': name,status:1},{});
    query.exec(function (err, docs) {
        if(!err){
            // console.log(docs);
            callback(err,docs);
        }
        else {
            console.log('没有数据');
            callback(err,0);
        }
    });
}
SpotareaDAO.prototype.spotareapeopleDelete=function(areaID,position,outcallback){
    // var areaID=area.areaID;
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                console.log('callback spotareapeopleDelete 出错：'+'<>'+err);
            }else{
                for(var index =0;index<obj.length;index++)
                {
                    console.log('callback spotareapeopleDelete 成功：'+'<>'+obj[index]);
                }
                if(obj.abstract){
                    console.log('callback spotareapeopleDelete 成功：'+'<>'+obj.abstract+'<>'+obj.count+'<>'+obj.lastTime);
                }
            }
        }
             // query=Spotareamodel.update({'name':name,status:1},{'persons':person.splice(id,1)},{});
        var query=Spotareamodel.find({_id:areaID,status:1},function(err,result){
            if(err){
                console.log(err);
            }else{
                var person=result[0].persons;
                if(person && person.length && (person.length>(position)) ){
                    person.splice(position,1)
                    Spotareamodel.update({_id:areaID},{$set:{'persons':person}},function(err,res){
                        if(!err){

                            console.log('修改');
                            console.log(res);
                            callback(err,res);
                        }
                        else {
                            console.log('没有数据');
                            callback(err,0);
                        }
                    });
                }
            }
        });
}

SpotareaDAO.prototype.getSpotareasInATimeSpanFromWho = function(receiverID,senderID,startTime,endtime, outcallback) {
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                //console.log('callback getSpotareasInATimeSpanFromWho 出错：'+'<>'+err);
            }else{
                for(var index =0;index<obj.length;index++)
                {
                    //console.log('callback getSpotareasInATimeSpanFromWho 成功：'+'<>'+obj[index]);
                }
                if(obj.abstract){

                    //console.log('callback getSpotareasInATimeSpanFromWho 成功：'+'<>'+obj.abstract+'<>'+obj.count+'<>'+obj.lastTime);
                }

            }
        };

    var query = Spotareamodel.find();
    query.or([{'receiver': receiverID,sender:senderID,create_date:{
        "$gte": new Date(startTime),
        "$lt":new Date(endtime)
    }}, {'receiver':senderID,sender:receiverID,create_date:{
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
                //     unreadspotareas:docs
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


SpotareaDAO.prototype.getMyUnreadSpotareasCount = function(receiverID, outcallback) {
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                //console.log('callback getMyUnreadSpotareasCount 出错：'+'<>'+err);
            }else{
                for(var index =0;index<obj.length;index++)
                {
                    //console.log('callback getMyUnreadSpotareasCount 成功：'+'<>'+obj[index]);
                }
                //console.log('callback getMyUnreadSpotareasCount 成功：'+'<>未读消息数量:'+obj);
            }
        };

    var query = Spotareamodel.find({'receiver': receiverID,status:0},{_id:1});
    query.exec(function (err, docs) {
        if(!err){
            callback(err,docs.length);
        }
        else {
            callback(err,0);
        }
    });
};



SpotareaDAO.prototype.sendPersontarea = function(mid,callback) {
    Spotareamodel.findOne({_id:mid.areaID}, function(err, obj){
        if(!err && obj){
            if(!obj.persons){obj.persons=[];}
            obj.persons.push(mid);
            obj.save(function(err,uobj){
                //console.log(uobj)
                callback(err, uobj);
            });
        }else {
            console.log('获取失败');
            callback(err,null);
        }
    });
};
SpotareaDAO.prototype.updateASpotarea=function(uid,uname,ucoordinates,callback){

    Spotareamodel.update({_id:uid},{name:uname,coordinates:ucoordinates},function(err,obj){
        if(err){
            callback(err,obj)
        }else{
            callback(null,obj)
        }
    })
}
//获取人员被安排巡逻的区域和时间
SpotareaDAO.prototype.getASpotareatoperson=function(id,callback){
    //Spotareamodel.find({},{persons: {
    //    $elemMatch: {
    //        personID:id
    //    }
    //}
    //}
    //).exec(function(err,obj){
    //    if(err){
    //        callback(err)
    //    }else{
    //        callback(null,obj)
    //    }
    //})
    //var id=mongoose.Types.ObjectId(id)
    var id=id.toString()//防止传的是对象字符串，需要转换一下
    Spotareamodel.aggregate()
        .unwind("persons")
        .match({
                "persons.personID":id
            }
        )
        .group({
                "_id": "$_id",
                "geometry":{$push:"$geometry"},
                "person": {$push: "$persons"}
            })
        .exec(function(err,obj){
        if(err){
            callback(err)
        }else{
            callback(null,obj)
        }
    })
}

var spotareaObj=new SpotareaDAO();
// spotareaObj.sendASpotarea({
//     name:'666',
//     geometry:{
//         type:'Polygon',
//         coordinates:[116.520748,39.976326,116.520748,39.946326,116.560748,39.946326,116.560748,39.976326]
//        },
//       properties : {
//          name: '张三'
//       }
// });
// spotareaObj.sendASpotarea(
//     {text:'今天还没吃过'}
//     );
// spotareaObj.sendASpotarea(
//     {text:'这里有个事故',image:'spotarea_123.jpg',location:{geolocation:[116.385929,39.996695]}},"58cb2031e68197ec0c7b935b","58c043cc40cbb100091c640d"
// );
// spotareaObj.sendASpotarea(
//     {text:'看看事故现场',video:'spotarea_321.mp4',location:{geolocation:[116.385029,39.992495]}},"58cb3361e68197ec0c7b96c0","58c043cc40cbb100091c640d"
// );
//
// spotareaObj.sendASpotarea(
//     {text:'今天吃过饭了吗？'},"58bff0836253fd4008b3d41b","58c043cc40cbb100091c640d"
// );
// spotareaObj.sendASpotarea(
//     {text:'今天还没吃过'},"58c043cc40cbb100091c640d","58cb3361e68197ec0c7b96c0"
// );
// spotareaObj.sendASpotarea(
//     {text:'这里有个事故kjhkjh123',image:'spotarea_123.jpg',location:{geolocation:[116.385929,39.996695]}},"58cb2031e68197ec0c7b935b","58c043cc40cbb100091c640d"
// );
// spotareaObj.sendASpotarea(
//     {text:'看看事故现场jkhkjh123',video:'spotarea_321.mp4',location:{geolocation:[116.385029,39.992495]}},"58cb2031e68197ec0c7b935b","58c043cc40cbb100091c640d"
// );
// ObjectId("58c96cb24fd511384b81cba5")ObjectId("58c043cc40cbb100091c640d")
// spotareaObj.getMyNewestSpotarea("58c043cc40cbb100091c640d");
// spotareaObj.getMyUnreadSpotareasCount("58bff0836253fd4008b3d41b");
// spotareaObj.sendPersontarea("58c85b9628b792000a779bfa");
// spotareaObj.sendASpotarea(
//     {text:'这里有个事故kjhkjh123'},"58c043cc40cbb100091c640d","58cb2031e68197ec0c7b935b"
// );
// spotareaObj.getSpotareasInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');

// spotareaObj.getMyNewestSpotareaFromWho("58c043cc40cbb100091c640d","58bff0836253fd4008b3d41b",false);
module.exports = spotareaObj;