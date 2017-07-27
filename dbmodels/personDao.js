var mongodb = require('./mongodb');
var PersonSchema = require('./personschema');//这里相当于PersonSchema的export，真正要引用PersonSchema，应该这样PersonSchema.PersonSchema
var departmentModule = require('./departmentschema');
var select = require('xpath.js'),
  dom = require('xmldom').DOMParser;
var fs = require('fs');
var locationModuler = require('./locationschema');
var db = mongodb.mongoose.connection;

db.on('error', console.error.bind(console, '连接错误:'));
db.on('open', function () {

  console.log('mongodb PersonSchema connection is ok!:' + mongodb);
});

//console.log('mongodb Schema:'+Schema);
var Personmodel = PersonSchema.Personmodel;
var locationmodel = locationModuler.Locationmodel;
var departmentModel = departmentModule.Departmentmodel;
//Personmodel= mongodb.mongoose.model("Person", PersonSchema);
console.log('mongodb Person model is ok?:' + mongodb.mongoose.model("Person"));
//for(var i in Person){console.log("Person model items："+i+"<>")};
/*
 var testperson={
 'name': '123',
 'alias':'123',
 'title':'123',
 'mobile':'123123',
 'age':'123'
 };
 */
var PersonDAO = function () {
};

PersonDAO.prototype.analysisXml = function (xml, callback) {
  var newtem = [];//解析后所有人员集合
  fs.readFile(xml, function (err, data) {
    if (err) {
      return console.log(err);
    }
    var xml = data.toString();
    var doc = new dom().parseFromString(xml)
    var newXml = select(doc, "//Data");
    var leader = [];

    console.log('开始转json');
    for (var i = 0; i < newXml.length; i++) {
      var con = newXml[i].firstChild.data;
      var value = newXml[i].attributes[0].nodeValue;
      if (con.slice(0, 5) === '崖州区城市') {

        if (leader.length !== 0) {
          analysisXml(leader)
        }
        leader = [];
        leader.push(con)
      } else {
        leader.push(con)
      }
    }
    // return;
    analysisXml(leader)
    //addpersonfun(newtem);

    // console.log(leader);
    addPersonTodepartent(newtem);
  });
  var analysisXml = function (e) {
    // console.log(e)
    var classification = e[0].slice(8, 11);
    //console.log(e)
    //console.log(classification)
    var ks;
    for (var a = 0; a < e.length; a++) {
      if ((e[a] - 0 >= 1) && (e[a] - 0) < 10000) {//j如果是数字id
        var temporary = {};
        var post = ['局领导', '办公室', '法规办', '综合办', '巩卫办', '借调市巩卫办', '借调武装部', '办公室', '一中队', '二中队', '三中队', '四中队', '违停组'];
        try {
          if (post.indexOf(e[a + 1]) + 1) {
            ks = e[a + 1];
            // temporary.ks = ks;
            a++;
          }
          temporary.name = e[a + 2];
          if (e[a + 4].length === 18) {
            temporary.idNum = e[a +4];
          }else if (e[a + 5].length === 18) {
            temporary.idNum = e[a + 5];
          }else if (e[a + 6].length === 18) {
            temporary.idNum = e[a + 6];
          }
          // temporary.role = e[a + 3];
          if (e[a + 4].length === 11) {
            temporary.mobile = e[a + 4];
          } else if (e[a + 5].length === 11) {
            temporary.mobile = e[a + 5];
          }else if (e[a + 6].length === 11) {
            temporary.mobile = e[a + 6];
          }
        }catch(e){

        }
        var idcard = function (txtparm) {
          var year = txtparm.substring(6, 10);
          var month = txtparm.substring(10, 12);
          var date = txtparm.substring(12, 14);
          temporary.age = new Date().getFullYear() - year;
          return year + "-" + month + "-" + date;
        }
        temporary.idNum && (temporary.birthday = idcard(temporary.idNum));
        temporary.departments = [];
        // temporary.role='worker';
        temporary.title = "5952112dea76066818fd6dd3";// {department: e[0].substring(8, e[0].length - 3), job: e[a + 3], post: ''};
        // var bn = e[0].substring(8, e[0].length - 3)
        temporary.info = "农林局最高机构";
        //(ks == '局领导' ? '崖州区的行政管理最高机构' : (temporary.title.department == '机关' || temporary.title.post == '办公室' ? '崖州区的城市管理机构' : '崖州区的城市管理机构下属部门'));
        temporary.status = 1;
        newtem.push(temporary);
      }
    }
  }

  //人员解析部门， 未使用
  var analysisdepartment = function (data, branch) {
    var leaderJSON = {}, job;
    for (var a = 0; a < data.length; a++) {
      if (data[a].ks) {
        job = data[a].ks;
        leaderJSON[job] = [];
        delete(data[a].ks)
      }
      if (leaderJSON[job]) {
        leaderJSON[job].push(data[a]);
      } else {
        leaderJSON = data;
      }
    }
    if (branch) {
      var bn = branch.substring(8, branch.length - 3)
      return {[bn]: leaderJSON}
    }
    return leaderJSON;
  }

  var addpersonfun = function (data) {
    data.forEach(function (val, key) {
      PersonDAO.save(val, function (err, e) {
        console.log(e);
        PersonDAO.prototype.addDepartent(val, function (personID, departmentID) {
          console.log(personID + ' << ' + departmentID)
        })
      });
    })
  }

  var addPersonTodepartent = function (data) {
    //console.log('添加')
    //console.log(dement)
    if (!data) {
      return;
    }
    console.log(data)
    var personcount = 0;
    var personlength = data.length;
    var tianjia = function () {
      var persave = new Personmodel(data[personcount]);
      persave.save(function (err, e) {
        if (e) {
          console.log('添加人员成功')
          PersonDAO.prototype.addDepartent(data[personcount], function (personID, departmentID) {
            console.log("personID" + personID + ' << departmentID' + departmentID)
            PersonDAO.prototype.addPersonTodepartent(personID, departmentID, function (err, obj) {
              if (err) {
                console.log(err)
              } else if (obj) {

                console.log('-- -- -- ---')
                personcount++;
                console.log(personcount + '<>' + data.length)
                if (personcount < personlength) {
                  console.log('再次执行')
                  tianjia();
                } else {
                  console.log('添加完成')
                  return;
                }
              }

            })
          })
        }
      });
    }
    tianjia();
  }
}

