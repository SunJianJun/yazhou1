var express = require('express');
var heritagepointrouter = express.Router();


var heritagepoint = require('../dbmodels/heritagepointDao.js');
	 //console.log('heritagepoint数据模型是否存在：'+heritagepoint);


var doheritagepointAdd = function(req, res) {
	
 //console.log("请求内容："+req+'<>heritagepoint name in body:'+req.body.name+'<>method:'+req.method);

//req.body.data=heritagepointTestData;
//for(var i in req.body){ //console.log("请求内容子项："+i+"<>")};

var json = req.body;
//var json =heritagepointTestData;
 //console.log('json._id>'+json._id);

 //console.log('json.icon>'+json.icon);
if(json._id){//update
} else {//insert
	
 //console.log('调用了doheritagepointAdd方法');

heritagepoint.save(json, function(err){
if(err) {
res.send({'success':false,'err':err});
} else {
res.send({'success':true});
}
});/**/
}
};

var findAll = function(req, res) {
heritagepoint.findAll(function(err, obj){
 //console.log('文化遗产obj长度：'+obj.length);
	
res.send(obj);
});
}

//删除文化遗产
var doheritagepointRemove = function(req, res) {
 //console.log('doheritagepointRemove by params:'+req.body._id);
var json = req.body;
//for(var i in json){ //console.log("请求内容子项："+i+"<>")};
heritagepoint.removeById(json._id,function(err, obj){
res.send(obj);
});
};

//编辑文化遗产
var doheritagepointEdit=function(req, res) {
	 //console.log("请求内容：doheritagepointEdit"+req+'<>person name in body:'+req.body.name+'<>method:'+req.method);

//req.body.data=personTestData;
//for(var i in req.body){ //console.log("请求内容子项："+i+"<>")};

var json = req.body;
//var json =personTestData;
 //console.log('json._id>'+json._id);
if(json._id){//update	
 //console.log('调用了dopersonEdit方法');
heritagepoint.updateById(json, function(err){
if(err) {
res.send({'success':false,'err':err});
} else {
res.send({'success':true});
}
});/**/	
	
} else {//insert

}
	};


heritagepointrouter.get('/findall',findAll);//得到全部遗产点
heritagepointrouter.post('/add',doheritagepointAdd);//提交增加
heritagepointrouter.options('/add',doheritagepointAdd);//提交
heritagepointrouter.post('/remove',doheritagepointRemove);//删除
heritagepointrouter.post('/edit',doheritagepointEdit);//删除

module.exports = heritagepointrouter;