/**
 * Created by tj on 2017/6/24.
 */
/**
 * @module 登录注册模块
 */
var express = require('express');
var loginrouter = express.Router();

//获取数据模型
var login = require('../dbmodels/loginDAO.js');
//console.log('login数据模型是否存在,from loginrouter：'+login);

var loginAdd = function(req, res) {
    if(req.params.name){//update
        return res.render('login', {
            title:req.params.name+'|电影|管理|moive.me',
            label:'编辑电影:'+req.params.name,
            login:req.params.name
        });
    } else {
        return res.render('login',{
            title:'新增加|电影|管理|moive.me',
            label:'新增加电影',
            login:false
        });
    }
};


//添加一个部门
var dologinAdd = function(req, res) {
    //解析客户端发回的请求
    //console.log("请求内容："+req+'<>login name in body:'+req.body.name+'<>method:'+req.method);

//req.body.data=loginTestData;req.body应该就是部门的json
//for(var i in req.body){ //console.log("请求内容子项："+i+"<>")};

    var json = req.body;
//添加部门是要判断它有没有parent,这个需要在客户端设置
    //console.log('json.parentID>'+json.parentID);
    var cback=function (err,obj) {

    };
    var parentDp;
    if(json.parentID){
        parentDp=login.getParent(json.parentID,cback);
    } else {//insert

        //console.log('调用了dologinAdd方法');

        login.save(json, function(err){
            if(err) {
                res.send({'部门保存出错err':err});
            } else {
                var newobid=  login.get("_id");
                // //console.log('新添加部门的id：'+newobid);
                parentDp.add(login);
                parentDp.save();
                res.send({'部门保存success':true});
            }
        });/**/
    }
};

//编辑信息
var dologinEdit = function(req, res) {

    //console.log("请求内容："+req+'<>login name in body:'+req.body.name+'<>method:'+req.method);

//req.body.data=loginTestData;req.body应该就是部门的json
//for(var i in req.body){ //console.log("请求内容子项："+i+"<>")};

    var json = req.body;
//var json =loginTestData;
    //console.log('json._id>'+json._id);
    if(json._id){//update	
                 //console.log('调用了dologinEdit方法');
        login.updateById(json, function(err){
            if(err) {
                res.send({'对部门的编辑已经保存':false,'err':err});
            } else {
                res.send({'success':true});
            }
        });/**/

    } else {//insert

    }
};

//初始化数据库的部门信息
var loginInitialize = function(req, res) {
    // //console.log('调用了login初始化方法 by params');

    login.refreshDatabase(function(err, obj){
        res.send(obj);
    });
};

//得到全部的部门
var loginAllJSON = function(req, res) {
    // //console.log('调用了loginJSON方法 by params');
    ////for(var i in req.params){ console.log("请求内容params子项："+i+"<>\n")};
    login.getAllLogin(function(err, obj){
        res.send(obj);
    });
};

//得到全部在状态的部门以及下属人员
var loginAllWorkingJSON = function(req, res) {
    // //console.log('调用了loginAllWorkingJSON方法 by params');
    ////for(var i in req.params){ console.log("请求内容params子项："+i+"<>\n")};
    login.findByMobile(req.params.mobile,function(err, obj){
        res.send(obj);
    });
};

//根据手机号发回部门员信息
var loginJSON = function(req, res) {
    //console.log('调用了loginJSON方法 by params');
//for(var i in req.params){ //console.log("请求内容params子项："+i+"<>\n")};
    login.findByMobile(req.params.mobile,function(err, obj){
        res.send(obj);
    });
};

//添加部门员位置
var loginAddLocation = function(req, res) {
    //console.log('调用了loginAddLocation方法 by params:'+req.params);
//for(var i in req.params){ //console.log("请求内容params子项："+i+"<>")};
//for(var i in req.body){ //console.log("请求内容body子项："+i+"<>\n")};
    login.addNewLocation(req.body.loginid,req.body.curlocation,function(err, obj){
        if(err){
            res.send(err);
        }
        else {
            res.send(err);
        }
    });
};

