var mongodb = require('./mongodb');
var DepartmentModule = require('./departmentschema');//文件名用小写
var db = mongodb.mongoose.connection;
var PersonSchema = require('./personschema');//这里相当于PersonSchema的export，真正要引用PersonSchema，应该这样PersonSchema.PersonSchema


var select = require('xpath.js'),
  dom = require('xmldom').DOMParser;

var Personmodel = PersonSchema.Personmodel;
var Promise = require('bluebird');
//var personDao=new personDAO.save();
var fs = require('fs')
  , co = require('co')
  , thunkify = require('thunkify');


db.on('error', console.error.bind(console, '连接错误:'));
db.on('open', function () {
  console.log('mongodb DepartmentSchema connection is ok!:' + mongodb);
});


var Departmentmodel = DepartmentModule.Departmentmodel;
//Departmentmodel= mongodb.mongoose.model("Department", DepartmentSchema);
console.log('mongodb Department model is ok?:' + mongodb.mongoose.model("Department"));
//for(var i in Department){console.log("Department model items："+i+"<>")};
/*
 new Schema({
 //部门名称
 name : String,
 //部门一把手，类型当然是person
 leader : PersonSchema,
 //部门副手，数组，类型也是person
 deputyleader : [PersonSchema],
 //部门直属成员
 persons : [PersonSchema],
 //部门下属部门
 //subDepartment:[DepartmentSchema],//通过tree插件直接指定，用法见https://github.com/briankircho/mongoose-tree
 //部门介绍
 info: String,
 //成立时间
 create_date : { type: Date, default: Date.now},
 //废除时间
 delete_date : { type: Date, default: Date.now},
 //状态
 status:Number,//1,正常;0,删除;2解散
 //相关业务流程
 processes:Number,
 //详细链接
 infoLink:String

 });
 */
//这个DAO是为了方便系统应用使用，是对mongoose内部model对象方法的封装
var DepartmentDAO = function () {
};

DepartmentDAO.prototype.save = function (obj, callback) {
  //Departmentmodel.create();
  // 终端打印如下信息
  var instance = new Departmentmodel(obj);
  instance.save(function (err,iobj) {
    if(err){
      callback(err);
    }else{
      callback(null,iobj)
    }
  });
  //return instance.get('_id');
};
//获取上级部门ID
DepartmentDAO.prototype.getParent = function (obj, callback) {
  Departmentmodel.find({_id:obj},'path',function (err,obj) {
    if(err){
      callback(err);
    }else{
      callback(null,obj);
    }
  })
};
//添加上级部门path
DepartmentDAO.prototype.addparentpath=function(_id,path,callback){
  Departmentmodel.update({_id:_id},{path:path}, function (err,obj) {
    if(err){
      callback(err)
    }else{
      callback(null,obj)
    }
  })
}