//引用文件，开始解析

// PersonDAO.prototype.analysisXml('nongchanpin.xml');


//person添加department
PersonDAO.prototype.addDepartent = function (obj, callback) {
  // console.log(obj)
  Personmodel.findOne(obj.idNum ? {idNum: obj.idNum} : {mobile: obj.mobile}, function (err, coo) {
    if (coo) {
      var person = coo;
      var personDepartment = person.departments;
      var personID = person._id;
      //console.log(personID)
      //console.log(person)
      departmentModel.findOne({info: obj.info}, function (err, obj) {
        if (err) {

        } else {
          if (obj) {
            var departmentPerson = obj.persons;
            var departmentID = obj._id;
            callback(personID, departmentID);
          }
        }
      })
    } else {
      callback(err);
    }
  })
}

//person人员绑定到 department
//目标简单，参数简单，条件判断完善，信息输出完善
PersonDAO.prototype.addPersonTodepartent = function (personID, departmentID, callback) {//departmentID, personObj, callback) {
  var departmentID = departmentID;
  var personID = personID;
  if (personID && departmentID) {
    Personmodel.update({_id: personID}, {
      departments: [{
        department: departmentID,
        role: 'worker'
      }]
    }, function (err, obj) {
      if (err) {
        callback('修改失败')
      } else {
        if (obj) {
          console.log('人员已添加部门personID：' + personID + '<> departmentID:' + departmentID)
          var person = obj;
          departmentModel.findOne({_id: departmentID}, function (err, depobj) {
            if (err) {
              callback(err, null)
            } else {
              if (depobj) {
                var department = depobj;
                var returnCon = 0;
                var departmentPersons = department.persons;//部门中的人员
                //此时，人员和部门可以肯定存在
                //1、人员添加部门

                departmentPersons.push({person: personID, role: 'worker'});
                departmentModel.update({_id: departmentID}, {persons: departmentPersons}, function (err, deparobj) {
                  if (err) {
                    callback(err);
                  } else {
                    callback(null, '部门中没有人员，已添加 ')
                  }
                })

              }
            }
          })
        }
      }
    })
  } else {
    callback('参数错误')
  }
}

//department 人员绑定 person  解除绑定
PersonDAO.prototype.offdepartentToPerson = function (personID, departmentID, callback) {

  var personID = personID;
  var departmentID = departmentID;
  Personmodel.find({_id: personID}, function (err, obj) {
    if (err) {

    } else {
      if (obj.length) {
        var person = obj[0];
        departmentModel.find({_id: departmentID}, function (err, obj) {
          if (err) {

          } else {
            if (obj.length) {
              var department = obj[0];
              var personDepartment = person.departments;//人员中的部门
              var departmentPersons = department.persons;//部门中的人员
              //department._id
              personDepartment.forEach(function (val, key) {
                if (val.department == departmentID) {
                  console.log(key);
                  personDepartment.splice(key, 1)
                  console.log(personDepartment)
                  Personmodel.update({_id: personID}, {departments: personDepartment}, function (err, obj) {
                    if (err) {

                    } else {
                      console.log('人员解绑部门')
                      //callback(null, '人员解绑部门')
                    }
                  })
                }
              })
              departmentPersons.forEach(function (val, key) {
                //console.log(val)
                if (val.person == personID) {
                  console.log(key);
                  departmentPersons.splice(key, 1)
                  departmentModel.update({_id: departmentID}, {persons: departmentPersons}, function (err, obj) {
                    if (err) {

                    } else {
                      console.log('部门解绑人员')
                    }
                  })
                }
              })
            }
          }
        })
      }
    }
  })
}

//测试人员绑定
//PersonDAO.prototype.offdepartentToPerson("5929084b2766bf1410c117df", "58c3a5e9a63cf24c16a50b8c", function (err, obj) {
//  if (err) {
//
//  } else {
//    console.log(obj)
//  }
//})
//存储用户
PersonDAO.prototype.save = function (obj, callback) {
  //Personmodel.create();
  // 终端打印如下信息
  var instance = new Personmodel(obj);
  //console.log('param value:' + obj + '<>instance.save:' + instance);
  instance.save(function (err, obj) {
    //console.log('save Person' + instance + ' fail:' + err);
    callback(err, obj);
  });
};

