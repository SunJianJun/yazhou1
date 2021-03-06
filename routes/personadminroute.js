/**
 * @module 部门人员管理模块 url: /personadminroute
 */
var express = require('express');
var personrouter = express.Router();

//获取数据模型
var personDAO = require('../dbmodels/personDAO.js');
var departmentDAO = require('../dbmodels/departmentDao.js');
var persontitleDAO = require('../dbmodels/persontitleDao.js');


/**
 * 人员录入，管理员录入人员
 * @param {json} req - 客户端提交json，例如{"name" : "admin","sex":'男',"nation":'汉',"birthday":'1999-11-1',"residence":'住址',"idNum":'身份证号',"departments":[{"department":'部门id',role:"权限"}],"title":"职务ID"},"pwd" : "123456"};
 * @param {json} res - 返回，录入成功返回提示成功，失败返回空字符串
 */
var sendpersonimport = function (req, res) {
    var peo = req.body;
    name = peo.name;
    sex = peo.sex,
        nation = peo.nation,
        birthday = peo.birthday,
        idNum = peo.idNum,
        departments = peo.departments;
    if (!name) {
        res.send({error: '名字不能为空'})
    }
    if (!idNum) {
        res.send({error: '身份证不能为空'})
    } else {
        if (idNum.length != 18) {
            res.send({error: '身份证输入错误'})
        }
    }
    if (!departments) {
        //res.send('部门不能为空')
    } else {
        if (!departments.role) {
            res.rend({error: '人员权限不能为空'})
        }
    }
    peo.create_date = new Date();
    personDAO.save(peo, function (err, obj) {
        if (err) {
            res.rend({error: err})
        } else {
            res.rend(obj)
        }
    })
};
//sendpersonimport({
//    "name" : "aaa",
//    "sex":'男',
//    "nation":'汉',
//    "birthday":'1999-11-1',
//    "residence":'住址',
//    "idNum":'123456123456',
//    "departments":[{"type":'1231546413212',role:"权限"}],
//    "title":"职务ID"},
//    "pwd" : "123456"})

/**
 *使用身份信息注册一个人员
 * @param {json} req 传入人员json数据，例如{"name" : "admin","sex":'男',"nation":'汉',"birthday":'1999-11-1',"residence":'住址',"idNum":'身份证号',"departments":[{"department":'部门id',role:"权限"}],"title":"职务ID"},"pwd" : "123456",IMid:'极光ID'};
 * @param {json} res 返回，注册成功返回提示成功，失败返回{error: '注册出错'}
 */
var sendpersonreGister = function (req, res) {
    var json = req.body;
    //json={"name" : "admin","sex":'男',"nation":'汉',"birthday":'1999-11-1',"residence":'住址',"idNum":'身份证号',"departments":[{"department":'部门id',role:"权限"}],"title":"职务ID"},"pwd" : "123456"};
    //console.log(json);
    if (!json) {
        res.send({error: '输入信息为空'});
    } else {
        console.log('调用了dopersonAdd方法');
        json.status = 1;
        var dep = json.departments[0];
        personDAO.save(json, function (err, obj) {
            if (err) {
                res.send({error: '注册出错'});
            } else {
                personDAO.addPersonTodepartent(obj._id, dep.department, function (err, obj) {
                    if (err) {
                        res.send({error: err})
                    } else {
                        res.send({success: obj});
                    }
                })
            }
        });
    }
};
/**
 * 用身份证信息验证一个人员是否已经导入,参数必须有身份证
 * @param {json} req - 客户端提交json 例如{"name":"admin","idNum":'身份证号','mobileUUid':'手机uuid'};
 * @param {json} res - 返回已有的人员信息{"name" : "admin","sex":'男',"nation":'汉',"birthday":'1999-11-1',"residence":'住址',"idNum":'身份证号',"departments":[{"department":'部门id',role:"权限"}],"title":"职务ID"},"pwd" : "123456",IMid:'极光ID'};
 */
