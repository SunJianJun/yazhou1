var mongodb = require('./mongodb');
var Abstractstepmodule = require('./abstractstepschema');
var DepartmentSchema = require('./departmentschema');//这里相当于DepartmentSchema的export，真正要引用DepartmentSchema，应该这样DepartmentSchema.DepartmentSchema
var db = mongodb.mongoose.connection;
db.on('error',
  console.error.bind(console, '连接错误:')
);
db.once('open', function () {
  console.log('mongodb connection is ok!:' + mongodb);
});


//console.log('mongodb Schema:'+Schema);

var Abstractstepmodel = Abstractstepmodule.Abstractstepmodel;
//console.log('mongodb Schema:++'+Abstractstepmodel);
var Departmentmodel = DepartmentSchema.Departmentmodel; //部门 表模块

var AbstractstepDAO = function () {};

AbstractstepDAO.prototype.getpersonTiele=function (callback) {
  Departmentmodel.find({'status':1},'title', function (err, obj) {
    callback(err, obj);
  });
};
AbstractstepDAO.prototype.getstepsName=function(id,callback) {
  //console.log('查询数组')
  console.log(id)
  var query=Abstractstepmodel.find({'_id':{$in:id}},'type');
  var ops='type';
  query.sort({_id:1});
  query.exec(function (err, obj) {
    if(err){
      callback(err);
    }else{
      //console.log('返回数组')
      //console.log(obj)
      callback(null,obj);
    }
  });
};


AbstractstepDAO.prototype.updatepersonpower=function(id,json,callback) {
  Abstractstepmodel.remove({'_id':id},function(err,obj){
    if(err){

    }else{
      var newS=new Abstractstepmodel(json)
      newS.save(function (err, obj) {
        callback(err, obj);
      });
    }
  })
};
AbstractstepDAO.prototype.removepersonpower=function(id,callback) {
  Abstractstepmodel.update({'_id':id},{'status':0},function(err,obj){
    if(err){

    }else{
      callback(obj);
    }
  })
};

AbstractstepDAO.prototype.save = function (obj, callback) {
  Abstractstepmodel.create();
  // 终端打印如下信息
  console.log('called Abstractstep save');
  var instance = new Abstractstepmodel(obj);
  console.log('instance.save:' + instance.name);
  instance.save(function (err) {
    console.log('save Abstractstep' + instance + ' fail:' + err);
    callback(err);
  });
};

AbstractstepDAO.prototype.findByName = function (name, callback) {
  Abstractstepmodel.findOne({name: name}, function (err, obj) {
    callback(err, obj);
  });
};

AbstractstepDAO.prototype.sendAAbstractstep = function (abstractstepObj, outcallback) {

  console.log('添加数据');
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback sendAAbstractstep 出错：-' + '<>' + err);
    } else {
      console.log('callback sendAAbstractstep 成功：-' + '<>' + obj);
    }
  };

  // abstractstepObj.sender=senderID;

  // abstractstepObj.receiver=receiverID;
  abstractstepObj.status = 1;
  console.log(abstractstepObj);
  var newM = new Abstractstepmodel(abstractstepObj);
  newM.save(function (err, uobj) {
    if (err) {
      console.log('callback sendAAbstractstep 出错：' + '<>' + err);
      callback(err, null);
    } else {
      console.log('callback sendAAbstractstep 成功：' + '<>' + uobj._id);
      callback(err, uobj);
    }
  });
};


AbstractstepDAO.prototype.getMyNewestAbstractstep = function (receiverID, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getMyNewestAbstractstep 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback getMyNewestAbstractstep 成功：' + '<>' + obj[index]);
      }
      //console.log('callback getMyNewestAbstractstep 成功：'+'<>');
    }
  };

  var query = Abstractstepmodel.find({'receiver': receiverID, status: 0});
  var opts = [{
    path: 'sender'
    //上下两种写法效果一样，都可以将关联查询的字段进行筛选
    // ,
    // select : '-personlocations'
    ,
    select: {name: 1}
  }];
  query.populate(opts);
  // 排序，不过好像对子文档无效
  query.sort({'create_date': 1});//desc asc
  // query.limit(1);

  query.exec(function (err, docs) {
    if (!err) {
      callback(err, docs);
    }
    else {
      callback(err, null);
    }
  });
};

