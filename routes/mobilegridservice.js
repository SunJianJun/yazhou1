/**
 * @module 网格业务接口 url: /mobilegridservice
 */
var express = require('express');
var mobilegridservice = express.Router();


var concreteevent = require('../dbmodels/concreteeventschema.js');
// console.log('concreteevent数据模型是否存在：'+concreteevent);


//获取数据模型
var abstracttypeDAO = require('../dbmodels/abstracttypeDAO');
var abstractstepDAO = require('../dbmodels/abstractstepDAO');

var concreteeventDAO = require('../dbmodels/concreteeventDao');//具体事件表
var concretestepDAO = require('../dbmodels/concretestepDao');//具体步骤表
var concretearguDAO = require('../dbmodels/concretearguDao');//具体参数表

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
 * 根据部门ID获得部门区域网格----待完善
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
  concreteeventDAO.getpersonEvent(personID, function (err, obj) {
    if (err) {
      res.send(null)
    } else {
      res.send(obj)
    }
  })
};
/**
 * 获取当前案件的所有步骤
 * @param {json} req - 客户端发起请求
 * @param {json} res - 服务器返回json，[{argu:["59648f04472f14b01de7a74f","59648f04472f14b01de7a750","59648f04472f14b01de7a751"],currentPusher:"null"name:"立案",no:1,status:"2",type:"无照经营"wordTemplate:"<p style="text-a",_id:"59648f04472f14b01de7a74e"},....]
 */
var getcasestep=function(req,res){
  var caseID = req.body._id;
  if (caseID) {
    concreteeventDAO.getIncompletesteps(caseID, function (err, obj) {
      if (err) {
        res.send({errot: Null})
      } else {
        concretestepDAO.geteventstep(obj.step,1, function (sterr, stobj) {
          if (sterr) {
            res.send({errot: Null})
          } else {
            var compare = function(obj1, obj2) {
              var val1 = obj1.no;
              var val2 = obj2.no;
              if (val1 < val2) {
                return -1;
              } else if (val1 > val2) {
                return 1;
              } else {
                return 0;
              }
            }
            stobj.sort(compare);
            res.send(stobj)
          }
        });
      }
    })
  } else {
    res.send({errot: '参数有误'})
  }
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
var geteventStatus = function (req, res) {
  var status = req.body.status;
  concreteeventDAO.geteventStatus(status, function (err, obj) {
    if (err) {
      res.send({error: '获取失败'});
    } else {
      res.send({success: obj});
    }
  })
};
/**
 * 获取当前需要进行的案件
 * @param {json} req - 客户端传入json，{id:'案件ID'}
 * @param {json} res - 服务器返回json，{argu:["59648f04472f14b01de7a74f","59648f04472f14b01de7a750","59648f04472f14b01de7a751"],currentPusher:"null"name:"立案",no:1,status:"2",type:"无照经营"wordTemplate:"<p style="text-a",_id:"59648f04472f14b01de7a74e"}
 */
var getcurrentstep = function (req, res) {
  var caseID = req.body._id;
  if (caseID) {
    concreteeventDAO.getIncompletesteps(caseID, function (err, obj) {
      if (err) {
        res.send({errot: Null})
      } else {
        concretestepDAO.geteventstep(obj.step, 2, function (sterr, stobj) {
          if (sterr) {
            res.send({errot: Null})
          } else {
            res.send(stobj)
          }
        });
      }
    })
  }else {
    res.send({errot: '参数有误'})
  }
}
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
  if (startTime && ediTime && start && edi) {
    res.send({error: '提交参数有误'});
    return;
  }
  concreteeventDAO.geteventTimestatistics(startTime, ediTime, start, edi, function (err, obj) {
    if (err) {
      res.send({error: null});
    } else {
      res.send({success: obj});
    }
  })
};

/**
 * 新建一个事件
 * @param {json} req - 新建事件的名称和类型,类型是已定义好的类型模板<br/>客户端提交json 例如{name:'案件名称',type:"案件类型,已定义好的类型ID"}
 * @param {json} res - 返回成功或失败响应状态码
 */
