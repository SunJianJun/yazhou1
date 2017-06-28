var express = require('express');
var movierouter = express.Router();


var Movie = require('../dbmodels/movie.js');
	 //console.log('Movie数据模型是否存在：'+Movie);

var movieAdd = function(req, res) {
if(req.params.name){//update
return res.render('movie', {
title:req.params.name+'|电影|管理|moive.me',
label:'编辑电影:'+req.params.name,
movie:req.params.name
});
} else {
return res.render('movie',{
title:'新增加|电影|管理|moive.me',
label:'新增加电影',
movie:false
});
}
};

/*
var movieTestData={
			"name": "ffff2fsdf",
			"alias": ["Future X-Cops ","Mei loi ging chaat"],
			"publish": "2010-04-29",
			"images":{
			"coverBig":"/img/movie/1_big.jpg",
			"coverSmall":"/img/movie/1_small.jpg"
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

var doMovieAdd = function(req, res) {
	
 //console.log("请求内容："+req+'<>movie name in body:'+req.body.name+'<>method:'+req.method);

//req.body.data=movieTestData;
//for(var i in req.body){ //console.log("请求内容子项："+i+"<>")};

var json = req.body;
//var json =movieTestData;
 //console.log('json._id>'+json._id);
if(json._id){//update
} else {//insert
	
 //console.log('调用了doMovieAdd方法');

Movie.save(json, function(err){
if(err) {
res.send({'success':false,'err':err});
} else {
res.send({'success':true});
}
});/**/
}
};

exports.movieJSON = function(req, res) {
Movie.findByName(req.params.name,function(err, obj){
res.send(obj);
});
}




movierouter.get('/add',movieAdd);//增加
movierouter.post('/add',doMovieAdd);//提交
movierouter.options('/add',doMovieAdd);//提交
movierouter.get('/:name',movieAdd);//编辑查询

module.exports = movierouter;