var sendispersonAdd = function (req, res) {
    var json = req.body;
    idNum = json.idNum,
        name = json.name,
        sex = json.sex;
    if (!idNum) {
        //res.send('无效身份证号')
        if (idNum.length != 18) {
            res.send({error: '身份证有误'});
        } else {
            res.send({error: '无效身份证号'});
        }
    } else {
        personDAO.provingperson(idNum, name, sex, function (err, obj) {
            if (err) {
                res.send({error: err});
            } else {
                res.send({success: obj})
            }
        })
    }
};
/**
 * 用身份证信息识别
 * @param {json} req - 客户端提交json 例如{"name":"admin","idNum":'身份证号','mobileUUid':'手机uuid'};
 * @param {json} res - 返回人员信息是否存在，，没有此人信息1000，
 待审核闲散人员2000，
 '已存在，没有绑定手机'3000，
 '已注册，手机uuid已更改'4000，
 '已注册正常用户' 5000
 <br/>
 返回数据 {success:4000,obj:'人员信息'} 3000 4000 5000 都返回人员信息对象
 */
var sendcheckperson = function (req, res) {
    var json = req.body,
        idNum = json.idNum,
        name = json.name,
        phoneuuid = json.mobileUUid;
    if (idNum && name) {
        personDAO.sendcheckperson(idNum, name, phoneuuid, function (err, obj,data) {
            if (err) {
                res.send({error: err});
            } else {
                res.send({success: obj,obj:data})
            }
        })
    } else {
        res.send({error: '无效参数'});
    }
};
/**
 * 服务器存在此人数据，并且密码验证成功，修改此人的手机id
 * @param {json} req - 客户端提交json {_id:'人员id',newmobile:'新的手机id'}
 * @param {json} res - 返回提示 {success:'chenggon'}
 */
var sendupdatemobileuuid = function (req, res) {
    var id = req.body._id;
    var mobile = req.body.newmobile;
    if (id && mobile) {
        personDAO.sendupdatemobileuuid(id, mobile, function (err, obj) {
            if (obj) {
                res.send({success: '更改成功'})
            } else {
                res.send({error: '更改失败'})
            }
        })
    } else {
        res.send({error: '提交参数错误'})
    }
}
/**
 * 修改手机uuid和密码
 * 服务器存在此人数据，没有设置密码
 * @param {json} req - 客户端提交json {_id:'人员id',newmobile:'新的手机id',pwd:'设置的密码'}
 * @param {json} res - 返回提示 {success:'chenggon'}
 */
var sendpwdandmobileuuid = function (req, res) {
    var id = req.body._id;
    var mobile = req.body.newmobile;
    var pwd = req.body.pwd;
    if (id && mobile && pwd) {
        personDAO.sendpwdandmobileuuid(id, pwd, mobile, function (err, obj) {
            if (obj) {
                res.send({success: '更改成功'})
            } else {
                res.send({error: '更改失败'})
            }
        })
    } else {
        res.send({error: '提交参数错误'})
    }
}
/**
 * 用身份证信息注册一个待审核人员
 * @param {json} req - 客户端提交json 例如{"name" : "admin","sex":'男',"nation":'汉',"birthday":'1999-11-1',"residence":'住址',"idNum":'身份证号',"departments":[{"department":'部门id',role:"权限"}],"title":"职务ID"},"pwd" : "123456"};
 * @param {json} res - 返回，注册成功返回提示<br/>成功{_id:'12345',"name" : "admin","sex":'男',"nation":'汉',"birthday":'1999-11-1',"residence":'住址',"idNum":'身份证号',"departments":[{"department":'部门id',role:"权限"}],"title":"职务ID"},"pwd" : "123456"};<br/>失败返回{error:'添加失败'}
 */
var sendWaitExamineperson = function (req, res) {
    //status 表示待审核人员
    var json = req.body;
    //json={"name" : "admin","sex":'男',"nation":'汉',"birthday":'1999-11-1',"residence":'住址',"idNum":'身份证号',"departments":[{"department":'部门id',role:"权限"}],"title":"职务ID"},"pwd" : "123456"};
    if (!json) {
        res.send({error: '提交为空'})
    } else {
        json.status = 4;
        personDAO.save(json, function (err, obj) {
            if (err) {
                res.send({error: '添加失败'});
            } else {
                res.send({success: obj});
            }
        });
    }
};

/**
 * 修改人员状态
 * @param {json} req - 客户端提交json 例如{_id:人员id,status:1}
 * @param {json} res - 返回提示成功
 */
