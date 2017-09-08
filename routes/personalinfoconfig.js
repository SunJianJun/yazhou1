/**
 * @module 个人信息配置模块 url:  /personalinfo
 */
var express = require('express');
var qr = require('qr-image');
var personinfo = express.Router();

//获取数据模型
var personDAO = require('../dbmodels/personDAO.js');
var depertmentDAO = require('../dbmodels/departmentDao.js');
var attendanceRecordDao = require('../dbmodels/attendanceRecordDao.js');
var phoneloginpcDAO = require('../dbmodels/phoneloginpcDao');
//console.log(attendanceRecordDao)


/**
 * 换班
 * @param {json} req - 传入人员和时间json数据，例如{personID:'123456',startTime:date,endTime:Date,shift:'换班人ID'}
 * @param {json} res - 返回成功后的json 例如：{success:'isok'}
 */
var sendpersonshift = function (req, res) {
  var datt = req.body;
  if (!datt) {
    return;
  }
  var alternateattendanceRecord = datt.shift,
    start = datt.startTime,
    end = datt.endTime;
  var leave = {};
  leave.shift = {};
  leave.personID = datt.personID;
  leave.shift.startDateTime = start;
  leave.shift.endDateTime = end;
  attendanceRecordDao.sendpersonshift(leave, function (err, obj) {
    if (!err) {
      res.send({success: obj});
    } else {
      res.send({error: null});
    }
  })
};
/**
 * 脱岗 - 暂时不做
 * @param {json} req - 传入人员和时间json数据，例如{personID:'123456',startTime:date,endTime:Date}
 * @param {json} res - 返回成功后的json 例如：{success:''}
 */
var sendpersonleave = function (req, res) {
  res.send({success: '暂时不做，请重换接口'})
  //attendanceRecordDao.sendperson()
};
/**
 * 离职 - 暂时不做
 * @param {json} req - 传入人员和时间json数据，例如{personID:'123456',startTime:date,endTime:Date}
 * @param {json} res - 返回成功后的json 例如：{success:''}
 */
var personjsResignation = function (req, res) {
  res.send({success: '暂时不做，请重换接口'})
  //attendanceRecordDao.sendpersoResignation()
}

/**
 * 获取一个人员考勤记录
 * @param {json} req 客户端请求数据{userid:'58c043cc40cbb100091c640d', starttime:"2017-01-01", endtime:"2017-02-01"}
 * 根据人员id和查询时间获取人员的考勤记录
 * @param {json} res 服务器返回，错误{error: err}，成功{
     "_id": "59ad04723bda9d1c1642c292",
     "person": "58e0c199e978587014e67a50", //人员id
     "checkdate": "2017-09-01",  //统计的日期
     "__v": 0,
     "personcheckimg": [  //城管局抽查人员考勤照片
         {
             "images": "img/abc.jpg",
             "checkdate": "2017-09-04T07:45:12.409Z",
             "_id": "59ad0488a7adbbfc0b7deb32"
         },
         {
             "images": "img/abc.jpg",
             "checkdate": "2017-09-04T07:47:11.315Z",
             "_id": "59ad04ffb984783c0dba726e"
         },
         {
             "_id": "59ad051a0fa659100ef2fb18",
             "checkdate": "2017-09-04T07:47:38.480Z",
             "images": "img/abc.jpg"
         }
     ],
     "area":[  //人员当天的工作区域
        {
            "name" : "奥运北区_3", //工作区域名称
            "_id" : ObjectId("59afdb24374db338166f7aaa"),//工作区域id
            "time" : [  //安排的工作时间段
                {
                    "timeStart" : "2 08:00:00", //开始巡逻日期--周2早上8点
                    "timeEnd" : "2 12:00:00", //结束巡逻日期--周2早上12点
                    "frequency" : 2,//巡逻次数
                    "_id" : ObjectId("59af9d443ead31881c27f9f4")
                }
            ],
            "geometry" : [ //区域的坐标点
                {
                    "lat" : 116.386272,
                    "lon" : 40.023215,
                    "_id" : ObjectId("59afdb24374db338166f7ab0")
                },
                {
                    "lat" : 116.408699,
                    "lon" : 40.023002,
                    "_id" : ObjectId("59afdb24374db338166f7aaf")
                },
                {
                    "lat" : 116.407935,
                    "lon" : 40.009442,
                    "_id" : ObjectId("59afdb24374db338166f7aae")
                },
                {
                    "lat" : 116.393077,
                    "lon" : 40.010346,
                    "_id" : ObjectId("59afdb24374db338166f7aad")
                },
                {
                    "lat" : 116.386272,
                    "lon" : 40.010081,
                    "_id" : ObjectId("59afdb24374db338166f7aac")
                },
                {
                    "lat" : 116.386272,
                    "lon" : 40.023215,
                    "_id" : ObjectId("59afdb24374db338166f7aab")
                }
            ]
        }
    ],
     "position": [{ //人员当天的所有坐标点
            "lat" : 116.400596940704,
            "lon" : 39.9573734997601,
            "time" : ISODate("2017-09-06T01:10:45.000Z")}....],
     "status": 1 //人员当天的状态，1是正常 0离职;2请假;3旷工;4待审核
 }
 */