DepartmentDAO.prototype.analysisXml = function (xml) {
  fs.readFile(xml, function (err, data) {
    if (err) {
      return console.log(err);
    }
    var xml = data.toString();
    var doc = new dom().parseFromString(xml)
    var newXml = select(doc, "//Data");
    var leader = [], isfor = false;
    for (var i = 0; i < newXml.length; i++) {
      var con = newXml[i].firstChild.data;
      var value = newXml[i].attributes[0].nodeValue;
      if (con.slice(0, 5) === '崖州区城市') {
        isfor = true;
        if (leader.length !== 0) {
          analysisXml(leader)
        }
        leader = [];
        leader.push(con)
      } else {
        leader.push(con)
      }
    }
    analysisXml(leader)

  });
  var analysisXml = function (e) {
    var classification = e[0].slice(8, 11);
    //console.log(classification)
    var b = 0, newtem = [], ks;
    for (var a = 0; a < e.length; a++) {
      if ((e[a] - 0 >= 1) && (e[a] - 0) < 10000) {//j如果是数字id
        var temporary = {};
        var post = ['局领导', '办公室', '法规办', '综合办', '巩卫办', '借调市巩卫办', '借调武装部', '办公室', '一中队', '二中队', '三中队', '四中队', '违停组'];
        if (post.indexOf(e[a + 1]) + 1) {
          ks = e[a + 1];
          temporary.ks = ks;
          a++;
        }
        temporary.name = e[a + 1];
        // temporary.role = e[a + 3];//职务
        if (e[a + 4].length === 11) {
          temporary.mobile = e[a + 4];//手机号
        }
        if (e[a + 5].length === 18) {
          temporary.idNum = e[a + 5];
        }
        if (e[a + 6] && (e[a + 6].length === 18)) {
          temporary.idNum = e[a + 6];
        }

        temporary.role = 'worker';
        ks ? (temporary.title = {department: e[0].substring(8, e[0].length - 3), post: ks, job: e[a + 3]}):(temporary.title = {department: e[0].substring(8, e[0].length - 3),job: e[a + 3]});
        newtem.push(temporary);
        b++;
      }
    }
    //console.log(newtem);
    switch (classification) {
      case '机关通':
        analysisLeader(newtem);
        break;
      case '执法一':
        analysislegalone(newtem);
        break;
      case '执法二':
        analysislegaltwo(newtem);
        break;
      case '执法三':
        analysislegalthree(newtem);
        break;
      case '执法机':
        analysisManeuver(newtem);
        break;
      case '市容督':
        analysisinspect(newtem);
        break;
    }
  }
  var addpersonfun = function (data,two) {
    var twogroup=[],threegroup=[];
    data.forEach(function(val,key) {
      if (val.title.post===undefined) {
          twogroup.push(val);
      } else {
        if (val.title.post === two) {
          twogroup.push(val);
        } else {
          threegroup.push(val);
        }
      }
    })
    //console.log(threegroup)
    addperson('崖州区的城市管理机构',twogroup);
    if(threegroup.length) {
      addperson('崖州区的城市管理机构下属部门',threegroup);
    }
  }
  var addperson=function(info,dement){
    var count=0;
    var tianjia=function(){
      DepartmentDAO.prototype.addperson(info, dement[count],function(err,obj){
        if(!err){
          count++;
          console.log(obj);
          if(count<dement.length) {
            console.log('再次执行')
            tianjia();
          }else{
            console.log('添加完成')
          }
        }
      })
    }
    tianjia();
  }
  var analysisLeader = function (data) {
    //var onegroup=[],twogroup=[];
    ////addperson('崖州区的行政管理最高机构',a.局领导)
    //data.forEach(function(val,key){
    //  if(val.title.post==='局领导') {
    //    onegroup.push(val);
    //  }else{
    //    twogroup.push(val);
    //  }
    //})
    //addperson('崖州区的行政管理最高机构',onegroup);
    //addperson('崖州区的城市管理机构',twogroup);
  }
  var analysislegalone = function (data) {
    //addpersonfun(data,'办公室')
  };
  var analysislegaltwo = function (data) {
    //addpersonfun(data,'办公室')//办公室为二级导入数据
  };
  var analysislegalthree = function (data) {
    //addpersonfun(data,'办公室')
  };
  var analysisManeuver = function (data) {
    //addpersonfun(data,'办公室')
  };
  var analysisinspect = function (data) {
    //addpersonfun(data)
  };
};
//DepartmentDAO.prototype.analysisXml('allperson.xml');
DepartmentDAO.prototype.addperson = function (info, obj, callback) {

  //for(var i=0;i<obj.length;i++) {
    Personmodel.find({$or: [{idNum: obj.idNum}, {mobile: obj.mobile}]},{personlocations: 0}, function(err, coo) {
      if (!err) {
        var personID = coo[0]._id;
        Departmentmodel.find({info: info}, function (err, obj) {
          if (!err) {
            var person = obj[0].persons;
            person.push({person:personID,role: 'worker'})
            //console.log(person)
            // 将此人加入此单位
            Departmentmodel.update({info: info}, {persons:person}, function (err, docs) {//更新
              if (err) {
                //callback(err, null);
              }
              else {
                //Personmodel.saveandRegister(coo[0],obj[0]._id)
                //console.log(obj[0]._id)
                callback(null, docs);
              }
            })
          }
        })
      }
    })
}