var updatepersonstate = function (req, res) {
    var json = req.body,
    //json=req;
        person = json._id,
        status = json.status;
    if (!person && !status) {
        res.send({error: '信息不全，重新提交'})
    } else {
        personDAO.changePersonStatus(person, status, function (err, obj) {
            if (err) {
                //res.send({error:'提交失败}
                res.send({error: null});
            } else {
                //res.send({success:obj}
                res.send(obj)
            }
        })
    }
};
//updatepersonstate({_id:"58e0c199e978587014e67a50",status:9})
/**
 * 修改人员信息 ,传入修改的人员ID，和选择需要修改的内容
 * @param {json} req - 传入需要修改的人员ID ，客户端提交json 例如{_id:人员id,name: "admin","sex":'男',"nation":'汉',"birthday":'1999-11-1',"residence":'住址',"idNum":'身份证号',"title":"职务ID"},"pwd" : "123456"}
 * @param {json} res - {success:'修改成功'}
 */
var updatepersoninfo = function (req, res) {
    var json = req.body,
        uid = json._id;
    delete json._id;//去除人员ID，再把获取到的人员id删掉
    if (!uid) {
        res.send({error: '人员ID不能为空'})
    } else {
        personDAO.updatepersoninfo(uid, json, function (err, obj) {
            if (err) {
                res.send({error: '修改失败，可能是参数错误'});
            } else {
                res.send({success: '修改成功'})
            }
        })
    }
}
//updatepersoninfo({'_id':'59562e202c2b5d1814fe7b67',birthday:'1966-06-6',sex:'怒'})
/**
 * 获取部门的所有人员
 * @param {json} req - 客户端提交json 例如{department:"部门ID"}
 * @param {json} res - 返回json [{_id:'人员ID',"name" : "admin","sex":'男',"nation":'汉',"birthday":'1999-11-1',"residence":'住址',"idNum":'身份证号',images:'',"departments":[{"department":'部门id',role:"权限"}],"title":"职务ID"}}];
 */
var getdepartmentTopeople = function (req, res) {
    var docID = req.body.department;
    //var docID=req;
    departmentDAO.getPersonsByDepartmentID(docID, function (err, obj) {
        if (err) {
            res.send({error: null})
        } else {
            res.send(obj)
        }
    })
};
//getdepartmentTopeople("58c3a5e9a63cf24c16a50b8c")
/**
 * 根据人员状态，过滤人员,获取某一状态的人员
 * @param {json} req - 客户端提交json 例如{status:1}
 * @param {json} res - 返回json：[{_id:'人员ID',"name" : "admin","sex":'男',"nation":'汉',"birthday":'1999-11-1',"residence":'住址',"idNum":'身份证号',images:'',"departments":[{"department":'部门id',role:"权限"}],"title":"职务ID"}}];
 */
var getpersonstate = function (req, res) {
    var status = req.body.status;
    if (!status) {
        res.send({error: '状态提交有误，请重新发送'});
        return;
    }
    personDAO.getpersonstate(status, function (err, obj) {
        if (err) {
            res.send({error: err})
        } else {
            res.send(obj)
        }
    })
};
//getpersonstate({status:9})
/**
 * 查看某一状态的部门，
 * 只查看部门
 * @param {json} req - 客户端提交json 例如{status:1}
 * @param {json} res - 返回json：[{_id:"123456",name:"部门名称",status:1,info:'部门信息'}]
 */
var getdepartmentsstatus = function (req, res) {
    var status = req.body.status;
    if (!status) {
        res.send({error: '状态提交有误，请重新发送'});
        return;
    }
    departmentDAO.getpersonstate(status, function (err, obj) {
        if (err) {
            res.send({error: '获取部门出错'})
        } else {
            res.send(obj)
        }
    })
};
/**
 * 获取得到所有有效的部门 ,不包含人员ID
 * @param {} req - 客户端发起请求，无需传参
 * @param {json} res - 返回json：[{_id:"123456",name:"部门名称",status:1,info:'部门信息'}]
 */
var getAllDepartments = function (req, res) {
    departmentDAO.getAllDepartments(function (err, obj) {
        if (err) {
            //console.log(err)
            res.send({error: '获取失败！'})
        } else {
            res.send({success: obj})
        }
    })
};
/**
 * 得到所有的部门包含人员ID
 * @param {} req - 客户端发起请求，无需传参
 * @param {json} res - 返回json：[{_id:"123456",name:"部门名称",status:1,info:'部门信息',persons:[[{_id:'',name:'';}]]
 */