AbstractstepDAO.prototype.getMyNewestAbstractstepFromWho = function (receiverID, senderID, isAbstract, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback getMyNewestAbstractstepFromWho 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback getMyNewestAbstractstepFromWho 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {

        console.log('callback getMyNewestAbstractstepFromWho 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  };

  var query = Abstractstepmodel.find({'receiver': receiverID, sender: senderID, status: 1}, {});
  var opts = [{
    path: 'sender',
    //上下两种写法效果一样，都可以将关联查询的字段进行筛选
    // ,
    // select : '-personlocations'
    // ,'images':0
    select: {'name': 1}
  }];
  query.populate(opts);
  // 排序，不过好像对子文档无效
  query.sort({'create_date': 1});//desc asc
  // query.limit(1);

  query.exec(function (err, docs) {
    if (!err) {
      // 如果是需要摘要信息，而且指定来源的消息数量》0
      if (isAbstract && docs.length > 0) {
        var count = docs.length;
        var abstract = docs[docs.length - 1].text ? docs[docs.length - 1].text.substr(0, 6) + '...' : ((docs[docs.length - 1].image || docs[docs.length - 1].video || docs[docs.length - 1].voice) ? '多媒体消息...' : '....');
        var output = {
          sender: docs[docs.length - 1].sender, count: count, abstract: abstract,
          startTime: docs[0].create_date.Format("yyyy-MM-dd hh:mm:ss"),
          lastTime: docs[docs.length - 1].create_date.Format("yyyy-MM-dd hh:mm:ss")
          // ,
          // unreadabstractsteps:docs
        };
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

AbstractstepDAO.prototype.abstractstepDelete = function (name, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback abstractstepDelete 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback abstractstepDelete 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {
        console.log('callback abstractstepDelete 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  };
  var query = Abstractstepmodel.remove({'name': name, status: 1}, {});
  query.exec(function (err, docs) {
    if (!err) {
      // console.log(docs);
      callback(err, docs);
    }
    else {
      console.log('没有数据');
      callback(err, 0);
    }
  });
}
AbstractstepDAO.prototype.abstractsteppeopleDelete = function (areaID, position, outcallback) {
  // var areaID=area.areaID;
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback abstractsteppeopleDelete 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback abstractsteppeopleDelete 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {
        console.log('callback abstractsteppeopleDelete 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  }
  // query=Abstractstepmodel.update({'name':name,status:1},{'persons':person.splice(id,1)},{});
  var query = Abstractstepmodel.find({_id: areaID, status: 1}, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      var person = result[0].persons;
      if (person && person.length && (person.length > (position))) {
        person.splice(position, 1)
        Abstractstepmodel.update({_id: areaID}, {$set: {'persons': person}}, function (err, res) {
          if (!err) {

            console.log('修改');
            console.log(res);
            callback(err, res);
          }
          else {
            console.log('没有数据');
            callback(err, 0);
          }
        });
      }
    }
  });
}
AbstractstepDAO.prototype.getoneeventstep = function (ID,outcallback) {
  // var areaID=area.areaID;
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback getoneeventstep 出错：' + '<>' + err);
    } else {
        console.log('callback getoneeventstep 成功：' + '<>' + obj);
      }
    }
  var query = Abstractstepmodel.findOne({_id: ID, status: 1}, function (err, result) {
    if (err) {
      outcallback(err,null)
    } else {
      outcallback(null,result);
    }
  });
}
AbstractstepDAO.prototype.geteventsteps= function (ID,outcallback) {
  // var areaID=area.areaID;
  // console.log(ID)
  for (var i = 0, stepid = []; i <ID.length; i++) { //循环出人员id数组
    // console.log(obj.steps[i].step); //抽象步骤 id
      stepid.push(ID[i].step);
  }
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback geteventsteps 出错：' + '<>' + err);
    } else {
        console.log('callback geteventsteps 成功：' + '<>' + obj);
      }
    }
  var query = Abstractstepmodel.find({_id: {$in:stepid},status:1}, function (err, result) {
    if (err) {
      outcallback(err,null)
    } else {
      var result1=result;
      for(var a=0;a<result1.length;a++){
        for(var b=0;b<ID.length;b++){
          // console.log(result1[a]._id,ID[b].step)
          if(result1[a]._id==ID[b].step){
            // console.log('修改添加'+ID[b].no)
            result1[a].status=ID[b].no;
          }
        }
      }
      outcallback(null,result1);
    }
  });
}

AbstractstepDAO.prototype.getAbstractstepsInATimeSpanFromWho = function (receiverID, senderID, startTime, endtime, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getAbstractstepsInATimeSpanFromWho 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        //console.log('callback getAbstractstepsInATimeSpanFromWho 成功：'+'<>'+obj[index]);
      }
      if (obj.abstract) {

        //console.log('callback getAbstractstepsInATimeSpanFromWho 成功：'+'<>'+obj.abstract+'<>'+obj.count+'<>'+obj.lastTime);
      }

    }
  };

  var query = Abstractstepmodel.find();
  query.or([{
    'receiver': receiverID, sender: senderID, create_date: {
      "$gte": new Date(startTime),
      "$lt": new Date(endtime)
    }
  }, {
    'receiver': senderID, sender: receiverID, create_date: {
      "$gte": new Date(startTime),
      "$lt": new Date(endtime)
    }
  }]);
  var opts = [{
    path: 'sender'
    //上下两种写法效果一样，都可以将关联查询的字段进行筛选
    // ,
    // select : '-personlocations'
    // ,'images':0
    ,
    select: {'name': 1}
  }];
  query.populate(opts);
  // 排序，不过好像对子文档无效
  query.sort({'create_date': 1});//desc asc
  // query.limit(1);

  query.exec(function (err, docs) {
    if (!err) {
      // 如果是需要摘要信息，而且指定来源的消息数量》0
      if (docs.length > 0) {
        // var count=docs.length;
        // var abstract=docs[docs.length-1].text?docs[docs.length-1].text.substr(0,6)+'...':(docs[docs.length-1].image?'图片消息...':(docs[docs.length-1].video?'视频消息...':'....'));
        // var output={sender:docs[docs.length-1].sender,count:count,abstract:abstract,
        //     firstTime:docs[0].create_date.Format("yyyy-MM-dd hh:mm:ss"),
        //     lastTime:docs[docs.length-1].create_date.Format("yyyy-MM-dd hh:mm:ss"),
        //     unreadabstractsteps:docs
        // };
        callback(err, docs);
      }
      else {
        // 虽然没有错，但是也没有消息
        callback(err, null);
      }
    }
    else {
    }
  });
};


AbstractstepDAO.prototype.getMyUnreadAbstractstepsCount = function (receiverID, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getMyUnreadAbstractstepsCount 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        //console.log('callback getMyUnreadAbstractstepsCount 成功：'+'<>'+obj[index]);
      }
      //console.log('callback getMyUnreadAbstractstepsCount 成功：'+'<>未读消息数量:'+obj);
    }
  };

  var query = Abstractstepmodel.find({'receiver': receiverID, status: 0}, {_id: 1});
  query.exec(function (err, docs) {
    if (!err) {
      callback(err, docs.length);
    }
    else {
      callback(err, 0);
    }
  });
};