//根据名字找单位
DepartmentDAO.prototype.findByName = function (name, callback) {
  Departmentmodel.findOne({name: name}, function (err, obj) {
    callback(err, obj);
  });
};

//刷新数据库,添加三个默认测试单位
DepartmentDAO.prototype.refreshDatabase = function (callback) {
  //console.log('数据库初始化单位，会全部删除再建:');
  // Departmentmodel.findAll().remove();

  var yazhoudepartment = {
    //部门名称
    name: '崖州区政府',
    //部门下属部门
    //subDepartment:[DepartmentSchema],//通过tree插件直接指定，用法见https://github.com/briankircho/mongoose-tree
    //部门介绍
    info: '崖州区的行政管理最高机构',
    //成立时间
    // create_date :  Date.now,
    //废除时间
    // delete_date : { type: Date, default: Date.now},
    //状态
    status: 1,//1,正常;0,删除;2解散
    //相关业务流程
    // processes:Number,
    //详细链接
    infoLink: 'http://news.sohu.com/'
  };
  var yazhouchengshidepartment = {
    //部门名称
    name: '崖州区城市管理局',
    //部门下属部门
    //subDepartment:[DepartmentSchema],//通过tree插件直接指定，用法见https://github.com/briankircho/mongoose-tree
    //部门介绍
    info: '崖州区的城市管理机构',
    //成立时间
    // create_date :  Date.now,
    //废除时间
    // delete_date : { type: Date, default: Date.now},
    //状态
    status: 1,//1,正常;0,删除;2解散
    //相关业务流程
    // processes:Number,
    //详细链接
    infoLink: 'http://news.baidu.com/'
  };
  var disanjiyazhouchengshidepartment = {
    //部门名称
    name: '崖州区城市管理局下属部门12',
    //部门下属部门
    //subDepartment:[DepartmentSchema],//通过tree插件直接指定，用法见https://github.com/briankircho/mongoose-tree
    //部门介绍
    info: '崖州区的城市管理机构下属部门',
    //成立时间
    // create_date :  Date.now,
    //废除时间
    // delete_date : { type: Date, default: Date.now},
    //状态
    status: 1,//1,正常;0,删除;2解散
    //相关业务流程
    // processes:Number,
    //详细链接
    infoLink: 'http://news.baidu.com/'
  };


// 要删除的条件
  var del = {};

  Departmentmodel.remove(del, function (err, result) {
    if (err) {
      //console.log(err);
    } else {
      //console.log("update");
    }
  });

  var instance = new Departmentmodel(yazhoudepartment);
  var chengshiinstance = new Departmentmodel(yazhouchengshidepartment);
  var dichengshiinstance = new Departmentmodel(disanjiyazhouchengshidepartment);
  //console.log('已经生成了两级节点:');
//先存父母节点，再存子节点

//
// chengshiinstance.save(function(err){
//     //console.log('初始存一次save Department'+chengshiinstance+' fail:'+err);
// });


  instance.save().then(function (err) {
      // //console.log('初始化save Department'+instance+' fail:'+err+'层次：'+instance.level);
      var temp = Departmentmodel.findOne(
        {name: '崖州区政府'}, function (err, obj) {
          //console.log('查出来的父节点 Department'+obj);
          //console.log('指定父节点');

          chengshiinstance.parent = obj;
          chengshiinstance.save().then(
            function (err) {
              //console.log('指定父节点之后再存一次 Department'+chengshiinstance+' fail:'+err+'层次：'+chengshiinstance.getLevel());
              var temp = Departmentmodel.findOne({name: '崖州区城市管理局'}, function (err, obj) {
                  //console.log('查出来的父节点 崖州区城市管理局'+obj);
                  dichengshiinstance.parent = obj;
                  dichengshiinstance.save().then(function (err) {

                    callback(err);
                  });
                }
              );
            }
          );
        }
      );
      // //console.log("查出来的父节点："+temp._id+"《》"+temp.name);

    }
  );
};


