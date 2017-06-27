/**
 * @module 老的人员管理模块 url：/person
 */
var express = require('express');
var personrouter = express.Router();

//获取数据模型
var person = require('../dbmodels/personDAO.js');
	 //console.log('person数据模型是否存在：'+person);

var personAdd = function(req, res) {
if(req.params.name){//update
return res.render('person', {
title:req.params.name+'|电影|管理|moive.me',
label:'编辑电影:'+req.params.name,
person:req.params.name
});
} else {
return res.render('person',{
title:'新增加|电影|管理|moive.me',
label:'新增加电影',
person:false
});
}
};


//添加一个人
var dopersonAdd = function(req, res) {
	
 //console.log("请求内容："+req+'<>person name in body:'+req.body.name+'<>method:'+req.method);

//req.body.data=personTestData;
//for(var i in req.body){ //console.log("请求内容子项："+i+"<>")};

var json = req.body;
//var json =personTestData;
 //console.log('json._id>'+json._id);
if(json._id){	
} else {//insert
	
 //console.log('调用了dopersonAdd方法');

person.save(json, function(err){
if(err) {
res.send({'success':false,'err':err});
} else {
res.send({'success':true});
}
});/**/
}
};

//保存人员的编辑信息
var dopersonEdit = function(req, res) {
	
 //console.log("请求内容："+req+'<>person name in body:'+req.body.name+'<>method:'+req.method);

//req.body.data=personTestData;
//for(var i in req.body){ //console.log("请求内容子项："+i+"<>")};

var json = req.body;
//var json =personTestData;
 //console.log('json._id>'+json._id);
if(json._id){//update	
 //console.log('调用了dopersonEdit方法');
person.updateById(json, function(err){
if(err) {
res.send({'success':false,'err':err});
} else {
res.send({'success':true});
}
});/**/	
	
} else {//insert

}
};

//根据手机号发回人员信息
var personJSON = function(req, res) {
 //console.log('调用了personJSON方法 by params');
//for(var i in req.params){ //console.log("请求内容params子项："+i+"<>\n")};
person.findByMobile(req.params.mobile,function(err, obj){
res.send(obj);
});
}

//添加人员位置
var personAddLocation = function(req, res) {
console.log('调用了personAddLocation方法 by params:'+req.params);
// //for(var i in req.params){ //console.log("请求内容params子项："+i+"<>")};
// //for(var i in req.body){ //console.log("请求内容body子项："+i+"<>\n")};
person.addNewLocation(req.body.personid,req.body.curlocation,function(err, obj){
	if(err){
		res.send(err);
		}
	else {		
		res.send(obj);
	}
});
}

//
/**
 * 通过身份证解析后的json和手机uuid 和选定的部门id添加用户
 * @param {json} req - IDCard身份证识别方法返回的json 再添加 mobileUUid:"手机的uuid"，departments:[{department：“部门id”，role：“worker|admin|..”},..]
 * @param  {json} res - 注册成功返回{'success':true,"_id":“人员id”}注册失败返回{'success':false,'err':err}
 */
var personAddByIDCard= function(req, res) {
 //console.log('调用了personAddByIDCard方法 by params:'+req.params);
//for(var i in req.params){ //console.log("请求内容params子项："+i+"<>")};
//for(var i in req.body){ //console.log("请求内容body子项："+i+"<>\n")};

var json=req.body;
				 //console.log('personAddByIDCard UUid :'+json.mobileUUid);
person.findByMobileUUid(json.mobileUUid,function(err, obj){
	//根据uuid查询用户
	//如果出错
	if (err) {
		
				 //console.log('用户 personAddByIDCard err:'+err);
	}
	//如果没有错
	else {
		//如果查出这个UUID已有用户，一个手机不能注册两个用户
		if (obj) {
				 //console.log('用户 personAddByIDCard 此用户已经存在 obj:'+obj.name);
            res.send(null);
		}
		//如果没有用户就开始存
		else {
		    // delete json._id;
				 //console.log('用户idNum:'+json.idNum);
			//如果身份证号不为空，这个后面还得加验证
			if (json.idNum) {
				person.save(json, function(err,savedobj){
				if(err) {
				 //console.log('用户save err:'+err);
				res.send({'success':false,'err':err});
				} else {
					
				 //console.log('用户已注册成功:'+json.idNum);
				res.send({'success':true,"_id":savedobj._id});
				if(savedobj.departments && savedobj.departments.length>0){
                    for(var index=0;index<savedobj.departments.length;index++)
                    {
                        person.saveandRegisterwithdepartment(savedobj,savedobj.departments[index].department,null,savedobj.departments[index].role);
                    }
                }

				}
				});/**/
			}

		}
	}
});

}


//根据手机的uuid自动获取用户
var getPersonByUUId = function(req, res) {
 //console.log('调用了getPersonByUUId方法 by params');
//for(var i in req.body){ //console.log("请求内容body子项："+i+"<>\n")};
if (req.body.mobileUUid) {
	
 //console.log('req.body.mobileUUid:'+req.body.mobileUUid);
	person.findByMobileUUid(req.body.mobileUUid,function(err, obj){
		if(err) {
				 //console.log('rgetPersonByUUId查询出差');
				res.send({'success':false,'err':err});
				} else if (obj) {
						
				 //console.log('req.body.mobileUUid查询用户成功:'+obj.name);
				 //console.log('\nreq.body.mobileUUid查询用户成功,用户的照片:'+obj.images.coverSmall);
				res.send(obj);
					}else {							
	res.send(null);
						}});
}else {
	res.send(null);
}

}