// 存储用户并注册到一个单位
//实际上是单位把对应的用户id存入其人员集合
PersonDAO.prototype.saveandRegisterwithdepartment = function (obj, departmentid, outcallback, rolestr) {
  var callback = outcallback ? outcallback : function (err, obj) {
    //console.log('存储用户并注册到一个单位saveandRegisterwithdepartment：'+'err:'+err+'obj:'+obj);
  };
  var role = rolestr ? rolestr : 'worker';
  //Personmodel.create();
  // 终端打印如下信息
  //console.log('called Person saveandRegister');
  var instance = obj;
  //console.log('param value人员:'+obj+'<>instance.saveandRegister部门:'+departmentid);
  // 如果这个人员id不存在，则存储，否则，更新
  //2.子表插入数据。 blogid为刚插入主表的主键
  departmentModel.findOne({_id: departmentid}, function (err, doc) {
    if (err) {
      //console.log('根据id查找单位出错：'+err);
    }
    else {	// 避免重复
      var isExisted = false;
      for (var index = 0; index < doc.persons.length; index++) {
        if (doc.persons[index].person + '' == instance._id + '') {
          isExisted = true;
          doc.persons.slice(index, 1);
        }
      }
      // 将此人加入此单位
      doc.persons.push({person: instance._id, 'role': role});
      departmentModel.update({_id: doc._id}, {persons: doc.persons}, function (err, docs) {//更新
        if (err) {
          //console.log('部门添加人员update 失败：'+err);
          callback(err, null);
        }
        else {
          //console.log('部门添加人员update success');
          callback(null, docs);
        }
      })

    }
  });
};
// 存储用户并注册到一个单位
//实际上是单位把对应的用户id存入其人员集合
PersonDAO.prototype.saveandRegister = function (obj, departmentid, callback, rolestr) {
  var role = arguments[3] || 'worker';
  //Personmodel.create();
  // 终端打印如下信息
  //console.log('called Person saveandRegister');
  var instance = new Personmodel(obj);
  //console.log('param value人员:'+obj+'<>instance.saveandRegister部门:'+departmentid);
  // 如果这个人员id不存在，则存储，否则，更新
  if (!obj._id) {
    instance.role = role;
    instance.save(function (err) {
      //console.log('saveandRegister Person'+instance+' fail:'+err);
      if (!err) {
        //2.子表插入数据。 blogid为刚插入主表的主键
        departmentModel.findOne({_id: departmentid}, function (err, doc) {
          if (err) {
            //console.log('根据id查找单位出错：'+err);
          }
          else {	// 避免重复
            var isExisted = false;
            for (var index = 0; index < doc.persons.length; index++) {
              if (doc.persons[index].person + '' == instance._id + '') {
                isExisted = true;
              }
            }
            // 将此人加入此单位
            if (!isExisted) {
              doc.persons.push({person: instance._id, 'role': role});
              departmentModel.update({_id: doc._id, persons: doc.persons}, function (err, docs) {//更新
                if (err) {
                  //console.log('部门添加人员update 失败：'+err);
                  callback(err, null);
                }
                else {
                  console.log('部门添加人员update success');
                  var isdExisted = false;
                  for (var index = 0; index < instance.departments.length; index++) {
                    if (instance.departments[index] == departmentid) {
                      isdExisted = true;
                    }
                  }
                  if (!isdExisted)
                    Personmodel.update({
                        _id: instance._id,
                        departments: instance.departments.push(departmentid)
                      }, function (err, docs) {//更新
                        if (err) {
                          //console.log('人员添加部门update 失败：'+err);
                          callback(err, null);
                        }
                        else {
                          console.log('人员添加部门update success');
                        }

                      }
                    );
                }
              })
            }
          }
        });
      }
      else {
        callback(err, null);
      }
    });
  } else {
    // Personmodel.update
    var isdExisted = false;
    if (instance.departments && instance.departments.length > 0) {
      for (var index = 0; index < instance.departments.length; index++) {
        if (instance.departments[index] == departmentid) {
          isdExisted = true;
        }
      }
    } else {
      instance.departments = new Array();
      isdExisted = false;
    }

    if (!isdExisted)
      Personmodel.update({
          _id: instance._id,
          role: 'worker',
          departments: instance.departments.push(departmentid)
        }, function (err, docs) {//更新
          if (err) {
            console.log('人员添加部门update 失败：' + err);
            callback(err, null);
          }
          else {
            console.log('人员添加部门update success');
            var isExisted = false;
            for (var index = 0; index < doc.persons.length; index++) {
              if (doc.persons[index] == instance._id) {
                isExisted = true;
              }
            }
            // 将此人加入此单位
            if (!isExisted) {
              doc.persons.push(instance._id);
              departmentModel.update({_id: doc._id, persons: doc.persons}, function (err, docs) {//更新
                  if (err) {
                    //console.log('部门添加人员update 失败：'+err);
                    callback(err, null);
                  }
                  else {
                    //console.log('部门添加人员update success');
                  }
                }
              );
            }
          }

        }
      );
  }
};

// 通过人员id和单位id就可以注册到指定单位，单异步操作
PersonDAO.prototype.personRegisterByID = function (personid, departmentid, callback, role) {
  //Personmodel.create();
  // 终端打印如下信息
  //console.log('called Person personRegisterByID');
  // var instance = new Personmodel(obj);
  Personmodel.findOne({_id: personid}, {personlocations: 0}, function (err, doc) {
      if (!err) {
        PersonDAO.prototype.saveandRegister(doc, departmentid, callback, role);
      } else {
        //console.log('单位注册查无此人：'+personid);
      }
    }
  );
};


// 改变人员状态，单异步操作
PersonDAO.prototype.changePersonStatus = function (personid, status, callback, role) {
  //Personmodel.create();
  // 终端打印如下信息
  //console.log('called Person changePersonStatus');
  // var instance = new Personmodel(obj);
  Personmodel.findOne({_id: personid}, {personlocations: 0}, function (err, doc) {
      if (!err) {
        Personmodel.update({_id: personid}, {status: status}, function (er1r, udoc) {
          //console.log('更新人员状态失败：'+personid);
          if (er1r) {
            callback('更新人员状态失败：' + personid)
          } else {
            callback(null, udoc)
          }
        });
      } else {
        //console.log('单位注册查无此人：'+personid);
        callback('单位注册查无此人：' + personid)
      }
    }
  );
};

// 得到人员的最新位置
PersonDAO.prototype.getPersonLatestPosition = function (personid, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    console.log('callback得到人员最新位置：' + obj.geolocation);
  };
  // 终端打印如下信息
  //console.log('called Person getPersonLatestPosition');
  // var instance = new Personmodel(obj);
  var query = Personmodel.find({'_id': personid});
  // 排序，不过好像对子文档无效
  query.sort({'personlocations.positioningdate': -1});//desc asc
  query.limit(1);

  query.exec(function (err, docs) {
    // called when the `query.complete` or `query.error` are called
    // internally
    if (!err) {
      if (docs[0].personlocations) {
        console.log('得到人员最新位置：' + docs[0].personlocations[docs[0].personlocations.length - 1]);//+"<>"+docs[0].personlocations
        callback(err, docs[0].personlocations[docs[0].personlocations.length - 1]);
      } else {
        callback(err, null);
      }
    }
    else {
      //console.log('获取人员位置失败：'+docs);
      callback(err, null);
    }
  });
};

