var express = require('express');
var gridarearouter = express.Router();

//获取数据模型
var gridarea = require('../dbmodels/gridareaDAO.js');
//console.log('gridarea数据模型是否存在：'+gridarea);

var gridareaAdd = function (req, res) {
    if (req.params.name) {//update
        return res.render('gridarea', {
            title: req.params.name + '|电影|管理|moive.me',
            label: '编辑电影:' + req.params.name,
            gridarea: req.params.name
        });
    } else {
        return res.render('gridarea', {
            title: '新增加|电影|管理|moive.me',
            label: '新增加电影',
            gridarea: false
        });
    }
};


//添加一个人
var dogridareaAdd = function (req, res) {

    //console.log("请求内容："+req+'<>gridarea name in body:'+req.body.name+'<>method:'+req.method);

//req.body.data=gridareaTestData;
//for(var i in req.body){ //console.log("请求内容子项："+i+"<>")};

    var json = req.body;
//var json =gridareaTestData;
    //console.log('json._id>'+json._id);
    if (json._id) {
    } else {//insert

        //console.log('调用了dogridareaAdd方法');

        gridarea.save(json, function (err) {
            if (err) {
                res.send({'success': false, 'err': err});
            } else {
                res.send({'success': true});
            }
        });
        /**/
    }
};

//保存人员的编辑信息
var dogridareaEdit = function (req, res) {

    //console.log("请求内容："+req+'<>gridarea name in body:'+req.body.name+'<>method:'+req.method);

//req.body.data=gridareaTestData;
//for(var i in req.body){ //console.log("请求内容子项："+i+"<>")};

    var json = req.body;
//var json =gridareaTestData;
    //console.log('json._id>'+json._id);
    if (json._id) {//update
        //console.log('调用了dogridareaEdit方法');
        gridarea.updateById(json, function (err) {
            if (err) {
                res.send({'success': false, 'err': err});
            } else {
                res.send({'success': true});
            }
        });
        /**/

    } else {//insert

    }
};

//根据手机号发回人员信息
var gridareaJSON = function (req, res) {
    //console.log('调用了gridareaJSON方法 by params');
//for(var i in req.params){ //console.log("请求内容params子项："+i+"<>\n")};
    gridarea.findByMobile(req.params.mobile, function (err, obj) {
        res.send(obj);
    });
}

//添加人员位置
var getAllValidGridarea = function (req, res) {
    //console.log('调用了 getAllValidGridarea 方法 by params:'+req.params);
    gridarea.getAllValidGridarea(function (err, obj) {
        if (err) {
            res.send(null);
        }
        else {
            res.send(obj);
        }
    });
}

//通过身份证添加用户
var gridareaAddByIDCard = function (req, res) {
    //console.log('调用了gridareaAddByIDCard方法 by params:'+req.params);
//for(var i in req.params){ //console.log("请求内容params子项："+i+"<>")};
//for(var i in req.body){ //console.log("请求内容body子项："+i+"<>\n")};

    var json = req.body;
    //console.log('用户findByMobile UUid :'+json.mobileUUid);
    gridarea.findByMobileUUid(json.mobileUUid, function (err, obj) {
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
                    gridarea.save(json, function (err, savedobj) {
                        if (err) {
                            //console.log('用户save err:'+err);
                            res.send({'success': false, 'err': err});
                        } else {

                            //console.log('用户已注册成功:'+json.idNum);
                            res.send({'success': true, "_id": savedobj._id});
                        }
                    });
                    /**/
                }

            }
        }
    });

}


//根据手机的uuid自动获取用户
var getGridareaByUUId = function (req, res) {
    //console.log('调用了getGridareaByUUId方法 by params');
//for(var i in req.body){ //console.log("请求内容body子项："+i+"<>\n")};
    if (req.body.mobileUUid) {

        //console.log('req.body.mobileUUid:'+req.body.mobileUUid);
        gridarea.findByMobileUUid(req.body.mobileUUid, function (err, obj) {
            if (err) {
                //console.log('rgetGridareaByUUId查询出差');
                res.send({'success': false, 'err': err});
            } else if (obj) {
                //console.log('req.body.mobileUUid查询用户成功:'+obj.name);
                //console.log('\nreq.body.mobileUUid查询用户成功,用户的照片:'+obj.images.coverSmall);
                res.send(obj);
            } else {
                res.send(null);
            }
        });
    } else {
        res.send(null);
    }

}


//根据用户名密码获取用户
//三种角色，supper，departmentManager，worker
var getGridareaByPcLogin = function (req, res) {
    // //console.log('调用了getGridareaByPcLogin方法 by params');
    //for(var i in req.data){ //console.log("请求内容body子项："+i+"<>\n")};
    if (req.body.name && req.body.pwd) {
        // //console.log('getGridareaByPcLogin:'+req.body.name +'<>'+ req.body.pwd);
        gridarea.findByNameAndPwd(req.body.name, req.body.pwd, function (err, obj) {
            if (err) {
                // //console.log('findByNameAndPwd查询出差');
                res.send({'success': false, 'err': err});
            } else if (obj) {

                // //console.log('pc端findByNameAndPwd查询用户成功:'+obj.name);
                // // //console.log('\nreq.body.mobileUUid查询用户成功,用户的照片:'+obj.images.coverSmall);
                res.send(obj);
            } else {
                res.send(null);
            }
        });
    } else {
        res.send(null);
    }

}

// 初始化数据库里的用户
var initializeGridareas = function (req, res) {
    // //console.log('调用了initializeGridareas方法 by params');
    gridarea.initializeGridareas(function (err, obj) {
        // //console.log('route调用initializeGridareas errs'+err);
        res.send(obj);
    });
}

gridarearouter.get('/add', gridareaAdd);//增加
gridarearouter.post('/add', dogridareaAdd);//提交
gridarearouter.post('/edit', dogridareaEdit);//提交 编辑
gridarearouter.options('/add', dogridareaAdd);//提交
gridarearouter.get('/:mobile', gridareaJSON);//编辑查询
gridarearouter.post('/getAllValidGridarea', getAllValidGridarea);//提交
gridarearouter.post('/registerByIdcard', gridareaAddByIDCard);//提交
gridarearouter.post('/getGridareaByUUId', getGridareaByUUId);//提交
gridarearouter.post('/pcLogin', getGridareaByPcLogin);//提交
gridarearouter.post('/initializeGridareas', initializeGridareas);//提交

module.exports = gridarearouter;