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
 * @param {json} res - 返回成功后的json 例如：{success:''}
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
  attendanceRecordDao.save(leave, function (err, obj) {
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
 * 获取一个人的考勤记录
 * @param {json} req - 传入人员和时间段json数据，例如{personID:'123456',startTime:date,endTime:Date}
 * @param {json} res - 返回成功后的json 例如：[{}]
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
        res.send({error: '获取错误'});
      }
    })
  } else {
    res.send({error: '参数错误'});
  }
};
/**
 * 获取一个部门的所有人员考勤
 * @param {json} req - 传入部门id和时间段json数据，例如{departmentID:'123456',startTime:date,endTime:Date}
 * @param {json} res - 返回成功后的json 例如：[{}]
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
 * @param {json} req - 客户端提交json， 例如{_id:'用户id',pwd:'密码'}
 * @param {json} res  返回提示修改成功，或者原密码错误
 */
var ispersonpassword = function (req, res) {
  var json = req.body,
    uid = json._id,
    pwd = json.pwd;
  if (uid || pwd) {
    personDAO.ispersonpassword(uid, pwd, function (err, obj) {
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
  UUID = req.body.UUID;//客户端生成ID用于建数据使用
  console.log('获取到的id' + UUID);
  if (UUID) {
    phoneloginpcDAO.save({checkcode: UUID, createTime: new Date()}, function (err, obj) {
      if (obj) {
        console.log(obj)
        res.send({success: obj});
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
  setTimeout(function(){
    // console.log('删除')
  },5000)
  if (id) {
    phoneloginpcDAO.getlanglogin(id, function (err, obj) {
      if (err) {
        res.send({error: null})
      } else {
        if (obj) {
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
    text += Math.random();
    var img = qr.image(text, {size: 10});
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