var mongodb = require('./mongodb');
var Casetypemodule = require('./casetypeschema');
var PersonSchema = require('./personschema');//这里相当于PersonSchema的export，真正要引用PersonSchema，应该这样PersonSchema.PersonSchema
var db = mongodb.mongoose.connection;
db.on('error',
  console.error.bind(console, '连接错误:')
);
db.once('open', function () {
  console.log('mongodb connection is ok!:a' + mongodb);
});


//console.log('mongodb Schema:'+Schema);
var Casetypemodel = Casetypemodule.Casetypemodel;
//console.log('mongodb Schema:++'+Casetypemodel);
var Personmodel = PersonSchema.Personmodel;

var CasetypeDAO = function () {
};
CasetypeDAO.prototype.save = function (obj, callback) {
  Casetypemodel.create();
  // 终端打印如下信息
  console.log('called Casetype save');
  var instance = new Casetypemodel(obj);
  console.log('instance.save:' + instance.name);
  instance.save(function (err) {
    console.log('save Casetype' + instance + ' fail:' + err);
    callback(err);
  });
};

CasetypeDAO.prototype.findByName = function (name, callback) {
  Casetypemodel.findOne({name: name}, function (err, obj) {
    callback(err, obj);
  });
};
CasetypeDAO.prototype.getAllCasetype=function(callback){//获取所有类型
    var callback = callback ? callback : function (err, obj) {
    if (err) {
      console.log('callback sendACasetype 出错：-' + '<>' + err);
    } else {
      console.log('callback sendACasetype 成功：-' + '<>' + obj);
    }
  };
   Casetypemodel.find({'status':1}).exec(function(err,obj){
      callback(err,obj)
   })
}
CasetypeDAO.prototype.sendACasetype = function (casetypeObj, outcallback) {

  console.log('添加数据');
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback sendACasetype 出错：-' + '<>' + err);
    } else {
      console.log('callback sendACasetype 成功：-' + '<>' + obj);
    }
  };

  // casetypeObj.sender=senderID;

  // casetypeObj.receiver=receiverID;
  casetypeObj.status = 1;
  console.log(casetypeObj);
  var newM = new Casetypemodel(casetypeObj);
  newM.save(function (err, uobj) {
    if (err) {
      console.log('callback sendACasetype 出错：' + '<>' + err);
      callback(err, null);
    } else {
      console.log('callback sendACasetype 成功：' + '<>' + uobj._id);
      callback(err, uobj);
    }
  });
};


CasetypeDAO.prototype.getMyNewestCasetype = function (receiverID, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getMyNewestCasetype 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback getMyNewestCasetype 成功：' + '<>' + obj[index]);
      }
      //console.log('callback getMyNewestCasetype 成功：'+'<>');
    }
  };

  var query = Casetypemodel.find({'receiver': receiverID, status: 0});
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

