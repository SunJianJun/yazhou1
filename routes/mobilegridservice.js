/**
 * @module 网格业务接口 url: /mobilegridservice
 */
var express = require('express');
var mobilegridservice = express.Router();


var concreteevent = require('../dbmodels/concreteeventschema.js');
// console.log('concreteevent数据模型是否存在：'+concreteevent);


//获取数据模型
var concreteeventDAO = require('../dbmodels/concreteeventDao');//具体事件表
var concretearguDAO = require('../dbmodels/concretearguDao');//具体参数表
var concretestepDAO = require('../dbmodels/concretestepDao');//具体步骤表
var departmentDAO = require('../dbmodels/departmentDAO.js');
var personDAO = require('../dbmodels/personDao');
/**
 *
 * 获取部门事件
 * @param {json} req - 传所要查询的部门ID,例如：{departmentID:"部门ID"}
 * @param {json} res - 返回部门事件数组JSON,包含<br/>{type:类型,<br/> name:名称,<br/> _id:ID,<br/> newer:更新日期,<br/> step:步骤列表}
 */
var getAllConcreteevent = function (req, res) { //获取部门事件
    concreteeventDAO.getAllConcreteevent(function (err, obj) {
        //console.log(obj);
        if (err) {
            res.send(null)
        } else {
            res.send(obj)
        }
    })
};
/**
 * 获得部门人员
 * @param {json} req - 传入需要获取的部门ID,例如：{departmentID:"部门ID"}
 * @param {json} res - 返回部门内所有人员，及下级部门的人员数组JSON，包含姓名，ID<br/>{name:名称,<br/> _id:ID,<br/> images:头像,<br/> sex:性别,<br/> role:权限,<br/> mobileUUid:手机uuid}
 */
var getDepartmentparson = function (req, res) {
    var departmentID = req.body.departmentID;
    departmentDAO.getAllpersonsByDepartIdOneStep(departmentID, function (err, obj) {
        if (err) {
            res.send(null)
        } else {
            res.send(obj)
        }
    })
};

/**
 * 根据部门ID获得部门区域网格
 * @param {json} req - 传入要查询的部门ID,例如：{departmentID:"部门ID"}
 * @param {json} res - 返回部门网格区域的坐标数组，数组中包含每个坐标子数组,按每两个截取可拼成坐标<br/>[<br/> [116.25612765372,40.1760414806014,<br/>116.273457389542,40.1458537654027,<br/>116.254320527215,40.1409379962385]<br/> ]
 */
var getDepartmentgird = function (req, res) {
    var departmentID = req.body.departmentID;
    departmentDAO.getDepartmentgird(departmentID, function (err, obj) {
        if (err) {
            res.send(null)
        } else {
            res.send(obj)
        }
    })
};

/**
 * 人员考勤-
 * @param {json} req - 人员上班打卡，是查询,传入要考勤的人员ID,{personID:"人员ID"}
 * @param {json} res - 返回人员考勤成功或失败
 */
var addpersonCheckwork = function (req, res) {
    var personID = req.body.personID;
    personDAO.addpersonCheckwork(personID, function (err, obj) {
        if (err) {
            res.send(null)
        } else {
            res.send(obj)
        }
    })
};
/**
 * 获取人员考勤记录-
 * @param {json} req - 传入要获取考勤的人员ID,{personID:"人员ID",startTime:"2017-05-16",endSTime:"2017-06-16"}
 * @param {json} res - 返回<br/>[{time:记录时间, record:考勤记录}]
 */
var getpersonCheckwork = function (req, res) {
    var personID = req.body.personID;
    personDAO.getpersonCheckwork(personID, function (err, obj) {
        if (err) {
            res.send(null)
        } else {
            res.send(obj)
        }
    })
};
/**
 * 人员处理的事件 ，（正在进行中的事件）
 * @param {json} req - 传入要查询人员ID 客户端提交json 例如{personID:"人员ID"}
 * @param {json} res - 包含<br/>{type:类型,<br/> name:名称,<br/> _id:ID,<br/> newer:更新日期,<br/> step:步骤列表}
 */
var getpersonEvent = function (req, res) {
    var personID = req.body.personID;
    concreteeventDAO.getpersonEvent(personID,function(err,obj) {
        if (err) {
            res.send(null)
        } else {
            res.send(obj)
        }
    })
};
/**
 * 获取人员路线,
 * 数据比较多，所以选的时间段范围尽量要小 *
 * @param {json} req - 人员ID，起始时间，结束时间,{personID:"人员ID",startTime:"2017-05-16 07:45",endSTime:"2017-05-16 10:45"}
 * @param {json} res - 返回路线列表<br/>[{geolocation:[每个定位点],positioningdate:定位时间}]
 */