AbstractstepDAO.prototype.readtAbstractstep = function (mid, outcallback) {

  console.log('a--------------------------------')
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback readtAbstractstep 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback readtAbstractstep 成功：' + '<>' + obj[index]);
      }
      console.log('callback readtAbstractstep 成功：' + '<>');
    }
  };

  Abstractstepmodel.findOne({name: mid.name}, function (err, obj) {
    if (!err && obj) {
      console.log('添加');
      console.log(mid.persons);
      Abstractstepmodel.update({name: mid.name}, {persons: mid.persons}, function (err, uobj) {
        console.log(uobj);
        callback(err, uobj);
      });
    }
    else {
      console.log('添加失败');
      callback(err, null);
    }
  });
};
AbstractstepDAO.prototype.getAllAbstractstep=function(depart,callback){
  var callback = callback ? callback : function (err, obj) {
    if (err) {
      console.log('callback getAllAbstractstep 出错：-' + '<>' + err);
    } else {
      console.log('callback getAllAbstractstep 成功：-' + '<>' + obj);
    }
  };
  Abstractstepmodel.find({status:1,department:depart},'_id type',function(err,obj){
    callback(err,obj)
  })
}
AbstractstepDAO.prototype.geteventstepname=function(depart,callback){
  var callback = callback ? callback : function (err, obj) {
    if (err) {
      console.log('callback geteventstepname 出错：-' + '<>' + err);
    } else {
      console.log('callback geteventstepname 成功：-' + '<>' + obj);
    }
  };
  Abstractstepmodel.find({status:1,department:depart},function(err,obj){
    callback(err,obj)
  })
}

var abstractstepObj = new AbstractstepDAO();

// abstractstepObj.sendAAbstractstep({//抽象步骤
//   department:'城管所',
//   type:'立案',
//   argument:[{
//     argutype:'date',
//     name:'立案时间'
//   }],
//   wordTemplate:'<div class="panel-body">',
//   author:'123321',
//    power:{
//     new:'all',
//     backoff:'abc',
//     go:'cba'
// }
// });

module.exports = abstractstepObj;