var getAllDepartment = function (req, res) {
    departmentDAO.getAllDepartment(function (err, obj) {
        if (err) {
            res.send({error: '获取失败！'})
        } else {
            res.send({success: obj})
        }
    })
};
/**
 * 新建一个部门
 * @param {json} req - 传入名称和上级部门id,客户端提交json 例如{name:'新建1',parentID:'上级部门id',info:'部门描述',infoLink:'www.baidu.com'}
 * @param {json} res - 返回json：例如{success: true}
 */
var sendnewdepartment = function (req, res) {
    var json = req.body,
        parent = json.parentID,
        name = json.name,
        info = json.info,
        infoLink = json.infoLink;
    var newinfo = {};
    newinfo.name = name;
    newinfo.info = info;
    infoLink ? newinfo.infoLink = infoLink : newinfo.infoLink = null;
//添加部门是要判断它有没有parent,这个需要在客户端设置
    if (parent) {
        parentDp = departmentDAO.getParent(parent, function (err, dobj) {//取到上级部门id和path
            if (err) {
                res.send({error: '获取上级部门失败！'})
            } else {
                var getpartid = dobj[0];
                newinfo.parent = getpartid._id,
                    newinfo.path = getpartid.path,
                    newinfo.status = 1;

                departmentDAO.save(newinfo, function (err, nobj) {
                    if (err) {
                        res.send({error: '添加部门失败！'})
                    } else {
                        //console.log(nobj)
                        if (getpartid.path) {
                            var newpath = getpartid.path + '#' + nobj._id;
                        } else {
                            var newpath = getpartid._id + '#' + nobj._id;
                        }
                        departmentDAO.addparentpath(nobj._id, newpath, function (err, obj) {
                            if (err) {
                                res.send({error: '部门添加上级失败！'})
                            } else {
                                res.send({success: obj})
                            }
                        })
                    }
                });

            }
        })
    } else {
        departmentDAO.save(json, function (err) {
            if (err) {
                res.send({error: '部门保存出错err'});
            } else {
                res.send({success: true});
            }
        });
    }
}
//sendnewdepartment({body: {name:'123',info:'ceshi'}})
/**
 * 部门改名
 * @param {json} req - 客户端提交部门ID和修改的名称 例如{_id:'12345',name:'mingceng'}
 * @param {json} res - 返回json：例如{success:'修改成功'}
 */
var updatedepartmentname = function (req, res) {
    var json = req.body;
    id = json._id, name = json.name;
    console.log(id, name)
    if (id || name) {
        departmentDAO.updatedepartmentname(id, name, function (err, obj) {
            if (err) {
                res.send({error: '修改失败'});
            } else {
                res.send({success: '修改成功'});
            }
        })
    } else {
        res.send({error: '提交的参数有误'});
    }
}
/**
 * 编辑部门信息，修改名称，描述，官方网站，部门内部的头衔
 * @param {json} req - 客户端提交json 例如{_id:'123456',name:'修改1',info:'修改部门的信息',infoLink:'www.baidu.com',status:1}
 * @param {json} res - 返回json：例如{{success:'修改成功'}}
 */
var updatedepartmentinfo = function (req, res) {
    var json = req.body;
    id = json._id;
    delete json._id;
    if (id) {
        console.log(id)
        departmentDAO.updatedepartmentinfo(id, json, function (err, obj) {
            if (err) {
                res.send({error: '修改失败'});
            } else {
                res.send({success: '修改成功'});
            }
        })
    } else {
        res.send({error: '提交的参数有误'});
    }
}
/**
 * 部门状态管理，修改部门状态
 * @param {json} req - 传入部门id，和要修改的状态，客户端提交json 例如{_id:'123456',status:1}
 * @param {json} res - 返回json：例如{success: '修改成功'}
 */
var updatedepartmentstatus = function (req, res) {
    var json = req.body;
    id = json._id, status = json.status;
    if (id && status) {
        departmentDAO.updatedepartmentinfo(id, status, function (err, obj) {
            if (err) {
                res.send({error: '修改失败'});
            } else {
                res.send({success: '修改成功'});
            }
        })
    } else {
        res.send({error: '提交的参数有误'});
    }
};
/**
 * 移动人员所在的部门
 * @param {json} req - 客户端传入数据 {cudepartment:'',person:[''],movdepartment:''}
 * @param {json} res - 返回提示
 */
