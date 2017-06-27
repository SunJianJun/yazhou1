var express = require('express');
var departmentrouter = express.Router();

//获取数据模型
var department = require('../dbmodels/departmentDAO.js');
	 //console.log('department数据模型是否存在,from departmentrouter：'+department);

var departmentAdd = function(req, res) {
if(req.params.name){//update
return res.render('department', {
title:req.params.name+'|电影|管理|moive.me',
label:'编辑电影:'+req.params.name,
department:req.params.name
});
} else {
return res.render('department',{
title:'新增加|电影|管理|moive.me',
label:'新增加电影',
department:false
});
}
};


//添加一个部门
var dodepartmentAdd = function(req, res) {
	//解析客户端发回的请求
 //console.log("请求内容："+req+'<>department name in body:'+req.body.name+'<>method:'+req.method);

//req.body.data=departmentTestData;req.body应该就是部门的json
//for(var i in req.body){ //console.log("请求内容子项："+i+"<>")};

var json = req.body;
//添加部门是要判断它有没有parent,这个需要在客户端设置
 //console.log('json.parentID>'+json.parentID);
var cback=function (err,obj) {

};
var parentDp;
if(json.parentID){
    parentDp=department.getParent(json.parentID,cback);
} else {//insert
	
 //console.log('调用了dodepartmentAdd方法');

department.save(json, function(err){
if(err) {
res.send({'部门保存出错err':err});
} else {
  var newobid=  department.get("_id");
    // //console.log('新添加部门的id：'+newobid);
    parentDp.add(department);
    parentDp.save();
res.send({'部门保存success':true});
}
});/**/
}
};