DepartmentDAO.prototype.getLeadersByDepartmentID = function (id, callback) {
  Departmentmodel.findOne({_id: id}, function (err, departmentObt) {
    if (!err) {
      var leaders = departmentObt.deputyleader.slice();//复制副主任序列
      leaders.unshift(departmentObt.leader);//将主任加到领导序列的最前
      callback(err, leaders);//发给调用函数
    } else {
      callback(err, null);
    }
  });
};

//得到此部门的全部人员
DepartmentDAO.prototype.getPersonsByDepartmentID = function (id, callback) {
  Departmentmodel.findOne({_id: id}, function (err, departmentObt) {
    if (!err) {
      var person=departmentObt.persons;
      for(var i=0,arr=[];i<person.length;i++){
        arr.push(person[i].person)
      }
      Personmodel.find({_id:{$in:arr}},{personlocations:0,pwd:0},function(err,person){
        if(err){
          callback(err, null);
        }else{
          callback(null,person);
        }
      })
    } else {
      callback(err, null);
    }
  });
};

//得到下属部门
DepartmentDAO.prototype.getSubsByDepartmentID = function (id, callback) {
  Departmentmodel.findOne({_id: id}, function (err, departmentObt) {
    if (!err) {
      departmentObt.getChildren(function (err, subDepartments) {
        // users is an array of with the bob document
        callback(err, subDepartments);
      });
    } else {
      callback(err, null);
    }
  });
};

//删除一个下属部门,不能真的删除,而是要将此节点排除在外
//如果没有上级部门,自己删除?


//得到所有部门
DepartmentDAO.prototype.getAllDepartment = function (callback) {

  Departmentmodel.findAll(function (err, obj) {

    //console.info('查询出来的单位总数：'+obj);
    var rootdpts = new Array();
    if (obj.length && obj.length > 0) {
      for (var index = 0; index < obj.length; index++) {
        if (obj[index].level != 0) {

        } else {
          rootdpts.push(obj[index]);
        }
      }
    }
    //此时才能用Model操作，否则报错
    callback(err, rootdpts);
  });
};

//得到所有有效的部门
DepartmentDAO.prototype.getAllDepartments = function (outcallback) {
  //console.log('called getAllDepartments :');

  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getAllDepartments 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        //console.log('callback getAllDepartments 成功：'+'<>'+obj[index]);
        if (obj.name) {

          //console.log('callback getAllDepartments 成功：'+'<>'+obj[index]._id+'<>'+obj[index].name);
        }
      }
    }
  };
  //找到所有有效状态的部门
  Departmentmodel.find({status: 1}, {persons: 0}, function (err, obj) {
    if (!err) {

      callback(err, obj);
    }
    else {

      callback(err, null);
    }
  });
  //此时才能用Model操作，否则报错
};

var alljson = new Array();
var recursiveGetAllChildren = Promise.promisify(function (curDepart, callback) {
  var opts = [{
    path: 'persons.person'
    //上下两种写法效果一样，都可以将关联查询的字段进行筛选
    // ,
    // select : '-personlocations'
    ,
    select: {personlocations: 0}
  }];
  curDepart.populate(opts, function (err, populatedDoc) {
    var personsunder = populatedDoc.persons;//[index].department.name

    // //console.log("把有人员的整个单位秀一下：" + populatedDoc);
    // for(var index=0;index<personsunder.length;index++)
    // {
    //     //console.log("单位关联的用户："+personsunder[index].person);
    //     //console.log("填充的单位"+curDepart.name+"<>填充的人员"+personsunder[index].person.name);  // post-by-aikin
    // }
    // 第一个指示是否递归查询，后一个是处理函数
    // 不能递归，原因是我们要自己进行人员查询
    populatedDoc.getChildren(false
      , function (err, childrendeparts, parent) {
        // childrendeparts.
        parent.Departments = new Array();

        for (var index = 0; index < childrendeparts.length; index++) {
          var item = childrendeparts[index];
          parent.Departments.push(item);
          // var populatedDepart=
          // 即使采用了全局变量，异步调用导致递归的返回值完全不知道何时收敛，而如果把res对象作为回调，只要调用一次，网络通信就结束了
          recursiveGetAllChildren(item, callback).then(function (data) {
            }
          ).catch(function (err) {
              //console.log('promise调用：'+err);
            });
        }
        // parent.Departments=childrendeparts;
        // //console.log("把整个单位秀一下：" + parent);
        callback(parent);
        // return parent;
        // //console.log("把下属单位秀一下："+childrendeparts);
      }
    );
  });
});