//通过身份证添加用户
var loginAddByIDCard= function(req, res) {
    //console.log('调用了loginAddByIDCard方法 by params:'+req.params);
//for(var i in req.params){ //console.log("请求内容params子项："+i+"<>")};
//for(var i in req.body){ //console.log("请求内容body子项："+i+"<>\n")};

    var json=req.body;
    //console.log('用户findByMobile UUid :'+json.mobileUUid);
    login.findByMobileUUid(json.mobileUUid,function(err, obj){
        //根据uuid查询用户
        //如果出错
        if (err) {

            //console.log('用户findByMobileUUid err:'+err);
        }
        //如果没有错
        else {
            //如果查出这个UUID已有用户
            if (obj) {
                //console.log('用户findByMobileUUid obj:'+obj.name);
            }
            //如果没有用户就开始存
            else {
                //console.log('用户idNum:'+json.idNum);
                //如果身份证号不为空，这个后面还得加验证
                if (json.idNum) {
                    login.save(json, function(err,savedobj){
                        if(err) {
                            //console.log('用户save err:'+err);
                            res.send({'success':false,'err':err});
                        } else {

                            //console.log('用户已注册成功:'+json.idNum);
                            res.send({'success':true,"_id":savedobj._id});
                        }
                    });/**/
                }

            }
        }
    });

};



/**
 * 根据手机的uuid自动获取人员信息，也就是免登录
 * @param {json} req - {mobileUUid:"手机的uuid"}
 * @param {json} res - 成功就发回用户的json{
    "_id" : ObjectId("58bff0836253fd4008b3d41b"),
    "name" : "谢进成",
    "sex" : "男",
    "nation" : "汉",
    "birthday" : "1992-12-05",
    "residence" : "云南省红河哈尼族彝族自治州泸西县年街铺镇阿茨龙村大路上45号",
    "idNum" : "53252719921205171X",
    "mobileUUid" : "123456789",
    "create_date" : ISODate("2017-03-08T11:52:35.361Z"),
    "__v" : 26818,
    "departments" : [
        {
            "role" : "worker",
            "department" : ObjectId("58c3a5e9a63cf24c16a50b8c"),
            "_id" : ObjectId("58c1d4f0f67649d0051efbd8")
        }
    ],
    "role" : "worker",
    "status" : 9
}，失败发回null
 */
var getloginByUUId = function(req, res) {
    //console.log('调用了getloginByUUId方法 by params');
//for(var i in req.body){ //console.log("请求内容body子项："+i+"<>\n")};
    if (req.body.mobileUUid) {

        //console.log('req.body.mobileUUid:'+req.body.mobileUUid);
        login.findByMobileUUid(req.body.mobileUUid,function(err, obj){
            if(err) {
                //console.log('rgetloginByUUId查询出差');
                res.send({'success':false,'err':err});
            } else if (obj) {

                //console.log('req.body.mobileUUid查询用户成功:'+obj.name);
                res.send(obj);
            }else {
                res.send(null);
            }});
    }else {
        res.send(null);
    }};

// 根据用户id获取部门、人员信息
var getAllbyID = function(req, res) {
    // // //console.log('getAllbyID by params');
    //for(var i in req.body){ //console.log("getAllbyID请求内容body子项："+i+"<>\n")};
    if (req.body._id) {

        // //console.log('req.body._id:'+req.body._id);
        login.getAllByUserid(req.body._id,function( obj){
            if(obj) {
                // //console.log('getAllbyID查询出差'+obj[0]);
                for(var ddd in obj[0]){
                    // //console.info('当前用户所有部门：'+ddd+'<>'+obj[0]);
                }
                res.send({'success':false,'err':obj});
            } else{

                // //console.log('getAllbyID查询用户可以看到的所有部门成功:'+obj.name);
                res.send(obj);
            }});
    }else {
        res.send(null);
    }

};


// 根据用户id获取相关部门
var getAllInvolvedLoginsByUserid = function(req, res) {
    // // //console.log('getAllbyID by params');
    //for(var i in req.body){ //console.log("ggetAllInvolvedLoginsByUserid请求内容body子项："+i+"<>\n")};
    if (req.body._id) {

        // //console.log('req.body._id:'+req.body._id);
        login.getAllInvolvedLoginsByUserid(req.body._id,function( obj){
            if(obj) {

                // //console.log('getAllInvolvedLoginsByUserid查询用户可以看到的所有部门成功:'+obj);

                res.send(obj);
            } else{

                // //console.log('getAllInvolvedLoginsByUserid查询用户可以看到的所有部门失败或部门为空:'+obj);
                res.send(null);
            }});
    }else {
        res.send(null);
    }

};

