var mongodb = require('./mongodb');
var Concreteargumodule = require('./concretearguschema');
var PersonSchema = require('./personschema');//这里相当于PersonSchema的export，真正要引用PersonSchema，应该这样PersonSchema.PersonSchema
var db = mongodb.mongoose.connection;
db.on('error',
  console.error.bind(console, '连接错误:')
);
db.once('open', function () {
  console.log('mongodb connection is ok!:a' + mongodb);
});


//console.log('mongodb Schema:'+Schema);

var Concreteargumodel = Concreteargumodule.Concreteargumodel;
//console.log('mongodb Schema:++'+Concreteargumodel);
var Personmodel = PersonSchema.Personmodel;

var ConcretearguDAO = function () {
};
ConcretearguDAO.prototype.save = function (obj, callback) {
  Concreteargumodel.create();
  // 终端打印如下信息
  console.log('called Concreteargu save');
  var instance = new Concreteargumodel(obj);
  console.log('instance.save:' + instance.name);
  instance.save(function (err) {
    console.log('save Concreteargu' + instance + ' fail:' + err);
    callback(err);
  });
};
ConcretearguDAO.prototype.getparametersaccordingtoParameter = function(arguID, outcallback){
    var callback = outcallback ? outcallback : function (err, obj) {
      if (err) {
        console.log('callback sendAConcreteargu 出错：-' + '<>' + err);
      } else {
        console.log('callback sendAConcreteargu 成功：-' + '<>' + obj);
      }
    };
    Concreteargumodel.find({ _id : {$in:arguID}} ,function(err,obj){
        if (err) {
          console.log('callback  出错：-' + '<>' + err);
          outcallback(err,null)
        } else {
          console.log('callback  成功：-' + '<>' + obj);
          outcallback(null,obj)
        }
    })

}

ConcretearguDAO.prototype.findByName = function (name, callback) {
  Concreteargumodel.findOne({name: name}, function (err, obj) {
    callback(err, obj);
  });
};

ConcretearguDAO.prototype.sendAConcreteargu = function (concretearguObj, outcallback) {

  console.log('添加数据');
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback sendAConcreteargu 出错：-' + '<>' + err);
    } else {
      console.log('callback sendAConcreteargu 成功：-' + '<>' + obj);
    }
  };

  // concretearguObj.sender=senderID;

  // concretearguObj.receiver=receiverID;
  concretearguObj.status = 1;
  console.log(concretearguObj);
  var newM = new Concreteargumodel(concretearguObj);
  newM.save(function (err, uobj) {
    if (err) {
      console.log('callback sendAConcreteargu 出错：' + '<>' + err);
      callback(err, null);
    } else {
      console.log('callback sendAConcreteargu 成功：' + '<>' + uobj._id);
      callback(err, uobj);
    }
  });
};

ConcretearguDAO.prototype.sendAllConcreteargu = function (concretearguObj, outcallback) {
  //console.log('添加多条数据');
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback sendAllConcreteargu 出错：-' + '<>' + err);
    } else {
      console.log('callback sendAllConcreteargu 成功：-' + '<>' + obj);
    }
  };
  for(var i=0;i<concretearguObj.length;i++) {
    // concretearguObj.sender=senderID;

    // concretearguObj.receiver=receiverID;
    //console.log(concretearguObj);
    var newM = new Concreteargumodel(concretearguObj[i]);
    newM.save(function (err, uobj) {
      if (err) {
        //console.log('callback sendAllConcreteargu 出错：' + '<>' + err);
        callback(err, null);
      } else {
        //console.log('callback sendAllConcreteargu 成功：' + '<>' + uobj);
        callback(err, uobj);
      }
    });
  }
};


ConcretearguDAO.prototype.getMyNewestConcreteargu = function (receiverID, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getMyNewestConcreteargu 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback getMyNewestConcreteargu 成功：' + '<>' + obj[index]);
      }
      //console.log('callback getMyNewestConcreteargu 成功：'+'<>');
    }
  };

  var query = Concreteargumodel.find({'receiver': receiverID, status: 0});
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