// 得到人员的最新位置--新街口
PersonDAO.prototype.getNewPersonLatestPosition = function (personid, callback) {
  var query = locationmodel.find({'person': personid});
  // 排序，不过好像对子文档无效
  query.sort({'positioningdate': -1});//desc asc
  query.limit(1);

  query.exec(function (err, docs) {
    // called when the `query.complete` or `query.error` are called
    // internally
    if (!err) {
      if (docs[0].positioningdate) {
        // console.log('得到人员最新位置：'+docs[0].personlocations[docs[0].length-1]);//+"<>"+docs[0].personlocations
        callback(err, docs[0]);
      } else {
        callback(err, null);
      }
    }
    else {
      //console.log('获取人员位置失败：'+docs);
      callback(err, null);
    }
  });
};


// 得到人员一段时间的位置
PersonDAO.prototype.getPersonLatestPositionInTimespan = function (personid, startTime, endTime, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    // console.log('得到人员一段时间的位置：'+obj+"<>"+startTime+"<>"+endTime);
    if (obj && obj.length) {
      console.log('得到人员一段时间的多个位置：' + obj.length + "<>" + startTime + "<>" + endTime + '<>' + obj[0].geolocation + '<>' + obj[0]._id + '<>' + obj[0].positioningdate);
      // for(var index =0;index<obj.length;index++)
      // {
      //     // console.log('callback getPersonLatestPositionInTimespan 成功：'+obj[index]._id+'<>'+obj[index].geolocation+'<>'+obj[index].positioningdate);
      // }

    }
  };
  // 终端打印如下信息
  //console.log('called Person getPersonLatestPositionInTimespan');
  // var instance = new Personmodel(obj);
  // var query = Personmodel.find({'_id': personid});
  var query = Personmodel.find({},
    {
      personlocations: {
        $elemMatch: {
          positioningdate: {
            "$gte": new Date(startTime),
            "$lte": new Date(endTime)
          }
        }
      }
    }
    // ,
    // {"personlocations.$": 100}
  );

  // query.select({personlocations: [{
  //     "$gte": new Date('2017-03-07'),
  //         "$lt":new Date('2017-03-09')
  // }
  // Personmodel.findOne({"_id":personid});
  Personmodel.aggregate()
    .match({
        "_id": mongodb.mongoose.Types.ObjectId(personid)
      }
    )
    .unwind("personlocations")
    // .unwind("personlocations.positioningdate")
    .match({
        "personlocations.positioningdate": {
          "$gte": new Date(startTime),
          "$lte": new Date(endTime)
        }
      }
    )
    // .sort({ "personlocations.positioningdate": 1 })
    .group(
      {
        "_id": "$_id",
        // "name": "$name",
        "personlocations": {$push: "$personlocations"}
      }
    )
    // .match({"players.trikots.isNew": true,"players.trikots.color": "red"})
    .exec(function (err, docs) {
      var str = '';
      for (var o in docs) {
        str += o + "<>";
      }
      console.log('得到人员一段时间的位置aggregate：' + err + "<>" + docs + "<>" + str);
      // called when the `query.complete` or `query.error` are called
      // internally
      if (!err) {
        //console.log('得到人员一段时间的位置：'+docs[0].personlocations);//+"<>"+docs[0].personlocations
        if (docs[0] && docs[0].personlocations)
          callback(err, docs[0].personlocations);
        else if (docs && docs.personlocations)
          callback(err, docs.personlocations);
        else
          callback(err, null);
      }
      else {
        //console.log('获取人员一段时间的位置失败：'+docs);
        callback(err, null);
      }
    });
}


PersonDAO.prototype.findByName = function (name, callback) {
  Personmodel.findOne({name: name}, function (err, obj) {
    callback(err, obj);
  });
};

// 根据用户名密码查询用户，密码可能是身份证号码，也有可能是单独的字段
PersonDAO.prototype.findByNameAndPwd = function (dname, dpwd, callback) {
  Personmodel.find({$or: [{pwd: dpwd}, {idNum: dpwd}], name: dname}, {personlocations: 0}, function (err, obj) {
    // ['name','sex','nation','birthday','residence','idNum','mobileUUid','title','mobile','age','create_date','images','status'],
    //console.log('有此用户名的用户有'+obj.length+'个'+obj[0]);
    callback(err, obj[0]);
    // console.log('有此密码的用户有很多');
    // callback(err, obj);
    // console.log(dpwd,dname);
  });
};

// 根据用户id查询所在部门
PersonDAO.prototype.findDepartmentInvolved = function (personid, outcallback) {

  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback findDepartmentInvolved 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        //console.log('callback findDepartmentInvolved 成功：'+'<>'+obj[index]);
      }
      if (obj.abstract) {
        //console.log('callback findDepartmentInvolved 成功：'+'<>'+obj.abstract+'<>'+obj.count);

      }

    }
  };

  Personmodel.findOne({_id: personid}).populate('departmens').exec(function (err, doc) {
    if (!err) {
      var iDepartments = doc.departmens;
      for (var index = 0; index < iDepartments.length; index++) {
        //console.log(personid+"相关单位名称："+iDepartments[index].name);
      }
      callback(err, iDepartments);
    } else {
      callback(err, null);
    }
  });


  var query = Personmodel.find({'_id': personid});
  var opts = [{
    path: 'departmens'
    //上下两种写法效果一样，都可以将关联查询的字段进行筛选
    // ,
    // select : '-personlocations'
    ,
    select: {name: 1}
  }];
  query.populate(opts);
  // 排序，不过好像对子文档无效
  // query.sort({'create_date':1});//desc asc
  // query.limit(1);

  query.exec(function (err, docs) {
    if (!err) {
      // 如果是需要摘要信息，而且指定来源的消息数量》0
      if (isAbstract && docs.length > 0) {
        var count = docs.length;
        var abstract = docs[docs.length - 1].text ? docs[docs.length - 1].text.substr(0, 6) + '...' : (docs[docs.length - 1].image ? '图片消息...' : (docs[docs.length - 1].video ? '视频消息...' : '....'));
        var output = {sender: docs[docs.length - 1].sender, count: count, abstract: abstract};
        callback(err, output);
      }
      // 如果不需要摘要信息，而且消息数量大于0
      else if (docs.length > 0) {
        callback(err, docs);
      } else {
        // 虽然没有错，但是也没有消息
        callback(err, null);
      }
    }
    else {
    }
  });
};