var sendnewEvent = function (req, res) {
  // //console.log('call sendAConcreteevent');
  //for(var i in req.body){ //console.log("sendAConcreteevent 请求内容body子项："+i+"<>\n")};
  var datt = req.body;
  var name = datt.name;  //名称
  var typeID = datt.type; //类型
  if (!name || !typeID) {
    res.send({error: '参数提交错误'});
    return;
  }
  //console.log(typeID);
  abstracttypeDAO.getoneeventtype(typeID, function (err, obj) { //抽象类型
    if (err) {
      console.log(err);
    } else {
      var stepsoption = obj.steps;
      // console.log('---')
      // console.log(stepsoption.length)
      // for (var i = 0, stepid = []; i < obj.steps.length; i++) { //循环出人员id数组
      //   // console.log(obj.steps[i].step); //抽象步骤 id
      //     stepid.push(obj.steps[i].step);
      // }
      // console.log(stepid); //抽象步骤 id
      var Allobj = {};//存储所有公共变量

      Allobj.eventstepID = [];

      var eventJson = {};
      eventJson.type = obj.typeName;
      eventJson.name = name;
      eventJson.newer = new Date();
      eventJson.status = 1;
      eventJson.step = [];
      obj.steps.forEach(function (val, key) {
        //eventJson.step.push({types: val.stepName, status: 1});
      })
      // console.log('具体事件数据')
      // console.log(eventJson)
      concreteeventDAO.sendAConcreteevent(eventJson, function (coneventerr, coneventobj) { //具体类型
        if (coneventerr) {
          console.log(coneventerr)
        } else {
          Allobj.ConcreteeventID = coneventobj._id; //创建的具体类型ID 添加步骤id
          geteventsteps(obj.steps) //获取抽象步骤
        }
      })
      var geteventsteps = function (stepss) {
        //   console.log('获取抽象步骤')
        // console.log(stepss)

        abstractstepDAO.geteventsteps(stepss, function (err, stepobj) { //查到人员json数据  抽象步骤
          if (err) {
            console.log(err);
          } else {
            // console.log('抽象步骤')
            // console.log(stepobj)
            //stepobj 抽象步骤 数组 多条记录
            var steplength = stepobj.length;
            var count = 0, argu1 = {};

            var jiazai = function () {
              // console.log(count>=steplength)
              if (count >= steplength) {
                //console.log('跳出')
                return;
              }
              argu1.name = stepobj[count].type;
              argu1.type = obj.typeName;
              console.log(count?2:1);
              argu1.status = count?2:1;
              argu1.no = stepobj[count].status;
              argu1.wordTemplate = stepobj[count].wordTemplate;
              argu1.currentPusher = 'null';
              argu1.argu = [];
              //console.log(stepobj[count]); //得到抽象表步骤 实例化成具体步骤和参数
              sendAConcretestep(argu1, stepobj[count], count, function (a) {
                //console.log($scope.abstracttype)
                if (count < steplength) {
                  count++;
                  jiazai();
                } else {
                  // res.send({success:'建立成功'})
                }
              })

            }
            jiazai();
          }
        })
      }
      var sendAConcretestep = function (argu1, stepobj, count, call) {
        console.log(argu1)
        concretestepDAO.sendAConcretestep(argu1, function (err, Concretestepobj) { //具体步骤表
          if (err) {
            console.log(err)
          } else {
            Allobj.eventstepID.push(Concretestepobj._id);
            Allobj.iseventstep = Concretestepobj._id;
            Allobj.eventargu = [];

            //garmentsConcret(argujson);//添加具体参数表
            //console.log("添加具体参数表")
            //console.log(Allobj)

            updateaddsetp(Allobj, stepobj, function (e) {//把具体步骤的id存到具体类型中
              //console.log('把具体步骤的id存到具体类型中') //应该调取两次
              res.send(e);
              // console.log('建立成功')
              call(true)
              //console.log(stepobj)
            })  //修改步骤 //把具体步骤的id存到具体类型中

          }
        });
      }
      var updateaddsetp = function (Allobj, stepobj, call) {

        // console.log('ceshi+++++++')
        // console.log(Allobj.eventstepID)
        // console.log('ceshi--------')

        concreteeventDAO.updateaddsetp(Allobj.ConcreteeventID, Allobj.eventstepID, function (err, obj) {//把具体步骤的id存到具体类型中
          if (err) {
            console.log(err)
          } else {
            Allobj.eventargu.push(obj._id)
            //console.log(obj)
            // 添加具体参数表
            var concretestep = {}, arguArr = [];
            var json = stepobj; //抽象步骤
            var argu1 = json.argument;
            //console.log(json)
            for (var k = 0; k < argu1.length; k++) {
              var newObj = {};
              newObj.identified = '1';
              newObj.setTime = new Date();
              newObj.setByWho = json.author;
              newObj.type = argu1[k].argutype;
              newObj.promptvalue = argu1[k].name;
              arguArr.push(newObj);
              //console.log('抽象步骤');
            }
            sendAllConcreteargu(arguArr, function () {
              call()

            }); //具体参数表
          }
        })

      }
      var sendAllConcreteargu = function (ARR, call) {
        //console.log('次数')
        //console.log(ARR)
        var arguID = [];
        concretearguDAO.sendAllConcreteargu(ARR, function (err, obj) { //具体参数表
          if (err) {
            console.log(err);
          } else {
            arguID.push(obj._id)
            //console.log(arguID)

            //for (var i = 0; i < Allobj.eventstepID.length; i++) {
            updateaddargu(Allobj.iseventstep, arguID, function (id, argu) {
              call()
            })//步骤表添加参数id
            //}
            //console.log('--+--')
            //concretestepDAO.sendAConcretestep()
          }
        })
      }
      var updateaddargu = function (ID, argu, call) {  //步骤表添加参数id
        concretestepDAO.updateaddargu(ID, argu, function (err, arguupdate) {
          if (err) {

          } else {
            call()
          }
        })
      }
    }
  })
};
/**
 * 获得所有已完成的步骤
 * @param {json} req - 客户端传入json，{id:'案件ID'}
 * @param {json} res - 服务器返回json，{argu:["59648f04472f14b01de7a74f","59648f04472f14b01de7a750","59648f04472f14b01de7a751"],currentPusher:"null"name:"立案",no:1,status:"2",type:"无照经营"wordTemplate:"<p style="text-a",_id:"59648f04472f14b01de7a74e"}
 */