ConcretearguDAO.prototype.getMyNewestConcretearguFromWho = function (receiverID, senderID, isAbstract, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback getMyNewestConcretearguFromWho 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback getMyNewestConcretearguFromWho 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {

        console.log('callback getMyNewestConcretearguFromWho 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  };

  var query = Concreteargumodel.find({'receiver': receiverID, sender: senderID, status: 1}, {});
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
          // unreadconcreteargus:docs
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

ConcretearguDAO.prototype.concretearguDelete = function (name, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback concretearguDelete 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback concretearguDelete 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {
        console.log('callback concretearguDelete 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  };
  var query = Concreteargumodel.remove({'name': name, status: 1}, {});
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
ConcretearguDAO.prototype.concreteargupeopleDelete = function (areaID, position, outcallback) {
  // var areaID=area.areaID;
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback concreteargupeopleDelete 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback concreteargupeopleDelete 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {
        console.log('callback concreteargupeopleDelete 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  }
  // query=Concreteargumodel.update({'name':name,status:1},{'persons':person.splice(id,1)},{});
  var query = Concreteargumodel.find({_id: areaID, status: 1}, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      var person = result[0].persons;
      if (person && person.length && (person.length > (position))) {
        person.splice(position, 1)
        Concreteargumodel.update({_id: areaID}, {$set: {'persons': person}}, function (err, res) {
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

ConcretearguDAO.prototype.getConcreteargusInATimeSpanFromWho = function (receiverID, senderID, startTime, endtime, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getConcreteargusInATimeSpanFromWho 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        //console.log('callback getConcreteargusInATimeSpanFromWho 成功：'+'<>'+obj[index]);
      }
      if (obj.abstract) {

        //console.log('callback getConcreteargusInATimeSpanFromWho 成功：'+'<>'+obj.abstract+'<>'+obj.count+'<>'+obj.lastTime);
      }

    }
  };

  var query = Concreteargumodel.find();
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
        //     unreadconcreteargus:docs
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


ConcretearguDAO.prototype.getMyUnreadConcreteargusCount = function (receiverID, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getMyUnreadConcreteargusCount 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        //console.log('callback getMyUnreadConcreteargusCount 成功：'+'<>'+obj[index]);
      }
      //console.log('callback getMyUnreadConcreteargusCount 成功：'+'<>未读消息数量:'+obj);
    }
  };

  var query = Concreteargumodel.find({'receiver': receiverID, status: 0}, {_id: 1});
  query.exec(function (err, docs) {
    if (!err) {
      callback(err, docs.length);
    }
    else {
      callback(err, 0);
    }
  });
};
//判断参数是否全部填写
ConcretearguDAO.prototype.isargunoblank=function(id,callback){
  Concreteargumodel.find({_id:{$in:id}},'value',function(err,obj){
    if(err){
      callback(err);
    }else{
      for(var i=0;i<obj.length;i++){
        // console.log(i)
        // console.log(obj[i])
        if(obj[i].value.length){

        }else{
          console.log(id);
          callback(null,id)
          return;
        }
      }
      // console.log(obj)
    }
  })
}

ConcretearguDAO.prototype.readtConcreteargu = function (mid, outcallback) {

  console.log('a--------------------------------')
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback readtConcreteargu 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback readtConcreteargu 成功：' + '<>' + obj[index]);
      }
      console.log('callback readtConcreteargu 成功：' + '<>');
    }
  };

  Concreteargumodel.findOne({name: mid.name}, function (err, obj) {
    if (!err && obj) {
      console.log('添加');
      console.log(mid.persons);
      Concreteargumodel.update({name: mid.name}, {persons: mid.persons}, function (err, uobj) {
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


var concretearguObj = new ConcretearguDAO();

// concretearguObj.sendAConcreteargu({
//  type:'日期',
//  value:'案发日期',
//  setTime:new Date(),
//  setByWho:'张三',//这个参数是谁设置的
//  identified:'1'//表示这个值是输入了个人签名密码的
// });
// concretearguObj.sendAConcreteargu({
//  type:'地点',
//  value:'案发地点',
//  setTime:new Date(),
//  setByWho:'李四',//这个参数是谁设置的
//  identified:'1'//表示这个值是输入了个人签名密码的
// });

module.exports = concretearguObj;