//把一个用户加到最高单位上
var addpersontotopdepartment = function (personobj, rolestr, callback) {
  departmentModel.findOne({parent: null}, function (err, firstDepartment) {
      //console.log("找到了顶级单位："+firstDepartment.name+'<>'+personobj._id+'<>'+((personobj.departments+'')==(firstDepartment._id+'')));
      // schema中定义过了，这个数组属性就一直不为空
      var isExisted = false;
      if (personobj.departments) {
        for (var index = 0; index < personobj.departments.length; index++) {
          if ((personobj.departments[index].department + '') == (firstDepartment._id + '')) {
            //console.log("personobj.department重复？"+personobj.departments[index]+'<>'+firstDepartment._id);
            isExisted = true;
          }
        }

      }
      if (personobj.departments == null)
        personobj.departments = new Array();
      if (!isExisted) personobj.departments.push({
        role: rolestr,
        department: firstDepartment
      });
      //console.log("personobj.departments存在"+'<>'+personobj.departments+'<>');//+personobj.save
      // personobj.update({departments:personobj.departments},function(err,result){
      // callback(err,'顶级单位挂靠 ok？'+err);
      // }
      // 存储完人的部分
      personobj.save(function (err) {
          //console.log('人挂靠顶级单位 ok？'+err+"<>"+personobj.name);
          // callback(err,'顶级单位挂靠 ok？'+err+"<>");
          // 存储单位的部分
          var isExistedren = false;
          if (firstDepartment.persons) {
            for (var index = 0; index < firstDepartment.persons.length; index++) {
              if ((firstDepartment.persons[index].person + '') == (personobj._id + '')) {
                // //console.log("personobj.department重复？"+personobj.departments[index]+'<>'+firstDepartment._id);
                isExistedren = true;
              }
            }

          }
          if (firstDepartment.persons == null)
            firstDepartment.persons = new Array();
          if (!isExistedren)
            firstDepartment.persons.push({
              role: rolestr,
              person: personobj
            });
          firstDepartment.save(function (err) {
            //console.log('顶级单位挂靠人 ok？'+err+"<>"+firstDepartment.name);
          });
        }
      );
    }
  );
}

// 初始化人员，一方面添加超级管理员admin账号，另一方面把所有没有单位的人员放到顶级单位中，用于测试和系统基本运行
PersonDAO.prototype.initializePersons = function (callback) {
  var adminUser = {
    //名称
    name: 'admin',
    //部门介绍
    pwd: '123456',
    // role:'super',
    //状态
    status: 1//1,正常;0,删除;2解散
  };
  var adminu = new Personmodel(adminUser);// 要删除的条件
  var del = {name: 'admin'};
  Personmodel.findOne(del, function (err, result) {
    if (err) {
      //console.log('Personmodel.findOne admin:'+err);
    } else {
      if (result) {
        result.update(adminUser, function (err) {
          if (err) {
            //console.log('Personmodel.findOne result:'+err);
          } else {
            //console.log("超级管理员已更新"+result.name+'<>'+result._id);
            addpersontotopdepartment(result, 'super', callback);
          }
        });
      } else {
        adminu.save(function (err) {
          if (err) {
            //console.log('Personmodel.findOne save:'+err);
          } else {
            console.log("超级管理员已存储");
            addpersontotopdepartment(adminu, 'super', callback);
          }
        });
      }
      //console.log("确保只有一个超级管理员");
    }
  });

  Personmodel.find({departments: null}, function (err, docs) {
    if (!err) {
      // departmentModel.findOne({parent:null},function(err, firstDepartment){
      for (var index = 0; index < docs.length; index++) {
        //console.log("找到了人员："+docs[index].name);
        // docs[index].role='worker';
        // PersonDAO.prototype.saveandRegister(docs[index],firstDepartment._id);
        addpersontotopdepartment(docs[index], 'worker', callback);
      }

      //    callback(err,'initializePersons ok');
      // 	}
      // );
    } else {
      //console.log("查询没有单位的用户出错："+err);
      // callback(err,null);
    }
  });
};


//修改用户的角色，即头衔
// 修改用户的手机、密码
// 修改用户的状态
PersonDAO.prototype.editUser = function (userObj, callback) {
  Personmodel.find({$or: [{pwd: dpwd}, {idNum: dpwd}]}, function (err, obj) {
    //console.log('有此密码的用户有很多');
    // callback(err, obj);
  }).findOne({name: dname}, function (err, obj) {
    //console.log('有此用户名的用户有1个');
    callback(err, obj);
  });
};


