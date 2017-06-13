var mongodb = require('./mongodb');
var Concreteabstractmodule = require('./concreteabstractschema');
var PersonSchema = require('./personschema');//这里相当于PersonSchema的export，真正要引用PersonSchema，应该这样PersonSchema.PersonSchema
var db = mongodb.mongoose.connection;
db.on('error',
  console.error.bind(console, '连接错误:')
);
db.once('open', function () {
  console.log('mongodb connection is ok!:a' + mongodb);
});


//console.log('mongodb Schema:'+Schema);

var Concreteabstractmodel = Concreteabstractmodule.Concreteabstractmodel;
//console.log('mongodb Schema:++'+Concreteabstractmodel);
var Personmodel = PersonSchema.Personmodel;

var ConcreteabstractDAO = function () {
};
ConcreteabstractDAO.prototype.save = function (obj, callback) {
  Concreteabstractmodel.create();
  // 终端打印如下信息
  console.log('called Concreteabstract save');
  var instance = new Concreteabstractmodel(obj);
  console.log('instance.save:' + instance.name);
  instance.save(function (err) {
    console.log('save Concreteabstract' + instance + ' fail:' + err);
    callback(err);
  });
};

ConcreteabstractDAO.prototype.findByName = function (name, callback) {
  Concreteabstractmodel.findOne({name: name}, function (err, obj) {
    callback(err, obj);
  });
};

ConcreteabstractDAO.prototype.sendAConcreteabstract = function (concreteabstractObj, outcallback) {

  console.log('添加数据');
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback sendAConcreteabstract 出错：-' + '<>' + err);
    } else {
      console.log('callback sendAConcreteabstract 成功：-' + '<>' + obj);
    }
  };

  // concreteabstractObj.sender=senderID;

  // concreteabstractObj.receiver=receiverID;
  concreteabstractObj.status = 1;
  console.log(concreteabstractObj);
  var newM = new Concreteabstractmodel(concreteabstractObj);
  newM.save(function (err, uobj) {
    if (err) {
      console.log('callback sendAConcreteabstract 出错：' + '<>' + err);
      callback(err, null);
    } else {
      console.log('callback sendAConcreteabstract 成功：' + '<>' + uobj._id);
      callback(err, uobj);
    }
  });
};


ConcreteabstractDAO.prototype.getMyNewestConcreteabstract = function (receiverID, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getMyNewestConcreteabstract 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback getMyNewestConcreteabstract 成功：' + '<>' + obj[index]);
      }
      //console.log('callback getMyNewestConcreteabstract 成功：'+'<>');
    }
  };

  var query = Concreteabstractmodel.find({'receiver': receiverID, status: 0});
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

ConcreteabstractDAO.prototype.getMyNewestConcreteabstractFromWho = function (receiverID, senderID, isAbstract, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback getMyNewestConcreteabstractFromWho 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback getMyNewestConcreteabstractFromWho 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {

        console.log('callback getMyNewestConcreteabstractFromWho 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  };

  var query = Concreteabstractmodel.find({'receiver': receiverID, sender: senderID, status: 1}, {});
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
          // unreadconcreteabstracts:docs
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

ConcreteabstractDAO.prototype.concreteabstractDelete = function (name, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback concreteabstractDelete 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback concreteabstractDelete 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {
        console.log('callback concreteabstractDelete 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  };
  var query = Concreteabstractmodel.remove({'name': name, status: 1}, {});
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
ConcreteabstractDAO.prototype.concreteabstractpeopleDelete = function (areaID, position, outcallback) {
  // var areaID=area.areaID;
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback concreteabstractpeopleDelete 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback concreteabstractpeopleDelete 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {
        console.log('callback concreteabstractpeopleDelete 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  }
  // query=Concreteabstractmodel.update({'name':name,status:1},{'persons':person.splice(id,1)},{});
  var query = Concreteabstractmodel.find({_id: areaID, status: 1}, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      var person = result[0].persons;
      if (person && person.length && (person.length > (position))) {
        person.splice(position, 1)
        Concreteabstractmodel.update({_id: areaID}, {$set: {'persons': person}}, function (err, res) {
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

ConcreteabstractDAO.prototype.getConcreteabstractsInATimeSpanFromWho = function (receiverID, senderID, startTime, endtime, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getConcreteabstractsInATimeSpanFromWho 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        //console.log('callback getConcreteabstractsInATimeSpanFromWho 成功：'+'<>'+obj[index]);
      }
      if (obj.abstract) {

        //console.log('callback getConcreteabstractsInATimeSpanFromWho 成功：'+'<>'+obj.abstract+'<>'+obj.count+'<>'+obj.lastTime);
      }

    }
  };

  var query = Concreteabstractmodel.find();
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
        //     unreadconcreteabstracts:docs
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


ConcreteabstractDAO.prototype.getMyUnreadConcreteabstractsCount = function (receiverID, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getMyUnreadConcreteabstractsCount 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        //console.log('callback getMyUnreadConcreteabstractsCount 成功：'+'<>'+obj[index]);
      }
      //console.log('callback getMyUnreadConcreteabstractsCount 成功：'+'<>未读消息数量:'+obj);
    }
  };

  var query = Concreteabstractmodel.find({'receiver': receiverID, status: 0}, {_id: 1});
  query.exec(function (err, docs) {
    if (!err) {
      callback(err, docs.length);
    }
    else {
      callback(err, 0);
    }
  });
};


ConcreteabstractDAO.prototype.readtConcreteabstract = function (mid, outcallback) {

  console.log('a--------------------------------')
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback readtConcreteabstract 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback readtConcreteabstract 成功：' + '<>' + obj[index]);
      }
      console.log('callback readtConcreteabstract 成功：' + '<>');
    }
  };

  Concreteabstractmodel.findOne({name: mid.name}, function (err, obj) {
    if (!err && obj) {
      console.log('添加');
      console.log(mid.persons);
      Concreteabstractmodel.update({name: mid.name}, {persons: mid.persons}, function (err, uobj) {
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


var concreteabstractObj = new ConcreteabstractDAO();

concreteabstractObj.sendAConcreteabstract({//抽象表
  type:'无照经营',
  argument:{setp:[
    '1..',
    '2..'
  ]},
  order:1
});
// concreteabstractObj.getConcreteabstractsInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');

// concreteabstractObj.getMyNewestConcreteabstractFromWho("58c043cc40cbb100091c640d","58bff0836253fd4008b3d41b",false);
module.exports = concreteabstractObj;