// 这是一个错误的思路，nodejs应该全部用异步的思路解决问题，因为mongoose的查询也是异步的，所以递归查询结束把整体文档发到客户端的想法是有问题的
// 据用户id得到一个部门的全部下级部门和人员,如果不同层级的管理员登陆,只能看到自己管理的那个层级,比如公安局就只能看到公安局的
DepartmentDAO.prototype.getAllByUserid = function (userId, outcallback) {
  //console.log('called getAllByUserid userId:'+userId);
  // find返回的是一个数组，用findOne好像不能直接用populate了
  Personmodel.find({_id: userId}).populate('departments.department').exec(function (err, users) {
    var userC = users[0];
    // console.log(userC)
    // var outputJson=new Array();
    alljson = [];
    for (var index = 0; index < userC.departments.length; index++) {
      // //console.log("用户关联的单位："+userC.departments[0]+"<>"+userC.name);//[index].department.name
      var curDepart = userC.departments[index].department;
      // var innercallback=function (outcallback) {
      //     outcallback()
      // };
      // innercallback.prototype.json={};
      // var all =
      recursiveGetAllChildren(curDepart, outcallback).then(function (data) {
          // parent.Departments.push(data);
          alljson.push(data);
          //console.log("最终的所有单位、人员：："+alljson);//[index].department.name
          outcallback(alljson);
        }
      ).catch(function (err) {
          //console.log('promise调用：'+err);
        });
    }
    // callback(err,outputJson);
  }).then(function () {
    // return;
  });

  //此时才能用Model操作，否则报错
};