// 根据用户id查询同事
PersonDAO.prototype.getWorkmatesByUserId = function (userID, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      // console.log('callback getWorkmatesByUserId 得到同事出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        // console.log('callback getWorkmatesByUserId 得到同事成功：'+'<>'+obj[index].name);
      }
    }
  };

  Personmodel.find({_id: userID}, {personlocations: 0}).exec(function (err, personObjs) {
    if (!err) {
      // 如果是需要摘要信息，而且指定来源的消息数量》0
      if (personObjs && personObjs.length > 0) {
        var workmates = [];
        var curPserson = personObjs[0];
        var dpts = curPserson.departments;
        var dptids = [];
        for (var index = 0; index < dpts.length; index++) {
          dptids.push(dpts[index].department);
        }
        console.log(dptids)

        /*临时使用，获取测试用户*/
//             Personmodel.find({status: 9//{$gt: 0}
//                   }, {
//                       personlocations: 0
//                     }).exec(function (err, workmatesObjs) {
//                         if (!err) {
//                           //console.log(workmatesObjs)
//                           //console.log('callback getWorkmatesByUserId personObjs得到谁的同事：'+'<>'+curPserson.name+'<>'+workmates);
//                           // console.log(workmatesObjs);
//                           callback(err, workmatesObjs);
//                         }
//                         else {
//                           //console.log('callback getWorkmatesByUserId personObjs得到相关部门的下属人员出错：'+'<>'+curPserson.name+'<>');
//                           // 虽然没有错，但是也没有消息
//                           callback(err, null);
//                         }
//                     });
// return;


        //console.log('callback getWorkmatesByUserId personObjs得到相关部门的ids：'+'<>'+curPserson.name+'<>'+dptids);
        departmentModel.find({_id: {$in: dptids}}, {persons: 1}).exec(function (err, dprtsObjs) {
            if (!err) {
              if (dprtsObjs && dprtsObjs.length > 0) {
                for (var ddd = 0; ddd < dprtsObjs.length; ddd++) {
                  if (dprtsObjs[ddd].persons && dprtsObjs[ddd].persons.length > 0) {
                    for (var ttt = 0; ttt < dprtsObjs[ddd].persons.length; ttt++) {
                      // 不是当前用户时，才算同事
                      // //console.log('callback getWorkmatesByUserId 是否是同事：'+'<>'+dprtsObjs[ddd].persons[ttt].person+'<>'+curPserson._id);
                      if ((dprtsObjs[ddd].persons[ttt].person + '') != ('' + curPserson._id))
                      // 第二个条件，用户状态不为0，表示激活用户时才有效
                      {
                        // if(dprtsObjs[ddd].persons[ttt].person.status!=0)
                        workmates.push(dprtsObjs[ddd].persons[ttt].person);
                      }
                    }
                  }
                }

                console.log(workmates)
                Personmodel.find({
                  _id: {$in: workmates}, status: {$gt: 0}
                }, {
                  personlocations: 0,
                  images: 0
                }).exec(function (err, workmatesObjs) {
                    if (workmatesObjs) {
                      //console.log('callback getWorkmatesByUserId personObjs得到谁的同事：'+'<>'+curPserson.name+'<>'+workmates);
                      // console.log(workmatesObjs);
                      callback(err, workmatesObjs);
                    }
                    else {
                      //console.log('callback getWorkmatesByUserId personObjs得到相关部门的下属人员出错：'+'<>'+curPserson.name+'<>');
                      // 虽然没有错，但是也没有消息
                      callback(err, null);
                    }
                  }
                );
              }
            }
            else {
              //console.log('callback getWorkmatesByUserId personObjs得到相关部门出错：'+'<>'+'<>');
              // 虽然没有错，但是也没有消息
              callback(err, null);
            }
          }
        )
      }
      else {
        //console.log('callback 用户id查询出错：'+'<>'+'<>');
        // 虽然没有错，但是也没有消息
        callback(err, null);
      }
    }
    else {
    }

  });
};

PersonDAO.prototype.findByIDNum = function (IDNum, callback) {
  Personmodel.findOne({idNum: IDNum}, function (err, obj) {
    callback(err, obj);
  });
};

PersonDAO.prototype.findByMobileUUid = function (mobileUUid, callback) {
  Personmodel.findOne({mobileUUid: mobileUUid}, {personlocations: 0}, function (err, obj) {
    callback(err, obj);
  });
};

//获取照片
PersonDAO.prototype.getUserPicById = function (personId, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getUserPicById 得到照片出错：'+'<>'+err);
    } else {
      //console.log('callback getUserPicById 得到照片成功：'+'<>'+obj);
    }
  };
  Personmodel.findOne({_id: personId}, {images: 1}, function (err, obj) {
    if (!err) {
      if (obj.images && obj.images.coverSmall) {
        callback(err, obj.images.coverSmall);
        return;
      }
    }
    callback(err, null);
    return;
  });
};


//获取人员信息
PersonDAO.prototype.getUserInfoById = function (personId, callback) {
  console.log(personId)
  Personmodel.findOne({_id: personId}, {personlocations: 0}, function (err, obj) {
    if (obj) {
      if (obj) {
        callback(null, obj);
      } else {
        callback({error: "查无此人"}, null);
      }
    } else {
      callback(err, null);
    }
  });
};
//获取所有人员头像
PersonDAO.prototype.getAllUserPic = function (outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getUserPicById 得到照片出错：'+'<>'+err);
    } else {
      //console.log('callback getUserPicById 得到照片成功：'+'<>'+obj);
    }
  };

  Personmodel.find({}, 'images', function (err, obj) {
    if (!err) {
      callback(null, obj);
    } else {
      callback(err, null);
    }
  });
};

PersonDAO.prototype.updateById = function (person, callback) {
  var options = {upsert: true};
  console.log('called Person update id:' + person._id);

  var _id = person._id; //需要取出主键_id
  delete person._id;    //再将其删除
  Personmodel.update({_id: _id}, person, options, function (err, obj) {
    callback(err, obj);
  });
  //此时才能用Model操作，否则报错
};

PersonDAO.prototype.findByMobile = function (mobile, callback) {

  console.log('called Person findOne by mobile' + mobile);//mobile
  Personmodel.findOne({'mobile': mobile}, function (err, obj) {
    callback(err, obj);
    console.log(' Person findout:' + obj);
  });
};

PersonDAO.prototype.addpersonCheckwork = function (mobile, callback) {

  console.log('called Person findOne by mobile' + mobile);//mobile
  Personmodel.findOne({'mobile': mobile}, function (err, obj) {
    callback(err, obj);
    console.log(' Person findout:' + obj);
  });
};


//为指定用户添加新的定位点
PersonDAO.prototype.addNewLocation = function (personId, locationObj, outcallback) {
  try {
    var callback = outcallback ? outcallback : function (err, obj) {
      //console.log('callback指定用户添加新的定位点：'+locationObj);
    };
// //console.log('called Person addNewLocation by personId:'+personId+'<>'+locationObj);
    if (locationObj) {
// console.log('\n添加坐标点location:'+personId+'<>'+locationObj.geolocation.type+"完整的坐标对象"+JSON.stringify(locationObj));
      if (locationObj.geolocation.type) locationObj.geolocation = locationObj.geolocation.type;
    }
    Personmodel.find({'_id': personId}, function (err, personObjs) {
      if (!err) {
        var personObj = personObjs[0];
        locationObj.person = personId;
        var newlocation = new locationmodel(locationObj);
        if (personObj) {
          if (!(personObj.personlocations && personObj.personlocations.length > 0))
            personObj.personlocations = new Array();
          personObj.personlocations.push(newlocation);
          newlocation.save(function (err, obj) {
            if (err) {
              console.log('用户添加新坐标点：' + personObj.name + ' fail:' + err);
              callback(err, null);
            }
            else {
              personObj.save(function (err, obj) {
                if (err) {
                  console.log('用户添加新坐标点：' + personObj.name + ' fail:' + err);
                  callback(err, null);
                }
                else {
                  console.log('用户添加新坐标点：' + personObj.name + ' Person new location added!');
                  callback(err, personObj);
                }
              });
            }
          })
        }

      } else {
        callback(err, null);
        console.log(' Person new location err:' + err);
      }
    });
  } catch (e) {
    // handle errors here

    console.log(" 用户定位点上传出错：" + e);
    return;
  }
};