var movedepartmentperson = function (req, res) {
    var curdep = req.body.cudepartment;//当前部门
    var persons = req.body.persons;//人员ID数组
    var movedep = req.body.movdepartment;//目标部门
    if (curdep && persons && movedep) {
        departmentDAO.getPersonsByID(curdep, function (cudeperr, curdepobj) {//获取一个部门的人员
            if (!cudeperr) {
                var newcurdep = [],//当前的部门
                    newmovedep = [];//目标部门添加的人员
                if (curdepobj && curdepobj.length) {
                    for (var i = 0; i < curdepobj.length; i++) {
                        var oncurdep = {person: curdepobj[i].person, role: curdepobj[i].role};
                        if (oncurdep.person) {
                            if (persons.indexOf(oncurdep.person.toString()) + 1) {
                                newmovedep.push(oncurdep)
                                console.log(oncurdep)
                            } else {
                                newcurdep.push(oncurdep);
                            }
                        }
                    }
                    if (newmovedep && newmovedep.length) {
                        departmentDAO.updatedepartmentperson(curdep, newcurdep, function (oerr, oobj) {
                            if (!oerr) {
                                personDAO.cleartitle(persons,function(cletiterr,cletitobj){
                                    if(!cletiterr){
                                        departmentDAO.adddepartmentperson(movedep, newmovedep, function (nerr, nobj) {
                                            if (!nerr) {
                                                res.send({success: nobj})
                                            } else {
                                                res.send({error: nerr})
                                            }
                                        })
                                    }
                                })
                            } else {
                                res.send({error: perr})
                            }
                        })
                    } else {
                        res.send({error: '人员无效'})
                    }
                } else {
                    res.send({error: '部门获取人员出错'})
                }
            } else {
                res.send({error: cudeperr})
            }
        })
    } else {
        res.send({error: '参数错误'})
    }
}
/**
 * 复制人员所在的部门
 * @param {json} req - 客户端传入数据 {cudepartment:'',person:[''],movdepartment:''}
 * @param {json} res - 返回提示
 */
var copydepartmentperson = function (req, res) {
    var curdep = req.body.cudepartment;//当前部门
    var persons = req.body.persons;//人员ID数组
    var movedep = req.body.movdepartment;//目标部门
    if (curdep && persons && movedep) {
        departmentDAO.getPersonsByID(curdep, function (cudeperr, curdepobj) {//获取一个部门的人员
            if (!cudeperr) {
                var newmovedep = [];//目标部门添加的人员
                if (curdepobj && curdepobj.length) {
                    for (var i = 0; i < curdepobj.length; i++) {
                        var oncurdep = {person: curdepobj[i].person, role: curdepobj[i].role};
                        if (oncurdep.person) {
                            if (persons.indexOf(oncurdep.person.toString()) + 1) {
                                newmovedep.push(oncurdep)
                            }
                        }
                    }
                    if (newmovedep && newmovedep.length) {
                        departmentDAO.adddepartmentperson(movedep, newmovedep, function (nerr, nobj) {
                            if (!nerr) {
                                res.send({success: nobj})
                            } else {
                                res.send({error: nerr})
                            }
                        })
                    } else {
                        res.send({error: '人员无效'})
                    }
                } else {
                    res.send({error: '部门获取人员出错'})
                }
            } else {
                res.send({error: cudeperr})
            }
        })
    } else {
        res.send({error: '参数错误'})
    }
}
/**
 * 根据职务id，获取职务名称
 * @param {json} req - 发起请求{title:'职务id'}
 * @param {json} res - 返回的数据
 */
var getpersontitle = function (req, res) {
    var json = req.body;
    id = json.title;
    if (id) {
        persontitleDAO.getpersontitle(id, function (err, obj) {
            if (err) {
                res.send({error: '获取失败'});
            } else {
                res.send({success: obj});
            }
        })
    } else {
        res.send({error: '提交的参数有误'});
    }
};
/**
 * 根据部门获取所有职务
 * @param {json} req - 客户端提交json 例如{departmentID:'123456'}
 * @param {json} res - 返回json：例如[ { name: '大队长', _id: 59520e5d7b6d7fa011adcc73 }]
 */