//根据用户名密码获取用户
//三种角色，supper，departmentManager，worker
var getPersonByPcLogin = function(req, res) {
    console.log('调用了getPersonByPcLogin方法 by params');
    console.log(req.body);
    //for(var i in req.data){ //console.log("请求内容body子项："+i+"<>\n")};
    if (req.body.name && req.body.pwd ) {
        // //console.log('getPersonByPcLogin:'+req.body.name +'<>'+ req.body.pwd);
        person.findByNameAndPwd(req.body.name , req.body.pwd,function(err, obj){
            if(err) {
                console.log('findByNameAndPwd查询出错');
                res.send({'success':false,'err':err});
            } else if (obj) {

                console.log('pc端findByNameAndPwd查询用户成功:'+obj.name);
                // console.log('\nreq.body.mobileUUid查询用户成功,用户的照片:'+obj.images.coverSmall);
                res.send(obj);
            }else {
                console.log('没有数据');
                res.send(null);
            }});
    }else {
        res.send(null);
    }

}

// 初始化数据库里的用户
var initializePersons = function(req, res) {



    // //console.log('调用了initializePersons方法 by params');
    person.initializePersons(function(err, obj){
        // //console.log('route调用initializePersons errs'+err);
        res.send(obj);
	});
}

// 得到用户的最新位置
var getPersonLatestPosition = function(req, res) {
    // //console.log('call getPersonLatestPosition');
    //for(var i in req.body){ //console.log("getPersonLatestPosition 请求内容body子项："+i+"<>\n")};
    var personID=req.body.personID;
    // 调用方法
    // messageObj.getMessagesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // console.log('personID:'+personID);
    person.getPersonLatestPosition(personID,function( err,obj){
        if(!err) {
            // console.log('getPersonLatestPosition 查询所有'+personID+'最新的位置:'+obj);
            res.send(obj);
        } else{
            // //console.log('getPersonLatestPosition 查询所有'+personID+'最新的位置:'+err);
            res.send(null);
        }});
}
// 得到用户一段时间内的位置
var getPersonPositionInTimespan = function(req, res) {
    // //console.log('call getPersonLatestPositionInTimespan');
    //for(var i in req.body){ //console.log("getPersonLatestPositionInTimespan 请求内容body子项："+i+"<>\n")};
    var personid=req.body.personID;
    var startTime=req.body.startTime;
    var endTime=req.body.endTime;
    console.log(req.body);
    // 调用方法
    // messageObj.getMessagesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // //console.log('senderID:'+senderID);
    person.getPersonLatestPositionInTimespan(personid,startTime,endTime,function( err,obj){
        if(!err) {
            // //console.log('getPersonLatestPositionInTimespan 查询所有'+personid+'发送的消息id:'+obj);
            res.send(obj);
        } else{
            // //console.log('getPersonLatestPositionInTimespan 查询所有'+personid+'发送的消息为空:'+err);
            res.send(null);
        }});
}

// 根据用户id查询同事
var getWorkmatesByUserId = function(req, res) {
    // //console.log('call getWorkmatesByUserId');
    //for(var i in req.body){ //console.log("getWorkmatesByUserId 请求内容body子项："+i+"<>\n")};
    var userid=req.body.userid;
    // var userid='58c043cc40cbb100091c640d';
    // 调用方法
    person.getWorkmatesByUserId(userid,function(err,obj){
        if(!err) {
            // //console.log('getWorkmatesByUserId 查询所有'+userid+'相关同事ok:'+obj);
            res.send(obj);
        } else{
            // //console.log('getWorkmatesByUserId 查询所有'+userid+'相关同事为空:'+err);
            res.send(null);
        }});
}
var getUserPicById = function(req, res) {
    // //console.log('call getUserPicById');
    //for(var i in req.body){ //console.log("getUserPicById 请求内容body子项："+i+"<>\n")};
    var userid=req.body._id;
    // 调用方法
    person.getUserPicById(userid,function( err,obj){
        if(!err) {
            // //console.log('getUserPicById 查询'+userid+'照片ok:');
            res.send(obj);
        } else{
            // //console.log('getUserPicById 查询'+userid+'照片错误:'+err);
            res.send(null);
        }});
}
personrouter.get('/add',personAdd);//增加
personrouter.post('/add',dopersonAdd);//提交
personrouter.post('/edit',dopersonEdit);//提交
personrouter.options('/add',dopersonAdd);//提交
personrouter.get('/:mobile',personJSON);//编辑查询
personrouter.post('/addlocation',personAddLocation);//提交
personrouter.post('/registerByIdcard',personAddByIDCard);//提交
personrouter.post('/getPersonByUUId',getPersonByUUId);//提交
personrouter.post('/pcLogin',getPersonByPcLogin);//提交
personrouter.post('/getUserPicById',getUserPicById);//提交
// personrouter.post('/initializePersons',initializePersons);//提交
personrouter.post('/getPersonLatestPosition',getPersonLatestPosition);//提交
personrouter.post('/getPersonLatestPositionInTimespan',getPersonPositionInTimespan);//提交
personrouter.post('/getWorkmatesByUserId',getWorkmatesByUserId);//提交   根据用户id查询同事

module.exports = personrouter;