// 根据用户id获取相关部门
var getAllInvolvedLoginsByUserid = function(req, res) {
    // // //console.log('getAllbyID by params');
    //for(var i in req.body){ //console.log("getAllInvolvedLoginsByUserid 请求内容body子项："+i+"<>\n")};
    if (req.body._id) {

        // //console.log('req.body._id:'+req.body._id);
        login.getAllInvolvedLoginsByUserid(req.body._id,function( err,obj){
            if(!err) {

                // //console.log('getAllInvolvedLoginsByUserid 查询用户可以看到的所有部门成功:'+obj);

                res.send(obj);
            } else{

                // //console.log('getAllInvolvedLoginsByUserid 查询用户可以看到的所有部门失败或部门为空:'+err);
                res.send(null);
            }});
    }else {
        res.send(null);
    }
};

// 根据部门获取人员和下属部门
var getAllpersonsByDepartIdOneStep = function(req, res) {
    // //console.log('getAllpersonsByDepartIdOneStep by params');
    //for(var i in req.body){ //console.log("getAllpersonsByDepartIdOneStep 请求内容body子项："+i+"<>\n")};
    if (req.body._id) {

        // //console.log('req.body._id:'+req.body._id);
        login.getAllpersonsByDepartIdOneStep(req.body._id,function(err, obj){
            if(!err) {
                // //console.log('getAllpersonsByDepartIdOneStep 查询所有下级:'+obj);

                res.send(obj);
            } else{

                // //console.log('getAllpersonsByDepartIdOneStep 查询所有下级失败或部门为空:'+err);
                res.send(null);
            }});
    }else {
        res.send(null);
    }

};
// 根据部门获取人员和下属部门
var getAllchildrenLogins = function(req, res) {
    // //console.log('call getAllchildrenLogins');
    //for(var i in req.body){ //console.log("getAllchildrenLogins 请求内容body子项："+i+"<>\n")};
    var parentId=null;
    if (req.body._id) { parentId= req.body._id;  }

    // //console.log('parentId:'+parentId);
    login.getAllchildrenLogins(parentId,function( err,obj){
        if(!err) {
            // //console.log('getAllchildrenLogins 查询所有'+parentId+'下级:'+obj.Logins[0]);
            res.send(obj);
        } else{
            // //console.log('getAllchildrenLogins 查询所有下级失败或部门为空:'+err);
            res.send(null);
        }});
};

// 根据部门获取人员和下属部门
var getAllLogin = function(req, res) {
    // //console.log('call getAllLogin');

    login.getAllLogin(function( err,obj){
        if(!err) {
            // //console.log('getAllLogin 查询所有部门数量和首单位名称:'+obj.length+'<>'+obj[0].name);
            res.send(obj);
        } else{
            // //console.log('getAllLogin 查询所有下级失败或部门为空:'+err);
            res.send(null);
        }});
};

// loginrouter.get('/add',loginAdd);//增加
// loginrouter.post('/add',dologinAdd);//提交
// loginrouter.post('/edit',dologinEdit);//提交
// loginrouter.options('/add',dologinAdd);//提交
// loginrouter.get('/:mobile',loginJSON);//编辑查询
// loginrouter.post('/addlocation',loginAddLocation);//提交
// loginrouter.post('/registerByIdcard',loginAddByIDCard);//提交

loginrouter.post('/LoginByNameAndPwd',loginByNameAndPwd);//提交

loginrouter.post('/LoginBy2DCode',loginBy2DCode);//提交

loginrouter.post('/checkLoginByUUID',checkLoginByUUID);//提交



loginrouter.post('/getAllLogins',loginAllJSON);//提交
loginrouter.post('/loginInitialize',loginInitialize);//提交
loginrouter.post('/getAllbyID',getAllbyID);//提交
// loginrouter.post('/getAllchildrenLoginsByDobj',getAllchildrenLoginsByDobj);//提交
//根据用户id获取其所在的全部部门
loginrouter.post('/getAllInvolvedLoginsByUserid',getAllInvolvedLoginsByUserid);//提交
//根据部门id得到所有人员（不递归下级部门和下级部门的人员）
loginrouter.post('/getAllpersonsByDepartIdOneStep',getAllpersonsByDepartIdOneStep);//提交

module.exports = loginrouter;