var getpersonRoute = function (req, res) {
    var personID = req.body.personID,
        startdate = req.body.startdate,
        edidate = req.body.edidate;
    personDAO.getPersonLatestPositionInTimespan(personID, startdate, edidate, function (err, obj) {
        if (err) {
            res.send(null);
        } else {
            res.send(obj);
        }
    })
};
/**
 * 事件状态
 * @param {json} req 传入参数（1,2,3）<br/>1是正在进行的,2是完结的,3是已删除的,客户端提交json 例如{status:1}
 * @param {json} res 返回需要查询的状态json数组,数组中包含事件名称,ID,步骤<br/>{type:类型,<br/> name:名称,<br/> _id:ID,<br/> newer:更新日期,<br/> step:步骤列表}
 */
//事件状态
var geteventStatus = function (req, res) {
    var status = req.body.status;
    concreteeventDAO.geteventStatus(status, function (err, obj) {
        if (err) {
            res.send(null);
        } else {
            res.send(obj);
        }
    })
};
/**
 * 事件处理时间段 事件统计
 * @param {json} req - 开始时间,结束时间,[建案日期,结案日期]<br/>按照建案日期,结案日期可以二选一，默认为结案日期,客户端提交json 例如{startTime:"开始日期",ediTime:结束日期,start：,edi:}
 * @param {json} res - 返回需要查询的事件json数组,数组中包含事件名称,ID,步骤,按查询顺序返回<br/>{type:类型,<br/> name:名称,<br/> _id:ID,<br/> newer:更新日期,<br/>
 */
var geteventTimestatistics = function (req, res) {
    var startTime = req.body.startTime,
        ediTime = req.body.ediTime,
        start = req.body.start,//按建立日期  值为true或false
        edi = req.body.edi;//按结案日期
    concreteeventDAO.geteventTimestatistics(startTime, ediTime, start, edi, function (err, obj) {
        if (err) {
            res.send(null);
        } else {
            res.send(obj);
        }
    })
};

/**
 * 新建一个事件
 * @param {json} req - 新建事件的名称和类型,类型是已定义好的类型模板<br/>客户端提交json 例如{name:'案件名称',type:"案件类型,已定义好的类型ID"}
 * @param {json} res - 返回成功或失败响应状态码
 */
var sendnewEvent = function (req, res) {
    var name = req.body.name
    type = req.body.type;
    concreteeventDAO.sendAConcreteevent()
};
/**
 * 填写事件所需参数
 * @param {json} req - 传入步骤,参数,客户端提交json 例如{stepID:"步骤ID",arguments:[{type:"日期",value:["值1","值2"]},setByWho:"设置人ID",identified:"设置的密码"}]
 * @param {json} res - 返回成功或失败响应状态码
 */
var sendeventargument = function (req, res) {
    var eventID = req.body.eventID;

};
/**
 * 获取待处理的事件列表<br/>根据部门查询所有待处理事件
 * @param {json} req - 传入要查询的待处理事件的部门ID,客户端提交json 例如{documentID:"部门ID"}
 * @param {json} res - 返回待处理事件的json数组<br/>{type:类型,name:名称,_id:ID,newer:更新日期,step:步骤列表}
 */
var getEventtype = function (req, res) {
    concreteeventDAO.getAllConcreteevent(function (err, obj) {
        if (err) {
            res.send(null);
        } else {
            res.send(obj);
        }
    })
};
/**
 * 事件查询<br/>
 * 根据类型，时间，区域，人员查询事件
 * @param {json} req - 传入类型,时间段,区域,参与人员。选择传入一个值{type:”事件类型“,time:{stertTime:"起始日期",ediTime:"结束日期"},region:"区域ID",person:['人员ID']}
 * @param {json} res - 返回{type:类型,name:名称,_id:ID,newer:更新日期,step:步骤列表}
 */
var geteventSearch = function (req, res) {
    var types = req.body.type,
        timeRange = req.body.time,
        region = req.body.region,
        person = req.body.person;
    //concreteeventDAO.
};

mobilegridservice.post('/getAllConcreteevent', getAllConcreteevent);
mobilegridservice.post('/getDepartmentparson', getDepartmentparson);
mobilegridservice.post('/getDepartmentgird', getDepartmentgird);
mobilegridservice.post('/addpersonCheckwork',addpersonCheckwork);
mobilegridservice.post('/getpersonEvent', getpersonEvent);
mobilegridservice.post('/getpersonRoute', getpersonRoute);
mobilegridservice.post('/geteventStatus', geteventStatus);

mobilegridservice.post('/sendnewEvent',sendnewEvent);
mobilegridservice.post('/sendeventargument', sendeventargument);

module.exports = mobilegridservice;