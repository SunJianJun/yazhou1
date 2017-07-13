var mongodb = require('./mongodb');
var Abstracttypemodule = require('./abstracttypeschema');
var PersonSchema = require('./personschema');//这里相当于PersonSchema的export，真正要引用PersonSchema，应该这样PersonSchema.PersonSchema
var db = mongodb.mongoose.connection;
db.on('error',
  console.error.bind(console, '连接错误:')
);
db.once('open', function () {
  console.log('mongodb connection is ok!:' + mongodb);
});


//console.log('mongodb Schema:'+Schema);

var Abstracttypemodel= Abstracttypemodule.Abstracttypemodel;
//console.log('mongodb Schema:++'+Abstracttypemodel);
var Personmodel = PersonSchema.Personmodel;

var AbstracttypeDAO = function () {
};
AbstracttypeDAO.prototype.save = function (obj, callback) {
  Abstracttypemodel.create();
  // 终端打印如下信息
  console.log('called Abstracttype save');
  var instance = new Abstracttypemodel(obj);
  console.log('instance.save:' + instance.name);
  instance.save(function (err) {
    console.log('save Abstracttype' + instance + ' fail:' + err);
    callback(err);
  });
};

AbstracttypeDAO.prototype.findByName = function (name, callback) {
  Abstracttypemodel.findOne({name: name}, function (err, obj) {
    callback(err, obj);
  });
};

AbstracttypeDAO.prototype.getAllAbstracttype=function(callback){//获取所有类型
    var callback = callback ? callback : function (err, obj) {
    if (err) {
      console.log('callback getAllAbstracttype 出错：-' + '<>' + err);
    } else {
      console.log('callback getAllAbstracttype 成功：-' + '<>' + obj);
    }
  };
   Abstracttypemodel.find({status:1}).exec(function(err,obj){
     // console.log(obj)
      callback(err,obj)
   })
};
AbstracttypeDAO.prototype.getoneeventtype= function (typeID,outcallback) { //根据类型名获取类型
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback 出错：' + '<>' + err);
    } else {
        console.log('callback 成功：' + '<>' + obj);
      }
    }
  var query = Abstracttypemodel.findOne({_id:typeID, status: 1}, function (err, result) {
    if (err) {
        outcallback(err,null)
    } else {
        outcallback(null,result);
    }
  });
}

AbstracttypeDAO.prototype.sendAAbstracttype = function (abstracttypeObj, outcallback) {

  console.log('添加数据');
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback sendAAbstracttype 出错：-' + '<>' + err);
    } else {
      console.log('callback sendAAbstracttype 成功：-' + '<>' + obj);
    }
  };

  // abstracttypeObj.sender=senderID;

  // abstracttypeObj.receiver=receiverID;
  abstracttypeObj.status = 1;
  abstracttypeObj.setDate=new Date();
  abstracttypeObj.steps=[];
  console.log(abstracttypeObj);
  var newM = new Abstracttypemodel(abstracttypeObj);
  newM.save(function (err, uobj) {
    if (err) {
      console.log('callback sendAAbstracttype 出错：' + '<>' + err);
      callback(err, null);
    } else {
      console.log('callback sendAAbstracttype 成功：' + '<>' + uobj._id);
      callback(err, uobj);
    }
  });
};


AbstracttypeDAO.prototype.getMyNewestAbstracttype = function (receiverID, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getMyNewestAbstracttype 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback getMyNewestAbstracttype 成功：' + '<>' + obj[index]);
      }
      //console.log('callback getMyNewestAbstracttype 成功：'+'<>');
    }
  };

  var query = Abstracttypemodel.find({'receiver': receiverID, status: 0});
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

AbstracttypeDAO.prototype.getMyNewestAbstracttypeFromWho = function (receiverID, senderID, isAbstract, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback getMyNewestAbstracttypeFromWho 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback getMyNewestAbstracttypeFromWho 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {

        console.log('callback getMyNewestAbstracttypeFromWho 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  };

  var query = Abstracttypemodel.find({'receiver': receiverID, sender: senderID, status: 1}, {});
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
          // unreadabstracttypes:docs
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

AbstracttypeDAO.prototype.abstracttypeDelete = function (id, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback abstracttypeDelete 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback abstracttypeDelete 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {
        console.log('callback abstracttypeDelete 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  };

  var query = Abstracttypemodel.update({_id: id},{status: 0});
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
AbstracttypeDAO.prototype.updateAbstracttype = function (data, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback updateAbstracttype 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback updateAbstracttype 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {
        console.log('callback updateAbstracttype 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  };
  var name=data.beforeName;
  var newName=data.typeName;
  var step=data.step;
  var newer=data.newer;
  var query = Abstracttypemodel.update({typeName:name},{typeName:newName,steps:step,newer:newer});
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
AbstracttypeDAO.prototype.abstracttypepeopleDelete = function (areaID, position, outcallback) {
  // var areaID=area.areaID;
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback abstracttypepeopleDelete 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback abstracttypepeopleDelete 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {
        console.log('callback abstracttypepeopleDelete 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  }
  // query=Abstracttypemodel.update({'name':name,status:1},{'persons':person.splice(id,1)},{});
  var query = Abstracttypemodel.find({_id: areaID, status: 1}, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      var person = result[0].persons;
      if (person && person.length && (person.length > (position))) {
        person.splice(position, 1)
        Abstracttypemodel.update({_id: areaID}, {$set: {'persons': person}}, function (err, res) {
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

AbstracttypeDAO.prototype.getAbstracttypesInATimeSpanFromWho = function (receiverID, senderID, startTime, endtime, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getAbstracttypesInATimeSpanFromWho 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        //console.log('callback getAbstracttypesInATimeSpanFromWho 成功：'+'<>'+obj[index]);
      }
      if (obj.abstract) {

        //console.log('callback getAbstracttypesInATimeSpanFromWho 成功：'+'<>'+obj.abstract+'<>'+obj.count+'<>'+obj.lastTime);
      }

    }
  };

  var query = Abstracttypemodel.find();
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
        //     unreadabstracttypes:docs
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


AbstracttypeDAO.prototype.getMyUnreadAbstracttypesCount = function (receiverID, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getMyUnreadAbstracttypesCount 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        //console.log('callback getMyUnreadAbstracttypesCount 成功：'+'<>'+obj[index]);
      }
      //console.log('callback getMyUnreadAbstracttypesCount 成功：'+'<>未读消息数量:'+obj);
    }
  };

  var query = Abstracttypemodel.find({'receiver': receiverID, status: 0}, {_id: 1});
  query.exec(function (err, docs) {
    if (!err) {
      callback(err, docs.length);
    }
    else {
      callback(err, 0);
    }
  });
};


AbstracttypeDAO.prototype.readtAbstracttype = function (mid, outcallback) {

  console.log('a--------------------------------')
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback readtAbstracttype 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback readtAbstracttype 成功：' + '<>' + obj[index]);
      }
      console.log('callback readtAbstracttype 成功：' + '<>');
    }
  };

  Abstracttypemodel.findOne({name: mid.name}, function (err, obj) {
    if (!err && obj) {
      console.log('添加');
      console.log(mid.persons);
      Abstracttypemodel.update({name: mid.name}, {persons: mid.persons}, function (err, uobj) {
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


var abstracttypeObj = new AbstracttypeDAO();

// abstracttypeObj.sendAAbstracttype({//抽象表
//   typeName:'无照经营',
//   steps:['立案'],
//   setDate:new Date(),
//   status:1
// });

module.exports = abstracttypeObj;