// 得到一个部门的下级（递归）部门和人员，单异步操作
DepartmentDAO.prototype.getAllchildrenDepartmentsByDobj = function (curDepartId, outcallback, startObj) {
  // //console.log('called getAllchildrenDepartmentsByDobj userId:'+curDepartId);
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getAllchildrenDepartmentsByDobj 出错：'+'<>'+err);
    } else {
      if (obj) {
        if (obj.Departments) {
          for (var index = 0; index < obj.Departments.length; index++) {
            //console.log('callback getAllchildrenDepartmentsByDobj 成功：'+'<>'+obj.Departments[index].name);
            var ppsd = obj.Departments[index].persons;
            if (ppsd) {
              for (var indexk = 0; indexk < ppsd.length; indexk++) {
                //console.log('callback getAllchildrenDepartmentsByDobj persons成功：'+'<>'+ppsd[indexk].person.name);
              }
            }
            if (obj.Departments[index].Departments) {
              for (var indexd = 0; indexd < obj.Departments[index].Departments.length; indexd++) {
                //console.log('callback getAllchildrenDepartmentsByDobj 成功：'+'<>'+obj.Departments[index].Departments[indexd].name);
                var ppsdd = obj.Departments[index].Departments[indexd].persons;
                if (ppsdd) {
                  for (var indext = 0; indext < ppsdd.length; indext++) {
                    //console.log('callback getAllchildrenDepartmentsByDobj persons成功：'+'<>'+ppsdd[indext].person.name);
                  }
                }
              }
            }
          }
        }
        var pps = obj.persons;
        if (pps) {
          for (var indexq = 0; indexq < pps.length; indexq++) {
            //console.log('callback getAllchildrenDepartmentsByDobj persons成功：'+'<>'+pps[indexq].person.name);
          }
        }
      }
    }
  };
  var opts = [{
    path: 'persons.person'
    //上下两种写法效果一样，都可以将关联查询的字段进行筛选
    // ,
    // select : '-personlocations'
    ,
    select: {personlocations: 0}
  }];
  if (!curDepartId._id) {
    Departmentmodel.find({_id: curDepartId}).populate(opts).exec(
      function (err, departs) {

        var curDepart = departs[0];
        if (!curDepart.Departments)curDepart.Departments = new Array();
        curDepart.getChildren(false
          , function (err, childrendeparts) {
            // childrendeparts.

            for (var index = 0; index < childrendeparts.length; index++) {
              var item = childrendeparts[index];
              curDepart.Departments.push(item);

              if (startObj) {
                DepartmentDAO.prototype.getAllchildrenDepartmentsByDobj(item._id, callback, startObj);
              }
              else {
                DepartmentDAO.prototype.getAllchildrenDepartmentsByDobj(item, callback, curDepart);
              }

            }
            // 这样返回的值可以直接replace原来的节点
            if (childrendeparts.length < 1) {
              callback(err, startObj);
            }
          }
        );
      }
    );
  } else {
    var curDepart = curDepartId;
    if (!curDepart.Departments)curDepart.Departments = new Array();
    var opts = [{
      path: 'persons.person'
      //上下两种写法效果一样，都可以将关联查询的字段进行筛选
      // ,
      // select : '-personlocations'
      ,
      select: {personlocations: 0}
    }];
    curDepart.populate(opts, function () {
      curDepart.getChildren(false
        , function (err, childrendeparts) {
          //console.log('获取一个部门的子部门：'+curDepart.name+'<>'+childrendeparts);
          // childrendeparts.

          for (var index = 0; index < childrendeparts.length; index++) {
            var item = childrendeparts[index];
            curDepart.Departments.push(item);
            if (startObj) {
              DepartmentDAO.prototype.getAllchildrenDepartmentsByDobj(item._id, callback, startObj);
            }
            else {
              DepartmentDAO.prototype.getAllchildrenDepartmentsByDobj(item, callback, curDepart);
            }

          }
          // 这样返回的值可以直接replace原来的节点
          if (childrendeparts.length < 1) {
            callback(err, startObj);
          }
        }
      );
    });

  }


};

// 不递归，得到一个部门的下一级部门，单异步操作
DepartmentDAO.prototype.getAllchildrenDepartments = function (parentID, outcallback) {
  //console.log('called DepartmentDAO getAllchildrenDepartments parentID:'+parentID);
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getAllchildrenDepartments 出错：'+'<>'+err);
    } else {
      if (obj) {
        if (obj.Departments) {
          for (var index = 0; index < obj.Departments.length; index++) {
            //console.log('callback getAllchildrenDepartments 成功：'+'<>'+obj.Departments[index].name);
          }

        }
        if (obj.persons) {
          //console.log('callback getAllchildrenDepartments persons成功：'+'<>'+obj.persons);

        }
      }
    }
  };
  if (parentID) {
    Departmentmodel.find(
      {parent: parentID}).exec(
      function (err, departs) {
        var curDepart = {};
        if (!curDepart.Departments) curDepart.Departments = departs;
        // 这样返回的值可以直接replace原来的节点
        callback(err, curDepart);
      });
  } else {
    Departmentmodel.find(
      {parent: null}).exec(function (err, departs) {
        var curDepart = {};
        if (!curDepart.Departments)curDepart.Departments = new Array();
        for (var index = 0; index < departs.length; index++) {
          var item = departs[index];
          curDepart.Departments.push(item);
        }
        callback(err, curDepart);
      }
    );
  }


};