var getpersontitleTodepartment = function (req, res) {
    var depar = req.body.departmentID;
    if (!depar) {
        res.send({error: "部门id出错"})
    } else {
        persontitleDAO.getpersontitleTodepartment(depar, function (err, obj) {
            if (err) {
                //console.log(err)
                res.send({error: "部门获取职务出错"})
            } else {
                res.send({success: obj})
            }
        })
    }
}
/**
 * 在职务列表中添加一个职务,可以不传 parentTitle
 * @param {json} req - 传入职务名称，部门名称和上级职务ID。<br>客户端提交json 例如{name:'雇员',departmentID:'部门id'}
 * @param {json} res - 返回json：例如{_id:'123456',name:'雇员',derpartmentID:'部门id',parentTitle:'上级职务ID'}
 */
var sendtitle = function (req, res) {
    var json = req.body;
    if (json.name && json.departmentID) {
        persontitleDAO.sendpersontitle(json, function (err, obj) {
                if (err) {
                    res.send({error: '添加失败'})
                } else {
                    res.send({success: obj})
                }
            }
        )
    } else {
        res.send({error: '提交参数有误'})
    }
}
/**
 * 修改部门职务等级和上级职务，整个部门所有职务的等级和上级关联的部门全部修改
 * @param {json} req - 客户端上传数据[{"grade":1,"_id":"5952112dea76066818fd6dcf","name":"局长","parentTitle":null},{"grade":2,"_id":"5952112dea76066818fd6dd0","name":"副局长","parentTitle":"5952112dea76066818fd6dcf"},{"grade":3,"_id":"59520e5d7b6d7fa011adcc73","name":"大队长","parentTitle":"5952112dea76066818fd6dd0"},{"grade":4,"_id":"5952112dea76066818fd6dd2","name":"副大队长","parentTitle":"59520e5d7b6d7fa011adcc73"},{"grade":5,"_id":"5952112dea76066818fd6dd4","name":"中队长","parentTitle":"5952112dea76066818fd6dd2"},{"grade":6,"_id":"5952112dea76066818fd6dd3","name":"雇员","parentTitle":"5952112dea76066818fd6dd4"}]
 * @param {json} res - 服务器返回数据 {success:'修改成功'}
 */
var settitlesort = function (req, res) {
    var json = req.body;
    var issend = true;
    if (json) {
        try {
            for (var i = 0; i < json.length; i++) {
                persontitleDAO.updatetitleinfo(json[i]._id, json[i].parentTitle, json[i].grade, function (pererr, perobj) {
                        if (perobj) {
                            if (i == json.length) {
                                if (issend) {
                                    res.send({success: 'is ok!'})
                                    issend = false;
                                }
                            }
                        } else {
                            res.send({error: '修改错误'})
                            return;
                        }
                    }
                )
            }
        } catch (err) {
        }
    } else {
        res.send({error: '提交参数有误'})
    }
}
/*
 * 给职务添加一个上级
 * @param {json} req - 客户端提交json 例如{_id:'职务ID',parentTitle:'上级职务ID'}
 * @param {json} res - 返回成功{success:''}
 */
var sendpersonparent = function (req, res) {
    var id = req.body._id;
    var parent = req.body.parentTitle;
    if (id && parent) {
        persontitleDAO.sendpersonparent(id, parent, function (err, obj) {
            if (err) {
                res.send({error: '添加失败'})
            } else {
                res.send({success: obj})
            }
        })
    } else {
        res.send({error: '提交参数有误'})
    }
}

//getAllpersontitle()
/**
 * 根据职务筛选出人员
 * @param {json} req - 客户端提交json 例如{_id:'职务ID'}
 * @param {json} res - 返回json：例如[{ title: '5952112dea76066818fd6dd0',
    create_date: 2017-06-09T09:41:00.400Z,
    departments: [ [Object] ],
    status: 1,
    timeCard: [],
    __v: 0,
    birthday: '1983-02-28',
    age: 34,
    idNum: '460003198302283415',
    mobile: 13518037530,
    sex: '男',
    name: '吴兴学',
    _id: 593a6d2cf06286140edf82f1 }]
 */