//验证用户是否存在
PersonDAO.prototype.provingperson = function (idNum, name, sex, callback) {
  var ops = {idNum: idNum};
  name ? ops.name = name : '';
  Personmodel.findOne(ops, {personlocations: 0}, function (err, obj) {
    if (obj) {
      Personmodel.update({_id: obj._id}, {status: 1}, function (err, uobj) {
        if (uobj) {
          callback(null, obj);
        } else {
          callback(err)
        }
      })
    } else {
      callback('没有此人信息')
    }
  })
}
//获取某一状态的人员
PersonDAO.prototype.getpersonstate = function (status, callback) {
  Personmodel.find({status: status}, {personlocations: 0}, function (err, obj) {
    if (err) {
      callback(err)
    } else {
      console.log('几次')
      callback(null, obj)
    }
  })
};
//修改人员手机uuid
PersonDAO.prototype.sendupdatemobileuuid = function (id, mobileid, callback) {
  Personmodel.update({_id: id}, {mobileUUid: mobileid}, function (err, obj) {
    if (err) {
      callback(err)
    } else {
      callback(null, obj)
    }
  })
};
//修改人员手机uuid和密码
PersonDAO.prototype.sendpwdandmobileuuid = function (id, pwd, mobileid, callback) {
  Personmodel.update({_id: id}, {mobileUUid: mobileid, pwd: pwd}, function (err, obj) {
    if (err) {
      callback(err)
    } else {
      callback(null, obj)
    }
  })
};
//根据职务获取人员
PersonDAO.prototype.gettitleToperson = function (title, callback) {
  Personmodel.find({title: title}, {personlocations: 0, images: 0}, function (err, obj) {
    if (err) {
      callback(err)
    } else {
      callback(null, obj)
    }
  })
}

//根据职务数组获取人员
PersonDAO.prototype.gettitleIdsToperson = function (titles, callback) {
  console.log('gettitleIdsToperson 查询所有title:' + titles + "titles[0]:" + titles[0]);
  if (!(titles.length && titles.length > 0)) {
    console.log('gettitleIdsToperson titles:' + titles);
    return;
  }
  // {$in:title},{personlocations:0,images:0}
  Personmodel.find({"title": {$in: titles}}, {personlocations: 0, images: 0}, function (err, obj) {
    if (err) {
      // console.log('1gettitleIdsToperson 查询所有title:'+titles+'发送的消息:'+obj+'发送的错误:'+err);
      callback({error: err}, null)
    } else {
      // console.log('2gettitleIdsToperson 查询所有title:'+titles+'发送的消息:'+obj+'发送的错误:'+err);
      callback(null, obj)
    }
  })
}

//添加人员职务
PersonDAO.prototype.sendpersontitle = function (id, title, callback) {
  Personmodel.update({_id: id}, {title: title}, function (err, obj) {
    if (err) {
      callback(err)
    } else {
      callback(null, obj)
    }
  })
}
//修改人员密码
PersonDAO.prototype.updatepersonpassword = function (id, idNum, opwd, npwd, callback) {
  //console.log(ID,start)
  Personmodel.findOne({_id: id}, {personlocations: 0}, function (err, obj) {
    if (err) {
      callback({error: err}, null);
    } else {
      console.log(obj)
      if (obj && obj.pwd) {
        if (obj.pwd == opwd) {//可以修改
          Personmodel.update({_id: id}, {pwd: npwd}, function (err, nobj) {
            callback(err, nobj)
          })
        } else {//原密码输入错误
          callback({error: '原密码错误'}, null)
        }
      } else {//之前没设置密码，直接修改
        Personmodel.update({_id: id}, {pwd: npwd}, function (err, nobj) {
          callback(err, nobj)
        })
      }
    }
  });
};
//判断人员密码是否正确
PersonDAO.prototype.ispersonpassword = function (id, pwd, callback) {
  //console.log(ID,start)
  Personmodel.findOne({_id: id}, {personlocations: 0}, function (err, obj) {
    if (err) {
      callback(null);
    } else {

      if (obj && obj.pwd) {
        console.log(obj.pwd, pwd)
        if (obj.pwd == pwd) {//可以修改
          callback(null, obj)
        } else {//原密码输入错误
          callback('密码输入错误')
        }
      } else {
        callback('用户没有设置密码')
      }
    }
  });
};
//修改人员信息
PersonDAO.prototype.updatepersoninfo = function (id, json, callback) {
  Personmodel.update({_id: id}, json, function (err, nobj) {
    if (err) {
      callback(err)
    } else {
      callback(null, nobj)
    }
  })
}

//得到人员的极光id
PersonDAO.prototype.getIMid = function (id, callback) {
  //console.log(ID,start)
  Personmodel.findOne({_id: id}, {personlocations: 0, images: 0}, function (err, obj) {
    if (err) {
      callback({error: err}, obj);
    } else if (obj && obj.IMid) {
      callback(null, obj.IMid);
    } else {
      callback({error: "此人没有极光id"}, obj);
    }
  });
};

//设置人员的极光id
PersonDAO.prototype.setIMid = function (id, IMid, callback) {
  //console.log(ID,start)
  Personmodel.update({_id: id}, {"IMid": IMid}, function (err, nobj) {
    if (err) {
      callback({error: err}, obj);
    } else {
      callback(null, nobj);
    }
  });
};