//编辑信息
var dodepartmentEdit = function(req, res) {
	
 //console.log("请求内容："+req+'<>department name in body:'+req.body.name+'<>method:'+req.method);

//req.body.data=departmentTestData;req.body应该就是部门的json
//for(var i in req.body){ //console.log("请求内容子项："+i+"<>")};

var json = req.body;
//var json =departmentTestData;
 //console.log('json._id>'+json._id);
if(json._id){//update	
 //console.log('调用了dodepartmentEdit方法');
department.updateById(json, function(err){
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
var departmentInitialize = function(req, res) {
    // //console.log('调用了department初始化方法 by params');

    department.refreshDatabase(function(err, obj){
        res.send(obj);
    });
};

//得到全部的部门
var departmentAllJSON = function(req, res) {
    // //console.log('调用了departmentJSON方法 by params');
   ////for(var i in req.params){ console.log("请求内容params子项："+i+"<>\n")};
    department.getAllDepartment(function(err, obj){
        res.send(obj);
    });
};

//得到全部在状态的部门以及下属人员
var departmentAllWorkingJSON = function(req, res) {
    // //console.log('调用了departmentAllWorkingJSON方法 by params');
   ////for(var i in req.params){ console.log("请求内容params子项："+i+"<>\n")};
    department.findByMobile(req.params.mobile,function(err, obj){
        res.send(obj);
    });
};

//根据手机号发回部门员信息
var departmentJSON = function(req, res) {
 //console.log('调用了departmentJSON方法 by params');
//for(var i in req.params){ //console.log("请求内容params子项："+i+"<>\n")};
department.findByMobile(req.params.mobile,function(err, obj){
res.send(obj);
});
};

//添加部门员位置
var departmentAddLocation = function(req, res) {
 //console.log('调用了departmentAddLocation方法 by params:'+req.params);
//for(var i in req.params){ //console.log("请求内容params子项："+i+"<>")};
//for(var i in req.body){ //console.log("请求内容body子项："+i+"<>\n")};
department.addNewLocation(req.body.departmentid,req.body.curlocation,function(err, obj){
	if(err){
		res.send(err);
		}
	else {		
		res.send(err);
	}
});
};

//通过身份证添加用户
var departmentAddByIDCard= function(req, res) {
 //console.log('调用了departmentAddByIDCard方法 by params:'+req.params);
//for(var i in req.params){ //console.log("请求内容params子项："+i+"<>")};
//for(var i in req.body){ //console.log("请求内容body子项："+i+"<>\n")};

var json=req.body;
				 //console.log('用户findByMobile UUid :'+json.mobileUUid);
department.findByMobileUUid(json.mobileUUid,function(err, obj){
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
				department.save(json, function(err,savedobj){
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


//根据手机的uuid自动获取部门
var getdepartmentByUUId = function(req, res) {
 //console.log('调用了getdepartmentByUUId方法 by params');
//for(var i in req.body){ //console.log("请求内容body子项："+i+"<>\n")};
if (req.body.mobileUUid) {
	
 //console.log('req.body.mobileUUid:'+req.body.mobileUUid);
	department.findByMobileUUid(req.body.mobileUUid,function(err, obj){
		if(err) {
				 //console.log('rgetdepartmentByUUId查询出差');
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
            department.getAllByUserid(req.body._id,function( obj){
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
var getAllInvolvedDepartmentsByUserid = function(req, res) {
    // // //console.log('getAllbyID by params');
    //for(var i in req.body){ //console.log("ggetAllInvolvedDepartmentsByUserid请求内容body子项："+i+"<>\n")};
    if (req.body._id) {

        // //console.log('req.body._id:'+req.body._id);
        department.getAllInvolvedDepartmentsByUserid(req.body._id,function( obj){
            if(obj) {

                // //console.log('getAllInvolvedDepartmentsByUserid查询用户可以看到的所有部门成功:'+obj);

                res.send(obj);
            } else{

                // //console.log('getAllInvolvedDepartmentsByUserid查询用户可以看到的所有部门失败或部门为空:'+obj);
                res.send(null);
            }});
    }else {
        res.send(null);
    }

};

// 根据用户id获取相关部门
var getAllInvolvedDepartmentsByUserid = function(req, res) {
    // // //console.log('getAllbyID by params');
    //for(var i in req.body){ //console.log("getAllInvolvedDepartmentsByUserid 请求内容body子项："+i+"<>\n")};
    if (req.body._id) {

        // //console.log('req.body._id:'+req.body._id);
        department.getAllInvolvedDepartmentsByUserid(req.body._id,function( err,obj){
            if(!err) {

                // //console.log('getAllInvolvedDepartmentsByUserid 查询用户可以看到的所有部门成功:'+obj);

                res.send(obj);
            } else{

                // //console.log('getAllInvolvedDepartmentsByUserid 查询用户可以看到的所有部门失败或部门为空:'+err);
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
        department.getAllpersonsByDepartIdOneStep(req.body._id,function(err, obj){
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
var getAllchildrenDepartments = function(req, res) {
     // //console.log('call getAllchildrenDepartments');
    //for(var i in req.body){ //console.log("getAllchildrenDepartments 请求内容body子项："+i+"<>\n")};
    var parentId=null;
    if (req.body._id) { parentId= req.body._id;  }

    // //console.log('parentId:'+parentId);
    department.getAllchildrenDepartments(parentId,function( err,obj){
        if(!err) {
            // //console.log('getAllchildrenDepartments 查询所有'+parentId+'下级:'+obj.Departments[0]);
            res.send(obj);
        } else{
            // //console.log('getAllchildrenDepartments 查询所有下级失败或部门为空:'+err);
            res.send(null);
        }});
};

// 根据部门获取人员和下属部门
var getAllDepartment = function(req, res) {
    // //console.log('call getAllDepartment');

    department.getAllDepartment(function( err,obj){
        if(!err) {
            // //console.log('getAllDepartment 查询所有部门数量和首单位名称:'+obj.length+'<>'+obj[0].name);
            res.send(obj);
        } else{
            // //console.log('getAllDepartment 查询所有下级失败或部门为空:'+err);
            res.send(null);
        }});
};

// departmentrouter.get('/add',departmentAdd);//增加
// departmentrouter.post('/add',dodepartmentAdd);//提交
// departmentrouter.post('/edit',dodepartmentEdit);//提交
// departmentrouter.options('/add',dodepartmentAdd);//提交
// departmentrouter.get('/:mobile',departmentJSON);//编辑查询
// departmentrouter.post('/addlocation',departmentAddLocation);//提交
// departmentrouter.post('/registerByIdcard',departmentAddByIDCard);//提交
departmentrouter.post('/getAllDepartment',getAllDepartment);//提交
departmentrouter.post('/getAllchildrenDepartments',getAllchildrenDepartments);//提交

departmentrouter.post('/addDepartment',dodepartmentAdd);//提交
departmentrouter.post('/editDepartment',dodepartmentEdit);//提交
departmentrouter.post('/getAllDepartments',departmentAllJSON);//提交
departmentrouter.post('/departmentInitialize',departmentInitialize);//提交
departmentrouter.post('/getAllbyID',getAllbyID);//提交
departmentrouter.post('/getAllInvolvedDepartmentsByUserid',getAllInvolvedDepartmentsByUserid);//提交
// departmentrouter.post('/getAllchildrenDepartmentsByDobj',getAllchildrenDepartmentsByDobj);//提交
departmentrouter.post('/getAllpersonsByDepartIdOneStep',getAllpersonsByDepartIdOneStep);//提交

module.exports = departmentrouter;