var gettitleToperson = function (req, res) {
    var json = req.body;
    var id = json._id;
    personDAO.gettitleToperson(id, function (err, obj) {
        if (err) {
            res.send({error: '获取失败'})
        } else {
            res.send({success: obj})
        }
    })
}
//gettitleToperson({_id:'5952112dea76066818fd6dd0'})
/**
 * 获取当前人员的直接上级
 * @param {json} req - 客户端传入当前人员的title  {title:'123456'}
 * @param {json} res - 返回上级职务列表 []
 */
var getpersontitlelevel = function (req, res) {
    var json = req.body;
    var title = json.title;
    if (title) {
        persontitleDAO.getpersontitlelevel(title, function (err, obj) {
            if (err) {
                res.send({error: '获取失败'})
            } else {
                res.send({success: obj})
            }
        })
    } else {
        res.send({error: '提交参数有误'})
    }
}

/**
 * 修改或添加人员职务，职务是唯一的
 * @param {json} req - 客户端提交json 例如{_id:'人员ID',title:'职务ID'}
 * @param {json} res - 返回json：例如{success:'修改成功'}
 */
var sendpersontitle = function (req, res) {
    var json = req.body;
    var id = json._id;
    var title = json.title;
    if (id && title) {
        res.send({error: '提交的参数有误'})
    }

    personDAO.sendpersontitle(id, title, function (err, obj) {
        if (err) {
            res.send({error: '提交失败'})
        } else {
            res.send({success: '修改成功'})
        }
    })
}
/**
 * 根据职务id删除一个职务
 * @param {json} req - 客户端上传 {titleID:'职务id'}
 * @param {json} res - 服务器返回，{success:'删除成功'}
 */
var deletetitle = function (req, res) {
    var title = req.body.titleID;
    if (title) {
        persontitleDAO.deletetitle(title, function (titerr, titobj) {
            if (titobj) {
                res.send({success: '删除成功'})
            } else {
                res.send({error: '失败'})
            }
        })
    } else {
        res.send({error: '客户端提交错误'})
    }
}
//sendpersontitle({_id:'58e0c199e978587014e67a50',title:'111'})
/**
 * 根据人员ID 获取人员头像
 * @param {json} req - 客户端传入参数 {_id:'12313'}
 * @param {json} res - 返回参数 [{_id:'1234',images:{}}]
 */
var getUserPicById = function (req, res) {
    // //console.log('call getUserPicById');
    //for(var i in req.body){ //console.log("getUserPicById 请求内容body子项："+i+"<>\n")};
    var userid = req.body._id;
    // 调用方法
    if (!userid) {
        res.send({error: '发送的id错误'})
    } else {
        personDAO.getUserPicById(userid, function (err, obj) {
            if (!err) {
                // //console.log('getUserPicById 查询'+userid+'照片ok:');
                res.send({success: {_id: userid, images: obj}});
            } else {
                // //console.log('getUserPicById 查询'+userid+'照片错误:'+err);
                res.send({error: '获取失败'});
            }
        });
    }
}


/**
 * 根据人员ID 获取人员信息，不含位置信息
 * @param {json} req - 客户端传入参数 {personID:'12313'}
 * @param {json} res - 返回参数 [{_id:'1234',name:{}....}]
 */
var getUserInfoById = function (req, res) {
    // //console.log('call getUserPicById');
    //for(var i in req.body){ //console.log("getUserPicById 请求内容body子项："+i+"<>\n")};
    var userid = req.body.personID;
    // 调用方法
    if (!userid) {
        res.send({error: '发送的id错误'})
    } else {
        personDAO.getUserInfoById(userid, function (err, obj) {
            if (!err) {
                // //console.log('getUserPicById 查询'+userid+'照片ok:');
                res.send({success: obj});
            } else {
                // //console.log('getUserPicById 查询'+userid+'照片错误:'+err);
                res.send({error: err});
            }
        });
    }
}

/**
 * 获取所有人员照片
 * @param {} req - 直接请求
 * @param {json} res - 返回参数 [{_id:'1234',images:{}}]
 */