CasetypeDAO.prototype.getMyNewestCasetypeFromWho = function (receiverID, senderID, isAbstract, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback getMyNewestCasetypeFromWho 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback getMyNewestCasetypeFromWho 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {

        console.log('callback getMyNewestCasetypeFromWho 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  };

  var query = Casetypemodel.find({'receiver': receiverID, sender: senderID, status: 1}, {});
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
          // unreadcasetypes:docs
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

CasetypeDAO.prototype.casetypeDelete = function (name, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback casetypeDelete 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback casetypeDelete 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {
        console.log('callback casetypeDelete 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  };
  var query = Casetypemodel.remove({'name': name, status: 1}, {});
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
CasetypeDAO.prototype.casetypepeopleDelete = function (areaID, position, outcallback) {
  // var areaID=area.areaID;
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback casetypepeopleDelete 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback casetypepeopleDelete 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {
        console.log('callback casetypepeopleDelete 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  }
  // query=Casetypemodel.update({'name':name,status:1},{'persons':person.splice(id,1)},{});
  var query = Casetypemodel.find({_id: areaID, status: 1}, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      var person = result[0].persons;
      if (person && person.length && (person.length > (position))) {
        person.splice(position, 1)
        Casetypemodel.update({_id: areaID}, {$set: {'persons': person}}, function (err, res) {
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

CasetypeDAO.prototype.getCasetypesInATimeSpanFromWho = function (receiverID, senderID, startTime, endtime, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getCasetypesInATimeSpanFromWho 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        //console.log('callback getCasetypesInATimeSpanFromWho 成功：'+'<>'+obj[index]);
      }
      if (obj.abstract) {

        //console.log('callback getCasetypesInATimeSpanFromWho 成功：'+'<>'+obj.abstract+'<>'+obj.count+'<>'+obj.lastTime);
      }

    }
  };

  var query = Casetypemodel.find();
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
        //     unreadcasetypes:docs
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


CasetypeDAO.prototype.getMyUnreadCasetypesCount = function (receiverID, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getMyUnreadCasetypesCount 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        //console.log('callback getMyUnreadCasetypesCount 成功：'+'<>'+obj[index]);
      }
      //console.log('callback getMyUnreadCasetypesCount 成功：'+'<>未读消息数量:'+obj);
    }
  };

  var query = Casetypemodel.find({'receiver': receiverID, status: 0}, {_id: 1});
  query.exec(function (err, docs) {
    if (!err) {
      callback(err, docs.length);
    }
    else {
      callback(err, 0);
    }
  });
};


CasetypeDAO.prototype.readtCasetype = function (mid, outcallback) {

  console.log('a--------------------------------')
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback readtCasetype 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback readtCasetype 成功：' + '<>' + obj[index]);
      }
      console.log('callback readtCasetype 成功：' + '<>');
    }
  };

  Casetypemodel.findOne({name: mid.name}, function (err, obj) {
    if (!err && obj) {
      console.log('添加');
      console.log(mid.persons);
      Casetypemodel.update({name: mid.name}, {persons: mid.persons}, function (err, uobj) {
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


var casetypeObj = new CasetypeDAO();

// casetypeObj.sendACasetype({
//   name: '摩托车无证运营案',
//   info: 'null',
//   persons: [{
//     name: '张三'
//   }],
//   process: [
//     {
//       types: '1.立案审批表',
//       status: 1,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '2.现场检查记录',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '3.扣押物品',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '4.接受调查询问',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '5.询问（调查）笔录',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '6.现场示意图',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '7.行政处罚告知',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '8.行政处罚决定',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '9.解除扣押物品决定书',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '10.行政处罚案件结案报告',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }
//   ]
// });
// casetypeObj.sendACasetype({
//   name: '擅自挖掘城市道路案',
//   info: 'null',
//   persons: [{
//     name: '张三'
//   }],
//   process: [
//     {
//       types: '1.立案审批表',
//       status: 1,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '2.现场检查记录',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '3.扣押物品',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '4.接受调查询问',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '5.询问（调查）笔录',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '6.现场示意图',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '7.行政处罚告知',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '8.行政处罚决定',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '9.解除扣押物品决定书',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '10.行政处罚案件结案报告',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }
//   ]
// });
// casetypeObj.sendACasetype({
//   name: '占道经营案',
//   info: 'null',
//   persons: [{
//     name: '张三'
//   }],
//   process: [
//     {
//       types: '1.立案审批表',
//       status: 1,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '2.现场检查记录',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '3.扣押物品',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '4.接受调查询问',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '5.询问（调查）笔录',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '6.现场示意图',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '7.行政处罚告知',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '8.行政处罚决定',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '9.解除扣押物品决定书',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '10.行政处罚案件结案报告',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }
//   ]
// });
// casetypeObj.sendACasetype({
//   name: '运载沙土泄露污染路面案',
//   info: 'null',
//   persons: [{
//     name: '张三'
//   }],
//   process: [
//     {
//       types: '1.立案审批表',
//       status: 1,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '2.现场检查记录',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '3.扣押物品',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '4.接受调查询问',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '5.询问（调查）笔录',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '6.现场示意图',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '7.行政处罚告知',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '8.行政处罚决定',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '9.解除扣押物品决定书',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '10.行政处罚案件结案报告',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }
//   ]
// });
// casetypeObj.sendACasetype({
//   name: '无照经营案',
//   info: 'null',
//   persons: [{
//     name: '张三'
//   }],
//   process: [
//     {
//       types: '1.立案审批表',
//       status: 1,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '2.现场检查记录',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '3.扣押物品',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '4.接受调查询问',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '5.询问（调查）笔录',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '6.现场示意图',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '7.行政处罚告知',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '8.行政处罚决定',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '9.解除扣押物品决定书',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '10.行政处罚案件结案报告',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }
//   ]
// });
// casetypeObj.sendACasetype({
//   name: '无规划许可证擅自建设案',
//   info: 'null',
//   persons: [{
//     name: '张三'
//   }],
//   process: [
//     {
//       types: '1.立案审批表',
//       status: 1,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '2.现场检查记录',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '3.扣押物品',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '4.接受调查询问',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '5.询问（调查）笔录',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '6.现场示意图',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '7.行政处罚告知',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '8.行政处罚决定',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '9.解除扣押物品决定书',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '10.行政处罚案件结案报告',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }
//   ]
// });
// casetypeObj.sendACasetype({
//   name: '生猪屠宰案',
//   info: 'null',
//   persons: [{
//     name: '张三'
//   }],
//   process: [
//     {
//       types: '1.立案审批表',
//       status: 1,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '2.现场检查记录',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '3.扣押物品',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '4.接受调查询问',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '5.询问（调查）笔录',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '6.现场示意图',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '7.行政处罚告知',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '8.行政处罚决定',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '9.解除扣押物品决定书',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '10.行政处罚案件结案报告',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }
//   ]
// });
// casetypeObj.sendACasetype({
//   name: '设立废品收购点未备案',
//   info: 'null',
//   persons: [{
//     name: '张三'
//   }],
//   process: [
//     {
//       types: '1.立案审批表',
//       status: 1,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '2.现场检查记录',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '3.扣押物品',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '4.接受调查询问',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '5.询问（调查）笔录',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '6.现场示意图',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '7.行政处罚告知',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '8.行政处罚决定',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '9.解除扣押物品决定书',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }, {
//       types: '10.行政处罚案件结案报告',
//       status: 0,
//       create_time: new Date(),
//       delete_time: null
//     }
//   ]
// });


// ObjectId("58c96cb24fd511384b81cba5")ObjectId("58c043cc40cbb100091c640d")
// casetypeObj.getMyNewestCasetype("58c043cc40cbb100091c640d");
// casetypeObj.getMyUnreadCasetypesCount("58bff0836253fd4008b3d41b");
// casetypeObj.readtCasetype("58c85b9628b792000a779bfa");
// casetypeObj.sendACasetype(
//     {text:'这里有个事故kjhkjh123'},"58c043cc40cbb100091c640d","58cb2031e68197ec0c7b935b"
// );
// casetypeObj.getCasetypesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');

// casetypeObj.getMyNewestCasetypeFromWho("58c043cc40cbb100091c640d","58bff0836253fd4008b3d41b",false);
module.exports = casetypeObj;