var getpersonrecordtoid = function (req, res) {
  var datt = req.body;
  var person = datt.personID,
    start = datt.startTime,
    end = datt.endTime;
  if (person && start && end) {
    attendanceRecordDao.getpersonrecordtoid(person, start, end, function (err, obj) {
      if (!err) {
        res.send({success: obj});
      } else {
        res.send({error: err});
      }
    })
  } else {
    res.send({error: '参数错误'});
  }
};

/**
 * 获取部门默认办公区域
 * @param req
 * @param res
 */
var getdefaultworkarea=function (req,res) {
  
}

/**
 * 获取一个部门的所有人员考勤
 * @param {json} req - 传入部门id和时间段json数据，例如{departmentID:'123456',startTime:date,endTime:Date}
 * @param {json} res - 请求成功返回的json 例如：错误{error: err},成功[
 {
     "_id": "59ad04723bda9d1c1642c292",
     "person": "58e0c199e978587014e67a50", //人员id
     "checkdate": "2017-09-01",  //统计的日期
     "__v": 0,
     "personcheckimg": [  //城管局抽查人员考勤照片
         {
             "images": "img/abc.jpg",
             "checkdate": "2017-09-04T07:45:12.409Z",
             "_id": "59ad0488a7adbbfc0b7deb32"
         }...
     ],
     "area":[  //人员当天的工作区域
        {
            "name" : "奥运北区_3", //工作区域名称
            "_id" : ObjectId("59afdb24374db338166f7aaa"),//工作区域id
            "time" : [  //安排的工作时间段
                {
                    "timeStart" : "2 08:00:00", //开始巡逻日期--周2早上8点
                    "timeEnd" : "2 12:00:00", //结束巡逻日期--周2早上12点
                    "frequency" : 2,//巡逻次数
                    "_id" : ObjectId("59af9d443ead31881c27f9f4")
                }
            ],
            "geometry" : [ //区域的范围坐标点
                {
                    "lat" : 116.386272,
                    "lon" : 40.023215,
                    "_id" : ObjectId("59afdb24374db338166f7ab0")
                },{
                    "lat" : 116.386272,
                    "lon" : 40.023215,
                    "_id" : ObjectId("59afdb24374db338166f7ab0")
                }.....
            ]
        }
    ],
     "position": [{ //人员当天的所有坐标点
            "lat" : 116.400596940704,
            "lon" : 39.9573734997601,
            "time" : ISODate("2017-09-06T01:10:45.000Z")}....],
     "status": 1 //人员当天的状态，1是正常 0离职;2请假;3旷工;4待审核
 }.....]
 */
var getpersonrecordTodepartment = function (req, res) {
  var datt = req.body;
  var department = datt.departmentID,
    start = datt.startTime,
    end = datt.endTime;
  if (department && start && end) {
    attendanceRecordDao.getpersonrecordTodepartment(department, start, end, function (err, obj) {
      if (!err) {
        res.send({success: obj});
      } else {
        res.send({error: '没有获取到'});
      }
    })
  } else {
    res.send({error: '参数错误'});
  }
};

/**
 * 上传城管局抽查上班人员照片记录
 * @param {json} req - 客户端提交json， 例如{personID:'用户id',date:'日期',route:'图片地址'}
 * @param {json} res - 服务器返回 {success:'is ok!'}
 */
var sendpersonimg=function (req,res) {
  var personid=req.body.personID;
  date=req.body.date;
  route=req.body.route;
  if(personid&&date&&route){
    attendanceRecordDao.sendpersonimg(personid, date, route, function (err, obj) {
      if(!err){
        res.send({error:'参数不完整'})
      }else{
        res.send({success:'is ok!'})
      }
    })
  }else{
    res.send({error:'参数不完整'})
  }
}

/**
 * 修改自己的个人密码，必须输入原密码
 * @param {json} req - 客户端提交json，没有id可以提交身份证号， 例如{_id:'用户id',idNum:'用户身份证',opwd:'原密码',npwd:'新密码'}
 * @param {json} res  返回提示修改成功，或者原密码错误
 */
var updatepersonpassword = function (req, res) {
  var json = req.body,
    uid = json._id,
    idNum = json.idNum,
    opwd = json.opwd,
    npwd = json.npwd;
  if (uid || idNum) {
    if (npwd.length < 6) {
      res.send({error: '密码长度过低'})
    }
    personDAO.updatepersonpassword(uid, idNum, opwd, npwd, function (err, obj) {
      if (err) {
        res.send({error: err})
      } else {
        res.send({success: obj})
      }
    })
  } else {
    res.send({error: '提交参数错误'})
  }
}
/**
 * 判断密码是否输入正确
 * @param {json} req - 客户端提交json，如果没有用户id，传身份证号 例如{_id:'用户id',idNum:'身份证号码',pwd:'密码'}
 * @param {json} res  返回提示修改成功，或者原密码错误
 */
