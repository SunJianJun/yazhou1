var express = require('express');
var eventrouter = express.Router();


var event = require('../dbmodels/eventschema.js');
	 //console.log('event数据模型是否存在：'+event);

var eventAdd = function(req, res) {
if(req.params.name){//update
return res.render('event', {
title:req.params.name+'|电影|管理|moive.me',
label:'编辑电影:'+req.params.name,
event:req.params.name
});
} else {
return res.render('event',{
title:'新增加|电影|管理|moive.me',
label:'新增加电影',
event:false
});
}
};

/*
var eventTestData={
			"name": "ffff2fsdf",
			"alias": ["Future X-Cops ","Mei loi ging chaat"],
			"publish": "2010-04-29",
			"images":{
			"coverBig":"/img/event/1_big.jpg",
			"coverSmall":"/img/event/1_small.jpg"
			},
			"source":[{
			"source":"优酷",
			"link":"http://www.youku.com",
			"swfLink":"http://player.youku.com/player.php/sid/XMTY4NzM5ODc2/v.swf",
			"quality":"高清",
			"version":"正片",
			"lang":"汉语",
			"subtitle":"中文字幕"
			},{
			"source":"搜狐",
			"link":"http://tv.sohu.com",
			"swfLink":"http://share.vrs.sohu.com/75837/v.swf&topBar=1&autoplay=false&plid=3860&pub_catecode=",
			"quality":"高清",
			"version":"正片",
			"lang":"汉语",
			"subtitle":"中文字幕"
			}]
			};*/

var doeventAdd = function(req, res) {
	
 //console.log("请求内容："+req+'<>event name in body:'+req.body.name+'<>method:'+req.method);

//req.body.data=eventTestData;
//for(var i in req.body){ //console.log("请求内容子项："+i+"<>")};

var json = req.body;
//var json =eventTestData;
 //console.log('json._id>'+json._id);
if(json._id){//update
} else {//insert
	
 //console.log('调用了doeventAdd方法');

event.save(json, function(err){
if(err) {
res.send({'success':false,'err':err});
} else {
res.send({'success':true});
}
});/**/
}
};

exports.eventJSON = function(req, res) {
event.findByName(req.params.name,function(err, obj){
res.send(obj);
});
}




eventrouter.get('/add',eventAdd);//增加
eventrouter.post('/add',doeventAdd);//提交
eventrouter.options('/add',doeventAdd);//提交
eventrouter.get('/:name',eventAdd);//编辑查询

module.exports = eventrouter;