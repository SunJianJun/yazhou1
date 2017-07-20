/**
 * @module 网格业务接口 url: mobilegrid/mobilegridservice
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
var persontitleDAO = require('../dbmodels/persontitleDao');

/**
 *
 * 获取部门事件
 * @param {json} req - 传所要查询的部门ID,例如：{departmentID:"部门ID"}
 * @param {json} res - 返回部门事件数组JSON,包含<br/>{type:类型,<br/> name:名称,<br/> _id:ID,<br/> newer:更新日期,<br/> step:步骤列表}
 */
var getAllConcreteevent = function (req, res) { //获取部门事件
  var departemnt=req.body.departmentID;
  if(!departemnt){
    res.send({error:'参数错误'})
  }else {
    concreteeventDAO.getAllConcreteevent(departemnt,function (err, obj) {
      //console.log(obj);
      if (err) {
        res.send({error:null})
      } else {
        res.send({success:obj})
      }
    })
  }
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
      res.send({error:null})
    } else {
      res.send({success:obj})
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
      res.send({error:null})
    } else {
      res.send({success:obj})
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
      res.send({error:null})
    } else {
      res.send({success:obj})
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
        res.send({error:null})
      } else {
        concretestepDAO.geteventstep(obj.step,'', function (sterr, stobj) {
          if (sterr) {
            res.send({error:null})
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
            res.send({success:stobj})
          }
        });
      }
    })
  } else {
    res.send({error:'参数有误'})
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
      res.send({error:null})
    } else {
      res.send({success:obj})
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
        res.send({error: null})
      } else {
        if(obj&&obj.step) {
          concretestepDAO.geteventstep(obj.step, 2, function (sterr, stobj) {
            if (sterr) {
              res.send({error: null})
            } else {
              res.send({success:stobj})
            }
          });
        }else{
          res.send({error: '获取出错'})
        }
      }
    })
  }else {
    res.send({error: '参数有误'})
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

//随机生成一个位置点 测试使用
var getRadomPt = function () {
  var resultPt =[];
  resultPt.push(116.40106141351825 + Math.random() / 25 * (Math.random() > 0.5 ? -1 : 1));
  resultPt.push(39.994762731321174 + Math.random() / 25 * (Math.random() > 0.5 ? -1 : 1));
  return resultPt;
};
/**
 * 新建一个事件,新建后可以调用/getcurrentstep获取第一步，进入立案
 * @param {json} req - 新建事件的名称、类型和所属部门（新建事件人员的部门）,案件位置,新建人
 * <br/>客户端提交json 例如{name:'案件名称',type:"案件类型,已定义好的类型ID",departmentID:'所属部门ID',position:[114.123456,40.123456],newwho:'新建人ID'}
 * @param {json} res - 返回成功或失败{error: '参数提交错误'}响应状态码
 */
var sendnewEvent = function (req, res) {
  // //console.log('call sendAConcreteevent');
  //for(var i in req.body){ //console.log("sendAConcreteevent 请求内容body子项："+i+"<>\n")};
  var name = req.body.name;  //名称
  var typeID = req.body.type; //类型
  var depart=req.body.departmentID;
  var position=req.body.position;
  var newwho=req.body.newwho;
  position=position?position:getRadomPt();
  if (!name || !typeID||!depart) {
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
      eventJson.createTime= new Date();
      eventJson.status = 1;
      eventJson.position=position;
      eventJson.department=depart;
      eventJson.createperson=newwho;
      eventJson.step = [];
      //obj.steps.forEach(function (val, key) {
      //  //eventJson.step.push({types: val.stepName, status: 1});
      //})
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
            var stepcount = 0, argu1 = {},isstatus=true;

            var stepjiazai = function () {
              // console.log(stepcount>=steplength)
              if (stepcount >= steplength) {
                console.log('返回数据'+Allobj.onestepID)
                res.send({success:Allobj.onestepID});
              }else {
                // console.log('调了几次'+stepcount)
                argu1.name = stepobj[stepcount].type;
                argu1.type = obj.typeName;
                argu1.status=1;
                argu1.responsible=null;
                if(isstatus) {
                  for(var aa=0;aa<stepss.length;aa++){
                    if(stepss[aa].no==1){
                      if(stepss[aa].step==stepobj[stepcount]._id){

                        argu1.status =2;
                          argu1.responsible = newwho;
                          isstatus=false;

                      }
                    }
                  }
                }
                argu1.no = stepobj[stepcount].status;
                argu1.wordTemplate = stepobj[stepcount].wordTemplate;
                argu1.power = stepobj[stepcount].power;//从抽象步骤中获取到添加到具体步骤中
                argu1.currentPusher = 'null';
                argu1.argu = [];
                // console.log(stepobj[stepcount]); //得到抽象表步骤 实例化成具体步骤和参数
                sendAConcretestep(argu1, stepobj[stepcount], stepcount, function (a) {
                  if (stepcount < steplength) {
                    stepcount++;
                    stepjiazai();
                  }
                })
              }

            }
            stepjiazai();
          }
        })
      }
      var sendAConcretestep = function (argu1, stepobj, count, call) {
        // console.log(argu1)
        concretestepDAO.sendAConcretestep(argu1, function (err, Concretestepobj) { //具体步骤表
          if (err) {
            console.log(err)
          } else {
            if(argu1.status==2){
              Allobj.onestepID=Concretestepobj._id;
            }
            // console.log("第一步的ID"+Allobj.onestepID)
            Allobj.eventstepID.push(Concretestepobj._id);
            Allobj.iseventstep = Concretestepobj._id;
            Allobj.eventargu = [];

            //garmentsConcret(argujson);//添加具体参数表
            //console.log("添加具体参数表")
            //console.log(Allobj)

            updateaddsetp(Allobj, stepobj, function (e) {//把具体步骤的id存到具体类型中
              //console.log('把具体步骤的id存到具体类型中') //应该调取两次
              // res.send(e);
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
        // console.log('次数')
        // console.log(ARR)
        concretearguDAO.sendAllConcreteargu(ARR, function (err, obj) { //具体参数表
          if (err) {
            console.log(err);
          } else {

            //for (var i = 0; i < Allobj.eventstepID.length; i++) {
            updateaddargu(Allobj.iseventstep, obj, function (id, argu) {
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
        res.send({error: null})
      } else {
        concretestepDAO.geteventstep(obj.step, 3, function (sterr, stobj) {
          if (sterr) {
            res.send({error: null})
          } else {
            res.send({success:stobj})
          }
        });
      }
    })
  }else {
    res.send({error: '参数有误'})
  }
}
/**
 * 获取事件所有步骤，传入事件的步骤ID
 * @param {json} req - 客户端提交json，{id:'事件ID'}
 * @param {json} res - 返回所有事件步骤数组json，[{identified:"1"promptvalue:"案发时间",setByWho:"58c043cc40cbb100091c640d",setTime:"2017-07-11T08:40:36.704Z",type:"时间",value:Array(0),__v:0,_id:"59648f04472f14b01de7a74f"},.....]
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
 * @param {json} req - 传入步骤,参数,客户端提交json,argument的值是参数二维数组 例如{eventID:"事件ID",stepID:'步骤ID',arguments:[{arguid:"5966e47a9acd27080b3c9110",value:"时间"},{arguid:"5966e47a9acd27080b3c9110",value:"时间"},{arguid:"5966e47a9acd27080b3c9110",value:"时间"}],setwho:'当前人员ID'}
 * @param {json} res - 返回成功{success:'is OK!'}或失败响应{error: null}状态码
 */
var sendeventargumentpush = function (req, res) {
  var eventid = req.body.eventID;
  var stepid=req.body.stepID;
  var argu=req.body.arguments;
  var setwho=req.body.setwho;
  console.log(eventid,argu)
  if(argu&&eventid&&setwho&&stepid){
    var argulength=argu.length;
    var argucount=0;
    var arguset=function() {
      concretearguDAO.setAConcreteargu(argu[argucount].arguid, argu[argucount].value,setwho, function (seterr, setstep) {//依次给步骤中填入参数
        if (seterr) {
          res.send({error: null});
        } else {
          argucount++;
          if(argucount<argulength){
            arguset()
          }else{
            concreteeventDAO.sendeventnewer(eventid,function(nererr,nerobj){//修改事件更新日期
              if(nererr){
                res.send({error: null});
              }else{

                res.send({success:'is OK!'});
              }
            })
          }
          // res.send({success:setstep});
        }
      })
    }
    arguset()

  }else{
    res.send({error:'提交参数有误'});
  }
};
/**
 * 填写参数完成，保存参数
 * @param {json} req - 传入步骤,参数,客户端提交json,argument的值是参数二维数组 例如{eventID:"事件ID",arguments:[{arguid:"5966e47a9acd27080b3c9110",value:"时间"},{arguid:"5966e47a9acd27080b3c9110",value:"时间"},{arguid:"5966e47a9acd27080b3c9110",value:"时间"}],setwho:'当前人员ID'}
 * @param {json} res - 返回成功{success:'is OK!'}或失败响应{error: null}状态码
 */
var sendeventargument = function (req, res) {
  var eventid = req.body.eventID;
  var argu=req.body.arguments;
  var setwho=req.body.setwho;
  console.log(eventid,argu)
  if(argu&&eventid&&setwho){
        var argulength=argu.length;
        var argucount=0;
        var arguset=function() {
          concretearguDAO.setAConcreteargu(argu[argucount].arguid, argu[argucount].value,setwho, function (seterr, setstep) {//依次给步骤中填入参数
            if (seterr) {
              res.send({error: null});
            } else {
              argucount++;
              if(argucount<argulength){
                arguset()
              }else{
                concreteeventDAO.sendeventnewer(eventid,function(nererr,nerobj){//修改事件更新日期
                  if(nererr){
                    res.send({error: null});
                  }else{
                    res.send({success:'is OK!'});
                  }
                })
              }
              // res.send({success:setstep});
            }
          })
        }
        arguset()

  }else{
    res.send({error:'提交参数有误'});
  }
};

/**
 * 获取待处理的事件列表--完善中<br/>根据部门查询所有待处理事件
 * @param {json} req - 传入要查询的待处理事件的部门ID,客户端提交json 例如{documentID:"部门ID"}
 * @param {json} res - 返回待处理事件的json数组<br/>[{type:类型,name:名称,_id:ID,no:步骤顺序,status:步骤状态}]
 */
var getEventtype = function (req, res) {
  var caseID = req.body._id;
  if (caseID) {
    concreteeventDAO.getIncompletesteps(caseID, function (err, obj) {
      if (err) {
        res.send({error: null})
      } else {
        concretestepDAO.geteventstep(obj.step,1, function (sterr, stobj) {
          if (sterr) {
            res.send({error: null})
          } else {
            res.send({success:stobj})
          }
        });
      }
    })
  }else {
    res.send({error: '参数有误'})
  }
}
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
  var isabc='';
  (function(){
  for(var ac in req.body){
    if(req.body[ac]){
        isabc=ac;
        return;
    }
  }
}())
  res.send({success:isabc});
  switch (isabc){
    case 'person':
      console.log('perosnasd')

  }
  //concreteeventDAO.
};

var getConcretestepsInATimeSpanFromWho = function (req, res) {
  // //console.log('call getConcretestepsInATimeSpanFromWho');
  //for(var i in req.body){ //console.log("getConcretestepsInATimeSpanFromWho 请求内容body子项："+i+"<>\n")};
  var receiverID = req.body.receiverID,
    senderID = req.body.senderID,
    startTime = req.body.startTime,
    lastTime = req.body.lastTime;
  // 调用方法
  // concretestepObj.getConcretestepsInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
  // //console.log('senderID:'+senderID);
  concretestepDAO.getConcretestepsInATimeSpanFromWho(receiverID, senderID, startTime, lastTime, function (err, obj) {
    if (!err) {
      // console.log('getConcretestepsInATimeSpanFromWho 查询所有'+senderID+'发送的消息id:'+obj);
      res.send(obj);
    } else {
      //console.log('getConcretestepsInATimeSpanFromWho 查询所有'+senderID+'发送的消息为空:'+err);
      res.send(null);
    }
  });
};
/**
 * 根据步骤ID获取步骤
 * @param {json} req - 传入要事件的步骤ID,客户端提交json 例如{id:"步骤ID"}
 * @param {json} res - 返回查询的步骤详细<br/>{type:类型,name:名称,_id:ID,no:步骤顺序,status:步骤状态,wordTemplate:'<p>案件模板</p>'，currentPusher:'这个步骤当前的责任人'}
 */
var getoneeventstep = function (req, res) {
  var ID = req.body.id;
  concretestepDAO.getoneeventstep(ID,function (err, obj) {
    if (!err) {
      res.send({success:obj});
      // console.log(obj);
    } else {
      // console.log(err);
      res.send({error:null});
    }
  })
}
/**
 * 根据步骤获取所有步骤的参数
 * @param {json} req - 传入要事件的步骤ID,客户端提交json 例如{id:"步骤ID"}
 * @param {json} res - 返回此步骤的参数json数组<br/>[{identified:"1",promptvalue:"案发时间",setByWho:"58c043cc40cbb100091c640d",setTime:"2017-07-12T08:17:44.680Z",type:"时间",value:Array(0),_id:"5965db28eb1408f41ddfaa6e"},.....]
 */
var getargutostep = function (req, res) {
  var ID = req.body.id;
  if(ID) {
    concretestepDAO.getoneeventstep(ID, function (err, obj) {
      if (!err) {
        concretearguDAO.getparametersaccordingtoParameter(obj.argu, function (arguerr, arguobj) {
          if (!err) {
            res.send({success: arguobj});
          } else {
            // //console.log('getparametersaccordingtoParameter 查询所有'+senderID+'发送的消息为空:'+err);
            res.send({error:'参数获取出错'});
          }
        });
      } else {
        res.send({error:'步骤获取出错'});
      }
    })
  }else{
    res.send({error:"参数有误"});
  }
}
/**
 * 获取所有已定义的事件类型,
 * 可用于新建事件选择事件类型
 * @param {} req - 发起请求
 * @param {json} res - 返回数据[{typeName:'无照经营'，status:1,setDate:'2017-6-1',_id:'事件类型id'},.....]
 */
var getAllAbstracttype=function(req,res){
  abstracttypeDAO.getAllAbstracttype(function(err,obj){
    if(!err){
      // console.log(obj);
      res.send({success:obj});
    }else{
      //console.log(err)
      res.send({error:null});
    }
  })
}
/**
 * 事件删除
 * @param {json} req - 客户端请求 json {id:'事件ID'}
 * @param {json} res - 返回成功或失败{error:null}
 */
var sendeeventDelete = function (req, res) {
  var id = req.body.id;
  if(id) {
    concreteeventDAO.concreteeventDelete(id, function (err, obj) {
      if (!err) {
        res.send({success:'已删除'+id});
      } else {
        res.send({error: null});
      }
    })
  }else{
    res.send({error:'请求参数有误'});
  }
}
var sendstepadvance= function (req, res) {
  var ID = req.body.id;
  concretestepDAO.getoneeventstep(ID,function (err, obj) {
    if (!err) {
      res.send(obj);
      // console.log(obj);
    } else {
      // console.log(err);
      res.send(null);
    }
  })
};
/**
 * 获取当前用户编辑文档的权限
 * @param {json} req - 客户端传入案件设置的权限，人员职务 <br>{power：{backoff:"59520e5d7b6d7fa011adcc73",go:"59520e5d7b6d7fa011adcc73",new:"all"},title:'当前人员职务'}
 * @param {json} res - 服务器返回,当前用户可以使用的权限 {[backoff,go]}
 */
var getpersonpower=function(req,res){
  var power = req.body.power;
  var title=req.body.title;
  var back=[],iscurrent=[];
  if(!power){res.send({error:'参数传入错误'});return;}
  for(var isnot in power){
    if(power[isnot]=='all'){
      delete power[isnot]
      back.push(isnot)
    }else{
      iscurrent.push(isnot)
    }
  }
  if(!title){res.send({success:back});return;}
  persontitleDAO.getpersontitleno(title,function(pertiterr,pertitiobj){
    if(pertiterr){
      res.send({error:"获取当前用户职务出错"})
    }else{
      //console.log("获取用户级别")
      //console.log(pertitiobj)
      var titcount= 0,iscurrentlength=iscurrent.length;    if(!iscurrentlength){return;}
      var titlejiazai=function(){
        console.log(power[iscurrent[titcount]])
        persontitleDAO.getpersontitleno(power[iscurrent[titcount]],function(powtiterr,powtitiobj){//获取设置的权限
          if(pertiterr){
            res.send({error:"获取当前权限职务出错"})
          }else{
            //console.log("获取权限级别")
            //console.log(powtitiobj)
            if(powtitiobj&&powtitiobj.grade) {
              if (pertitiobj.grade >= powtitiobj.grade) {
                back.push(iscurrent[titcount])
              }
            }
            titcount++;
            if (titcount < iscurrentlength) {
              titlejiazai();
            } else {
              //console.log("获取完毕")
              res.send({success: back});
              return;
            }
          }
        })
      }
      titlejiazai();
    }
  })
}
/**
 * 判断当前人员是否有审核权利（删除事件，案件审理包括结案）
 * @param {json} req
 * @param {json} res
 */
var getpersonreviewedpower=function(req,res){}

mobilegridservice.post('/getAllConcreteevent', getAllConcreteevent);
mobilegridservice.post('/getDepartmentparson', getDepartmentparson);
mobilegridservice.post('/getDepartmentgird', getDepartmentgird);
mobilegridservice.post('/getpersonEvent', getpersonEvent);
mobilegridservice.post('/getcasestep',getcasestep);
mobilegridservice.post('/getpersonRoute', getpersonRoute);
mobilegridservice.post('/geteventStatus', geteventStatus);
mobilegridservice.post('/getcurrentstep', getcurrentstep);
mobilegridservice.post('/getcompletestep',getcompletestep);

mobilegridservice.post('/geteventTimestatistics',geteventTimestatistics)
mobilegridservice.post('/sendnewEvent', sendnewEvent);
mobilegridservice.post('/geteventstep',geteventstep);

mobilegridservice.post('/sendeventargumentpush', sendeventargumentpush);
mobilegridservice.post('/sendeventargument', sendeventargument);
mobilegridservice.post('/getEventtype',getEventtype);
mobilegridservice.post('/geteventSearch',geteventSearch);
mobilegridservice.post('/getoneeventstep',getoneeventstep);
mobilegridservice.post('/getargutostep',getargutostep);
mobilegridservice.post('/getAllAbstracttype',getAllAbstracttype);
mobilegridservice.post('/sendeeventDelete',sendeeventDelete);
mobilegridservice.post('/getpersonpower',getpersonpower);

module.exports = mobilegridservice;