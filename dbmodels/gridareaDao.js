var mongodb = require('./mongodb');
var GridareaSchema = require('./gridareaschema');//这里相当于GridareaSchema的export，真正要引用GridareaSchema，应该这样GridareaSchema.GridareaSchema
var db = mongodb.mongoose.connection;
var fs=require('fs');
var PersonSchema = require('./personschema');//这里相当于PersonSchema的export，真正要引用PersonSchema，应该这样PersonSchema.PersonSchema
var Personmodel=PersonSchema.Personmodel;

db.on('error',console.error.bind(console,'连接错误:'));
db.on('open',function(){
  
console.log('mongodb GridareaSchema connection is ok!:'+mongodb);
});
    

//console.log('mongodb Schema:'+Schema);
var Gridareamodel=GridareaSchema.Gridareamodel;
//Gridareamodel= mongodb.mongoose.model("Gridarea", GridareaSchema);
console.log('mongodb Gridarea model is ok?:'+mongodb.mongoose.model("Gridarea"));
//for(var i in Gridarea){console.log("Gridarea model items："+i+"<>")};
/*
var testperson={
		    'name': '123',
				'alias':'123',
				'title':'123',
				'mobile':'123123',
				'age':'123'
		};
*/
var GridareaDAO = function(){};

GridareaDAO.prototype.save = function(obj, callback) {
	//Gridareamodel.create();
	// 终端打印如下信息
console.log('called Gridarea save');
var instance = new Gridareamodel(obj);
console.log('param value:'+obj+'<>instance.save:'+instance);
instance.save(function(err){
	console.log('save Gridarea'+instance+' fail:'+err);
callback(err);
});
};

GridareaDAO.prototype.findByName = function(qname, callback) {
Gridareamodel.findOne({name:qname}, function(err, obj){
callback(err, obj);
});
};

GridareaDAO.prototype.getAllValidGridarea = function( outcallback) {
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                //console.log('callback getAllValidGridarea 出错：'+'<>'+err);
            }else{
                //console.log('callback getAllValidGridarea 成功：'+'<>'+obj.length);
            }
        };
    Gridareamodel.find({status:1}, function(err, obj){
        callback(err, obj);
    });
};

//根据位置查找图片，coords为二维数组，先经度后纬度
GridareaDAO.prototype.findEventByGridarea = function(eventName, callback) {
	var maxDistance=0.01;//查找半径
	  Gridareamodel.find({
      imggridarea: {
        $near: coords,
        $maxDistance: maxDistance
      }
    },function(err, images) {
    		if(!err){		
						callback(err, images);
					}else{
						callback(err, null);
					}
    	});
};
//添加一个新的网格区域
GridareaDAO.prototype.addNewGridarea=function(geojson,outcallback,otherObjs){
    var callback=outcallback?outcallback:function (err,obj) {
                    if(err)
                    {
                        //console.log('callback 指定添加新的 addNewGridarea 出错：'+'<>'+err);
                    }else{
                        //console.log('callback 指定添加新的 addNewGridarea 成功：'+'<>'+obj.name);
                    }
        };
    var Objs=otherObjs?otherObjs:{name:'unknown',status:1};
    Objs.status=Objs.status?Objs.status:1;
    Objs.geometry=geojson;
    var newarea=new Gridareamodel(Objs);
    newarea.save(function(err,obj){

            callback(err, obj);
	});
  //此时才能用Model操作，否则报错
};

//更新网格区域
GridareaDAO.prototype.updateGridarea = function(id,geojson, outcallback,otherObjs) {
	var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                //console.log('callback 指定 updateGridarea 出错：'+'<>'+err);
            }else{
                //console.log('callback 指定 updateGridarea 成功：'+'<>'+obj);
            }
    };
    var Objs=otherObjs?otherObjs:{};
    Gridareamodel.findOne({_id:id}, function(err, obj){
        obj.geometry=geojson;
        obj.name=otherObjs.name?otherObjs.name: obj.name;
        obj.status=otherObjs.status?otherObjs.status: obj.status;
        delete obj._id;    //再将其删除
        Gridareamodel.update({_id:id},obj,function(err,uobj){
            callback(err, uobj);
        });
    });
};