//获取考勤人员位置和时间信息
PersonDAO.prototype.getpersondaycheck = function (startDate, endDate, callback) {
  //var date=new Date();
  //new Date(date.setDate(date.getDate()-1));
  //console.log(date,new Date())
  //console.log(startDate,endDate)
  Personmodel.aggregate()
    .unwind("personlocations")
    .match({
        "personlocations.positioningdate": {
          "$gte": startDate,
          "$lt": endDate
        }
      }
    ).group(
    {
      "_id": "$_id",
      "personlocations": {$push: "$personlocations"}
    }
  ).exec(function (err, obj) {
    if (!err) {
      //for(var i=0;i<obj.length;i++){

      callback(err, obj)
      //}
    }
  })
}
//根据部门查找人员
//获取所有用户  批量修改status
PersonDAO.prototype.getAllUser = function (callback) {
  Personmodel.find({}, {personlocations: 0, images: 0}).exec(function (err, obj) {
      if (!err) {
        callback(err, obj)
      }
    }
  )
}


//获取人员统计信息
PersonDAO.prototype.getPersonStatistics = function (startDate, endDate, callback) {
  //var date=new Date();
  //new Date(date.setDate(date.getDate()-1));
  //console.log(date,new Date())
  //console.log(startDate,endDate)
  Personmodel.aggregate()
    .unwind("personlocations")
    .match({
        "personlocations.positioningdate": {
          "$gte": startDate,
          "$lt": endDate
        }
      }
    ).group(
    {
      "_id": "$_id",
      "personlocations": {$push: "$personlocations"}
    }
  ).exec(function (err, obj) {
    if (!err) {
      //for(var i=0;i<obj.length;i++){

      callback(err, obj);
      //}
    }
  })
};


PersonDAO.prototype.countByPerson = function (personId, sTime, eTime, countType, timespan, outcallback) {

  // console.log('1countType countByPerson ：<>'+personId);

  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback countByPerson 出错：' + '<>' + err);
    } else {
      // console.log('3countType countByPerson ：'+'<>'+countType);
      console.log('callback countByPerson 成功：' + '<>' + JSON.stringify(obj));
    }
  };

  if (!personId || !sTime || !eTime || !countType || !timespan) {
    callback({error: "统计参数不完整"}, null)
  }
// 只支持一种统计类型，就是计算不同时间比例尺内的定位数据总数
  switch (countType) {
    case "counts":
      // console.log('2countType countByPerson ：'+'<>'+countType);
      Personmodel.aggregate()
        .match({
            "_id": mongodb.mongoose.Types.ObjectId(personId)
          }
        )
        .unwind("personlocations")
        // .unwind("personlocations.positioningdate")
        .match({
            "personlocations.positioningdate": {
              "$gte": new Date(sTime),
              "$lte": new Date(eTime)
            }
          }
        )
        .project(
          {
            day: {$substr: [{"$add": ["$personlocations.positioningdate", 28800000]}, 0, 10]},//时区数据校准，8小时换算成毫秒数为8*60*60*1000=288000后分割成YYYY-MM-DD日期格式便于分组
            week: {$week: "$personlocations.positioningdate"},
            month: {$month: "$personlocations.positioningdate"},
            "positions": {
              $cond: {
                if: {$and: [{$not: {$not: "$personlocations.geolocation"}}, {$ne: ["$personlocations.geolocation", null]}, {$ne: ["$personlocations.geolocation", ""]}]},
                then: 1,
                else: 0
              }
            },
            // 这里是判断上午有多少定位点
            "morning": {
              $cond: {
                if: {
                  $and: [{$not: {$not: "$personlocations.geolocation"}}, {$ne: ["$personlocations.positioningdate", null]}, {$ne: ["$personlocations.positioningdate", ""]},
                    {$gte: [{$hour: "$personlocations.positioningdate"}, 8]},
                    {$lte: [{$hour: "$personlocations.positioningdate"}, 12]}]
                }, then: 1, else: 0
              }
            },
            // 这里是判断下午有多少定位点
            "afternoon": {
              $cond: {
                if: {
                  $and: [{$not: {$not: "$personlocations.geolocation"}}, {$ne: ["$personlocations.positioningdate", null]}, {$ne: ["$personlocations.positioningdate", ""]},
                    {$gte: [{$hour: "$personlocations.positioningdate"}, 15]},
                    {$lte: [{$hour: "$personlocations.positioningdate"}, 18]}]
                }, then: 1, else: 0
              }
            },
            "name": "$name"
          }
        )
        .group(
          {
            // _id : "$day",//按天统计
            // _id : "$week",//按周统计
            // _id : "$month",//按月统计
            _id: "$" + timespan,//按设定统计
            // dd:"$textTT",
            all: {$sum: 1},//一个timespan内的所有定位点
            positionsCount: {$sum: "$positions"},//一个timespan内的所有定位点
            morningpositionsCount: {$sum: "$morning"},//一个timespan内的上午定位点
            afternoonpositionsCount: {$sum: "$afternoon"},//一个timespan内的下午定位点
            name: {$first: "$name"}//统计人员的姓名
          }
        ).sort(
        {_id: 1}
      ).exec(function (err, obj) {
        if (!err) {
          //for(var i=0;i<obj.length;i++){

          callback(err, obj);
          //}
        } else {
          callback(err, null);
        }
      })
      break;


    default:
      break;
  }
}


var daoObj = new PersonDAO();
//
//var locationObj = {
//  positioningdate: new Date(),
//  SRS: '4321',
//  geolocation: [119, 37]
//};
//daoObj.addNewLocation('58c043cc40cbb100091c640d', locationObj);

// 测试
// daoObj.getPersonLatestPosition('58c043cc40cbb100091c640d');
// daoObj.getWorkmatesByUserId('58c043cc40cbb100091c640d');
// ObjectId("58bff0836253fd4008b3d41b"),ObjectId("58cb3361e68197ec0c7b96c0")ObjectId("58c1d1cb278a267826a236aa")
// daoObj.getWorkmatesByUserId('58c1d1cb278a267826a236aa');
// daoObj.getUserPicById('58c043cc40cbb100091c640d');
// daoObj.countByPerson("594cc13fc6178a040fa76063","2017-06-24","2017-07-10","counts","day",null);
module.exports = daoObj;