var getAllUserPic = function (req, res) {
    // //console.log('call getUserPicById');
    //for(var i in req.body){ //console.log("getUserPicById 请求内容body子项："+i+"<>\n")};
    // 调用方法
    personDAO.getAllUserPic(function (err, obj) {
        if (!err) {
            // //console.log('getUserPicById 查询'+userid+'照片ok:');
            res.send(obj);
        } else {
            // //console.log('getUserPicById 查询'+userid+'照片错误:'+err);
            res.send({error: '获取失败'});
        }
    });
}


/**
 * 根据人员id 获取极光id
 * @param {} req - 直接请求req.body.personID
 * @param {json} res - 返回参数 极光id 或者失败 {error: '获取失败'}
 */
var getIMid = function (req, res) {
    // //console.log('call getUserPicById');
    //for(var i in req.body){ //console.log("getUserPicById 请求内容body子项："+i+"<>\n")};
    // 调用方法
    personDAO.getIMid(req.body.personID, function (err, obj) {
        if (!err) {
            // //console.log('getUserPicById 查询'+userid+'照片ok:');
            res.send(obj);
        } else {
            // //console.log('getUserPicById 查询'+userid+'照片错误:'+err);
            res.send({error: '获取失败'});
        }
    });
}
/**
 * 根据人员id 设置极光id
 * @param {} req - 直接请求 req.body.personID,req.body.IMid
 * @param {json} res - 返回参数 极光id 或者失败 {error: '获取失败'}
 */
var setIMid = function (req, res) {
    // //console.log('call getUserPicById');
    //for(var i in req.body){ //console.log("getUserPicById 请求内容body子项："+i+"<>\n")};
    // 调用方法
    personDAO.setIMid(req.body.personID, req.body.IMid, function (err, obj) {
        if (!err) {
            // //console.log('getUserPicById 查询'+userid+'照片ok:');
            res.send(obj);
        } else {
            // //console.log('getUserPicById 查询'+userid+'照片错误:'+err);
            res.send({error: '获取失败'});
        }
    });
}

personrouter.post('/sendpersonimport', sendpersonimport);//提交
personrouter.post('/sendpersonreGister', sendpersonreGister);//提交
personrouter.post('/sendispersonAdd', sendispersonAdd);//提交
personrouter.post('/sendcheckperson', sendcheckperson)
personrouter.post('/sendupdatemobileuuid', sendupdatemobileuuid);
personrouter.post('/sendpwdandmobileuuid', sendpwdandmobileuuid);
personrouter.post('/sendWaitExamineperson', sendWaitExamineperson);//提交
personrouter.post('/updatepersonstate', updatepersonstate);//提交
personrouter.post('/getdepartmentTopeople', getdepartmentTopeople);//提交
personrouter.post('/getpersonstate', getpersonstate);//提交
personrouter.post('/sendnewdepartment', sendnewdepartment);//提交
personrouter.post('/updatedepartmentname', updatedepartmentname);//提交
personrouter.post('/updatedepartmentinfo', updatedepartmentinfo);//提交
personrouter.post('/updatepersoninfo', updatepersoninfo);
personrouter.post('/updatedepartmentstatus', updatedepartmentstatus);//提交
personrouter.post('/movedepartmentperson', movedepartmentperson);
personrouter.post('/copydepartmentperson', copydepartmentperson);
personrouter.post('/getAllDepartments', getAllDepartments);//提交
personrouter.post('/getAllDepartment', getAllDepartment);//提交

personrouter.post('/getpersontitle', getpersontitle);
personrouter.post('/getpersontitleTodepartment', getpersontitleTodepartment);//提交
personrouter.post('/gettitleToperson', gettitleToperson);//提交
personrouter.post('/getpersontitlelevel', getpersontitlelevel);
personrouter.post('/sendpersontitle', sendpersontitle);//提交
personrouter.post('/deletetitle', deletetitle);

personrouter.post('/getUserPicById', getUserPicById);
personrouter.post('/getUserInfoById', getUserInfoById);
personrouter.post('/getAllUserPic', getAllUserPic);
personrouter.post('/sendtitle', sendtitle);
personrouter.post('/settitlesort', settitlesort);
personrouter.post('/getIMid', getIMid);
personrouter.post('/setIMid', setIMid);


personrouter.post('/analysisXml', function (req, res) {
    personDAO.analysisXml(req.body.url, function (err, obj) {
        if (obj) {
            res.send(obj);
        } else {
            res.send({error: '获取失败'});
        }
    })
})


module.exports = personrouter;