// 人员绑定到此网格
GridareaDAO.prototype.ondutyGridarea = function(areaid,personid, outcallback) {
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                //console.log('callback ondutyGridarea 出错：'+'<>'+err);
            }else{
                //console.log('callback ondutyGridarea 成功：'+'<>'+obj);
            }
        };
        // Personmodel.findOne({_id:personid},function(err, personobj){
            Gridareamodel.findOne({_id:areaid}, function(err,areaobj){
                var pss=areaobj.persons;
                for(var index=0;index<pss.length;index++){
                    if(pss.person==mongodb.mongoose.Schema.Types.ObjectId,(personid))
                    return callback("已经有此人在这个网格了",null);
                }
                areaobj.persons.push({role:'work',onDutyTime:new Date(),person:personid});
                delete areaobj._id;
                Gridareamodel.update({_id:areaid},areaobj,function(err,uobj){
                    callback(err, uobj);
                });
            });
            // });

};

GridareaDAO.prototype.offdutyGridarea = function(areaid,personid, outcallback) {
    var callback=outcallback?outcallback:function (err,obj) {
            if(err)
            {
                //console.log('callback offutyGridarea 出错：'+'<>'+err);
            }else{
                //console.log('callback offutyGridarea 成功：'+'<>'+obj);
            }
        };
    // Personmodel.findOne({_id:personid},function(err, personobj){
    Gridareamodel.findOne({_id:areaid}, function(err,areaobj){
        var pss=areaobj.persons;
        for(var index=0;index<pss.length;index++){
            if(pss.person==mongodb.mongoose.Schema.Types.ObjectId,(personid))
			{
                areaobj.persons.splice(index, 1);
                break;
			}
        }
        delete areaobj._id;
        Gridareamodel.update({_id:areaid},areaobj,function(err,uobj){
            callback(err, uobj);
        });
    });
    // });

};

var gridObj=new GridareaDAO();
//以下是测试代码,不用再运行了，北京 崖州的测试数据都已经导入
//  var file=".\\yazhougridpolygon_wgs84.json";
// //var file=".\\beijingtest.json";
// var jsonstr=JSON.parse(fs.readFileSync( file));
// if(jsonstr.features){
//     for(var index=0;index<jsonstr.features.length;index++){
//         //console.log('auto features[index]：'+jsonstr.features[index].geometry);
//         var coors=(jsonstr.features[index].geometry.coordinates+'').split(',');
//         jsonstr.features[index].geometry.coordinates=coors;
//         gridObj.addNewGridarea(jsonstr.features[index].geometry,null,jsonstr.features[index].properties);
//     }
// }

// gridObj.getAllValidGridarea();
// gridObj.ondutyGridarea("58c97096f6ea9f30353dd4ae","58c043cc40cbb100091c640d");
// // ObjectId("58c97096f6ea9f30353dd4af"),ObjectId("58c97096f6ea9f30353dd4c9")
// gridObj.ondutyGridarea("58c97096f6ea9f30353dd4af","58c043cc40cbb100091c640d");
// gridObj.offdutyGridarea("58c97096f6ea9f30353dd4b0","58c043cc40cbb100091c640d");
// gridObj.ondutyGridarea("58c97096f6ea9f30353dd4c9","58c043cc40cbb100091c640d");
// gridObj.ondutyGridarea("58c97096f6ea9f30353dd4cc","58c043cc40cbb100091c640d");
// gridObj.ondutyGridarea("58c97096f6ea9f30353dd4ca","58c043cc40cbb100091c640d");
// gridObj.ondutyGridarea("58c97096f6ea9f30353dd4cb","58c043cc40cbb100091c640d");
// ObjectId("58c043cc40cbb100091c640d")
// gridObj.getAllValidGridarea();
module.exports = gridObj;