// 不递归，得到一个部门的下一级部门和人员，单异步操作
DepartmentDAO.prototype.getAllpersonsByDepartIdOneStep = function (curDepartId, outcallback) {
  //console.log('得到一个部门的下一级部门和人员，单异步操作called DepartmentDAO getAllchildrenDepartmentsByDobj userId:'+curDepartId);
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getAllpersonsByDepartIdOneStep 出错：'+'<>'+err);
    } else {
      if (obj) {
        if (obj.Departments) {
          for (var index = 0; index < obj.Departments.length; index++) {
            // console.log('callback getAllpersonsByDepartIdOneStep 成功：'+'<>'+obj.Departments[index].name);
          }

        }
        if (obj.persons) {
          // console.log('callback getAllpersonsByDepartIdOneStep persons成功：'+'<>'+obj.persons);
        }
      }
    }
  };
  var opts = [{
    path: 'persons.person'
    ,
    //上下两种写法效果一样，都可以将关联查询的字段进行筛选
    // ,
    // select : '-personlocations'images:0,
    match: {status: {$gt: 0}}
    ,
    select: {personlocations: 0, departments: 0, images: 0}
  }];
  Departmentmodel.find({_id: curDepartId}).populate(opts).exec(
    function (err, departs) {
      //注释的这一大段是用来取下级单位的
      // var curDepart=departs[0];
      // if(!curDepart.Departments)curDepart.Departments = new Array();
      // curDepart.getChildren(false
      //     , function (err, childrendeparts) {
      //         // childrendeparts.
      //
      //         for (var index = 0; index < childrendeparts.length; index++) {
      //             var item = childrendeparts[index];
      //             curDepart.Departments.push(item);
      //
      //         }
      //         // 这样返回的值可以直接replace原来的节点
      //         // if(childrendeparts.length<1){
      //         // }
      //     }
      // );
      if (!err) {
        if (departs.length > 0)
          callback(err, departs[0]);
        else
          callback(err, departs);
      }
      else {

        callback(err, null);
      }
    }
  );

};


// 得到一个用户所有涉及的部门，单异步操作
DepartmentDAO.prototype.getAllInvolvedDepartmentsByUserid = function (userId, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getAllInvolvedDepartmentsByUserid 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        //console.log('callback getAllInvolvedDepartmentsByUserid 成功：'+'<>'+obj[index]);
      }
      //console.log('callback getAllInvolvedDepartmentsByUserid 成功：'+'<>');
    }
  };

  var opts = [{
    path: 'departments.department',
    //上下两种写法效果一样，都可以将关联查询的字段进行筛选
    // ,
    // select : '-personlocations'
    // ,
    select: {_id: 1, name: 1, persons: 1, path: 1, create_date: 1}
  }];
  // find返回的是一个数组，用findOne好像不能直接用populate了
  Personmodel.find({_id: userId}).populate(opts).exec(
    function (err, users) {
      var userC = users[0];
      // //console.log("用户关联的单位："+userC.departments+"<>"+userC.departments[0]+"<>"+userC.name);
      // var outputJson=new Array();
      callback(err, userC.departments);
      // callback(err,outputJson);
    });
};

DepartmentDAO.prototype.updateById = function (Department, callback) {
  console.log('called Department update id:' + Department._id);

  var _id = Department._id; //需要取出主键_id
  delete Department._id;    //再将其删除
  Departmentmodel.update({_id: _id}, Department, function (err, obj) {
    callback(err, obj);
  });
  //此时才能用Model操作，否则报错
};

DepartmentDAO.prototype.findByMobile = function (mobile, callback) {

  console.log('called Department findOne by mobile' + mobile);
  Departmentmodel.findOne({'mobile': mobile}, function (err, obj) {
    callback(err, obj);
    console.log(' Department findout:' + obj);
  });
};
DepartmentDAO.prototype.getDepartmentgird=function(callback){

}

var dptObj = new DepartmentDAO();

// dptObj.getAllInvolvedDepartmentsByUserid('58c043cc40cbb100091c640d');
// dptObj.getAllchildrenDepartmentsByDobj('58c3a5e9a63cf24c16a50b8c');getAllpersonsByDepartIdOneStep
// dptObj.getAllpersonsByDepartIdOneStep('58c3a5e9a63cf24c16a50b8c');
// dptObj.getAllchildrenDepartments('58c3a5e9a63cf24c16a50b8c');
// dptObj.getAllDepartment();
module.exports = dptObj;