var ispersonpassword = function (req, res) {
  var json = req.body,
    uid = json._id,
    pwd = json.pwd,
  idNum=json.idNum;
  if (pwd&&(uid||idNum)){
    personDAO.ispersonpassword(uid, pwd,idNum, function (err, obj) {
      if (!err) {
        res.send({success: '输入正确'})
      } else {
        res.send({error: err})
      }
    })
  } else {
    res.send({error: '提交参数错误'})
  }
}

/**
 * 身份信息有误上报 - 待完善
 * @param {json} req
 * @param {json} res
 */
var sendpersoninfoerr = function (req, res) {

}
var sendphoneBypcloginuuid = function (req, res) {
  //客户端生成ID用于建数据使用
  var UUID=function () {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "";
    var uuid = s.join("");
    return uuid;
  }
  var huuid=UUID()+'-'+new Date().getTime();
  console.log('获取到的id' + huuid);
  if (UUID) {
    phoneloginpcDAO.save({checkcode:huuid, createTime: new Date()}, function (err, obj) {
      if (obj) {
        console.log(obj)
        res.send({success:obj._id});
      } else {
        res.send({'error': null});
      }
    })
  } else {
    res.send({'error': null});
  }
}

/**
 * 手机二维码扫描，登录桌面端
 * @param {json} req - 客户端提交人员账号密码 {uuid:'图片识别ID',personID:'人员ID']}
 * @param {json} res - 手机自动填入登陆信息，登陆客户端界面
 */
var sendphoneBypclogin = function (req, res) {
  var datt = req.body,
    uuid = req.body.uuid,
    personID = req.body.personID;
  if (uuid && personID) {
    personDAO.getUserInfoById(personID, function (perr, pobj) {
      if (perr) {
        res.send({error: '失败'})
      } else {
        phoneloginpcDAO.sendphonelogin(uuid, personID, function (serr, sobj) {
          if (!serr) {
            res.send({success: '扫码成功'})
          } else {
            res.send({error: '失败'})
          }
        })
      }
    })
  } else {
    res.send({'error': null});
  }
}

//pc端获取是否存在人员信息，如果有就登陆
var getphoneBypclogin = function (req, res) {
  id = req.body._id;//登陆id
  var overdue = 20;//过期时间 单位秒
  var isremove=false;

  console.log(id)
  if (id) {
    phoneloginpcDAO.getlanglogin(id, function (err, obj) {
      if (err) {
        res.send({error: null})
      } else {
        if (obj) {
          console.log((new Date() - obj.createTime) / 1000)
          if ((new Date() - obj.createTime) / 1000 >= overdue) {
            phoneloginpcDAO.removeoverduetime(obj._id, function (rerr, robj) {
              if (robj) {
                res.send({error: '过期了'});
              }
            })
          } else {
            if (obj.person) {
              personDAO.getUserInfoById(obj.person, function (perr, pobj) {
                if (perr) {
                  res.send({error: null})
                } else {
                  res.send({success: obj})
                }
              })
            } else {
              res.send({success: obj})
            }
          }
        }
      }
    })
    // }
  }
}

var create_qrcode = function (req, res, next) {
  var text = req.query.text;
  try {
    // text +=Math.random();
    console.log(text);
    var ntext='http://120.76.228.172:2000/personalinfo/create_qrcode?text='+text+'&sr='+Math.random();
    console.log(ntext)
    var img = qr.image(ntext, {size: 10});
    res.writeHead(200, {'Content-Type': 'image/png'});
    img.pipe(res);
  } catch (e) {
    res.writeHead(414, {'Content-Type': 'text/html'});
    res.end('<h1>414 Request-URI Too Large</h1>');
  }
}


personinfo.post('/sendpersonshift', sendpersonshift);
personinfo.post('/getpersonrecordtoid', getpersonrecordtoid);
personinfo.post('/getpersonrecordTodepartment', getpersonrecordTodepartment)
personinfo.post('/updatepersonpassword', updatepersonpassword);
personinfo.post('/ispersonpassword', ispersonpassword);
personinfo.post('/sendpersoninfoerr', sendpersoninfoerr);
personinfo.post('/sendphoneBypcloginuuid', sendphoneBypcloginuuid);
personinfo.post('/sendphoneBypclogin', sendphoneBypclogin);//发送
personinfo.post('/getphoneBypclogin', getphoneBypclogin);//获取
personinfo.get('/create_qrcode', create_qrcode);//获取

module.exports = personinfo;