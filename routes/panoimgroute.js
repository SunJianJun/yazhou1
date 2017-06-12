var express = require('express');
var panoimgrouter = express.Router();


var panoimg = require('../dbmodels/panoimgDao.js');
	 //console.log('panoimg数据模型是否存在：'+panoimg);

var panoimgAdd = function(req, res) {
if(req.params.name){//update
return res.render('panoimg', {
title:req.params.name+'|电影|管理|moive.me',
label:'编辑电影:'+req.params.name,
panoimg:req.params.name
});
} else {
return res.render('panoimg',{
title:'新增加|电影|管理|moive.me',
label:'新增加电影',
panoimg:false
});
}
};

var dopanoimgAdd = function(req, res) {
	
 //console.log("请求内容："+req+'<>panoimg name in body:'+req.body.name+'<>method:'+req.method);

//req.body.data=panoimgTestData;
//for(var i in req.body){ //console.log("请求内容子项："+i+"<>")};

var json = req.body;
//var json =panoimgTestData;
 //console.log('json._id>'+json._id);
if(json._id){//update
} else {//insert
	
 //console.log('调用了dopanoimgAdd方法');

panoimg.save(json, function(err){
if(err) {
res.send({'success':false,'err':err});
} else {
res.send({'success':true});
}
});/**/
}
};

var dopanoimgEdit = function(req, res) {
	
 //console.log("请求内容："+req+'<>panoimg name in body:'+req.body.name+'<>method:'+req.method);

//req.body.data=panoimgTestData;
//for(var i in req.body){ //console.log("请求内容子项："+i+"<>")};

var json = req.body;
//var json =panoimgTestData;
 //console.log('json._id>'+json._id);
if(json._id){//update	
 //console.log('调用了dopanoimgEdit方法');
panoimg.updateById(json, function(err){
if(err) {
res.send({'success':false,'err':err});
} else {
res.send({'success':true});
}
});/**/	
	
} else {//insert

}
};


//根据文化遗产id获取全景图
var panoimgJSON = function(req, res) {
 //console.log('调用了panoimgJSON方法 by params:'+req.params);
//for(var i in req.params){ //console.log("请求内容子项："+i+"<>")};
 //console.log('调用了req.query.hpId:'+req.query.hpId);
panoimg.findByhpID(req.query.hpId,function(err, obj){
res.send(obj);
});
};

//删除全景图
var dopanoimgRemove = function(req, res) {
 //console.log('调用了dopanoimgRemove方法 by params:'+req.body._id);
var json = req.body;
//for(var i in json){ //console.log("请求内容子项："+i+"<>")};
panoimg.removeById(json._id,function(err, obj){
res.send(obj);
});
};

panoimgrouter.get('/add',panoimgAdd);//增加
panoimgrouter.post('/add',dopanoimgAdd);//增加
panoimgrouter.options('/edit',dopanoimgEdit);//编辑
panoimgrouter.post('/remove',dopanoimgRemove);//删除
panoimgrouter.get('/:hpId',panoimgJSON);//查询

module.exports = panoimgrouter;