var getcompletestep=function (req, res) {
  var caseID = req.body._id;
  if (caseID) {
    concreteeventDAO.getIncompletesteps(caseID, function (err, obj) {
      if (err) {
        res.send({errot: Null})
      } else {
        concretestepDAO.geteventstep(obj.step, 3, function (sterr, stobj) {
          if (sterr) {
            res.send({errot: Null})
          } else {
            res.send(stobj)
          }
        });
      }
    })
  }else {
    res.send({errot: '参数有误'})
  }
}
/**
 * 获取事件步骤，传入事件的步骤ID
 * @param {json} req - 客户端提交json，{id:'事件ID'}
 * @param {json} res - 返回数组json，[{identified:"1"promptvalue:"案发时间",setByWho:"58c043cc40cbb100091c640d",setTime:"2017-07-11T08:40:36.704Z",type:"时间",value:Array(0),__v:0,_id:"59648f04472f14b01de7a74f"},.....]
 */
var geteventstep = function (req, res) {
  // //console.log('call geteventstep');
  //for(var i in req.body){ //console.log("geteventstep 请求内容body子项："+i+"<>\n")};
  var datt = req.body.id;
  console.log(datt)
  if (!datt) {
    res.send({error: '参数错误'});
  } else {
    // //console.log('senderID:'+senderID);
    concretestepDAO.geteventstep(datt, function (err, obj) {
      if (!err) {
        res.send({success: obj});
      } else {
        res.send({error: '获取步骤出错'});
      }
    });
  }
};
/**
 * 填写参数完成，提交审核
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
mobilegridservice.post('/getpersonEvent', getpersonEvent);
mobilegridservice.post('/getcasestep',getcasestep);
mobilegridservice.post('/getpersonRoute', getpersonRoute);
mobilegridservice.post('/geteventStatus', geteventStatus);
mobilegridservice.post('/getcurrentstep', getcurrentstep);
mobilegridservice.post('/getcompletestep',getcompletestep);

mobilegridservice.post('/sendnewEvent', sendnewEvent);
mobilegridservice.post('/sendeventargument', sendeventargument);
mobilegridservice.post('/getEventtype',getEventtype)
mobilegridservice.post('/geteventSearch',geteventSearch)
mobilegridservice.post('/geteventstep',geteventstep)
mobilegridservice.post('/geteventTimestatistics',geteventTimestatistics)

module.exports = mobilegridservice;