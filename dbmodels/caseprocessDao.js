var mongodb = require('./mongodb');
var Caseprocessmodule = require('./caseprocessschema');
var PersonSchema = require('./personschema');//这里相当于PersonSchema的export，真正要引用PersonSchema，应该这样PersonSchema.PersonSchema
var db = mongodb.mongoose.connection;
db.on('error',
  console.error.bind(console, '连接错误:')
);
db.once('open', function () {
  console.log('mongodb connection is ok!:a' + mongodb);
});


//console.log('mongodb Schema:'+Schema);

var Caseprocessmodel = Caseprocessmodule.Caseprocessmodel;
//console.log('mongodb Schema:++'+Caseprocessmodel);
var Personmodel = PersonSchema.Personmodel;

var CaseprocessDAO = function () {
};
CaseprocessDAO.prototype.save = function (obj, callback) {
  Caseprocessmodel.create();
  // 终端打印如下信息
  console.log('called Caseprocess save');
  var instance = new Caseprocessmodel(obj);
  console.log('instance.save:' + instance.name);
  instance.save(function (err) {
    console.log('save Caseprocess' + instance + ' fail:' + err);
    callback(err);
  });
};

CaseprocessDAO.prototype.findByName = function (name, callback) {
  Caseprocessmodel.findOne({name: name}, function (err, obj) {
    callback(err, obj);
  });
};

CaseprocessDAO.prototype.sendACaseprocess = function (caseprocessObj, outcallback) {

  console.log('添加数据');
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback sendACaseprocess 出错：-' + '<>' + err);
    } else {
      console.log('callback sendACaseprocess 成功：-' + '<>' + obj);
    }
  };

  // caseprocessObj.sender=senderID;

  // caseprocessObj.receiver=receiverID;
  caseprocessObj.status = 1;
  console.log(caseprocessObj);
  var newM = new Caseprocessmodel(caseprocessObj);
  newM.save(function (err, uobj) {
    if (err) {
      console.log('callback sendACaseprocess 出错：' + '<>' + err);
      callback(err, null);
    } else {
      console.log('callback sendACaseprocess 成功：' + '<>' + uobj._id);
      callback(err, uobj);
    }
  });
};


CaseprocessDAO.prototype.getMyNewestCaseprocess = function (receiverID, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getMyNewestCaseprocess 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback getMyNewestCaseprocess 成功：' + '<>' + obj[index]);
      }
      //console.log('callback getMyNewestCaseprocess 成功：'+'<>');
    }
  };

  var query = Caseprocessmodel.find({'receiver': receiverID, status: 0});
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

CaseprocessDAO.prototype.getMyNewestCaseprocessFromWho = function (receiverID, senderID, isAbstract, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback getMyNewestCaseprocessFromWho 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback getMyNewestCaseprocessFromWho 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {

        console.log('callback getMyNewestCaseprocessFromWho 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  };

  var query = Caseprocessmodel.find({'receiver': receiverID, sender: senderID, status: 1}, {});
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
          // unreadcaseprocesss:docs
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

CaseprocessDAO.prototype.caseprocessDelete = function (name, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback caseprocessDelete 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback caseprocessDelete 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {
        console.log('callback caseprocessDelete 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  };
  var query = Caseprocessmodel.remove({'name': name, status: 1}, {});
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
CaseprocessDAO.prototype.caseprocesspeopleDelete = function (areaID, position, outcallback) {
  // var areaID=area.areaID;
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback caseprocesspeopleDelete 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback caseprocesspeopleDelete 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {
        console.log('callback caseprocesspeopleDelete 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  }
  // query=Caseprocessmodel.update({'name':name,status:1},{'persons':person.splice(id,1)},{});
  var query = Caseprocessmodel.find({_id: areaID, status: 1}, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      var person = result[0].persons;
      if (person && person.length && (person.length > (position))) {
        person.splice(position, 1)
        Caseprocessmodel.update({_id: areaID}, {$set: {'persons': person}}, function (err, res) {
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

CaseprocessDAO.prototype.getCaseprocesssInATimeSpanFromWho = function (receiverID, senderID, startTime, endtime, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getCaseprocesssInATimeSpanFromWho 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        //console.log('callback getCaseprocesssInATimeSpanFromWho 成功：'+'<>'+obj[index]);
      }
      if (obj.abstract) {

        //console.log('callback getCaseprocesssInATimeSpanFromWho 成功：'+'<>'+obj.abstract+'<>'+obj.count+'<>'+obj.lastTime);
      }

    }
  };

  var query = Caseprocessmodel.find();
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
        //     unreadcaseprocesss:docs
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


CaseprocessDAO.prototype.getMyUnreadCaseprocesssCount = function (receiverID, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getMyUnreadCaseprocesssCount 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        //console.log('callback getMyUnreadCaseprocesssCount 成功：'+'<>'+obj[index]);
      }
      //console.log('callback getMyUnreadCaseprocesssCount 成功：'+'<>未读消息数量:'+obj);
    }
  };

  var query = Caseprocessmodel.find({'receiver': receiverID, status: 0}, {_id: 1});
  query.exec(function (err, docs) {
    if (!err) {
      callback(err, docs.length);
    }
    else {
      callback(err, 0);
    }
  });
};


CaseprocessDAO.prototype.readtCaseprocess = function (mid, outcallback) {

  console.log('a--------------------------------')
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback readtCaseprocess 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback readtCaseprocess 成功：' + '<>' + obj[index]);
      }
      console.log('callback readtCaseprocess 成功：' + '<>');
    }
  };

  Caseprocessmodel.findOne({name: mid.name}, function (err, obj) {
    if (!err && obj) {
      console.log('添加');
      console.log(mid.persons);
      Caseprocessmodel.update({name: mid.name}, {persons: mid.persons}, function (err, uobj) {
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


var caseprocessObj = new CaseprocessDAO();

caseprocessObj.sendACaseprocess({
  name: '1.立案审批表',
  info: null,
  persons: [{
    name: '李四'
  }],
  create_date:new Date(),
  steps:[{
    'types':'填写审批表',
    status:0,
    prev_step:null,
    next_step:'上报领导批阅'
  },{
    'types':'上报领导批阅',
    status:0,
    prev_step:'填写审批表',
    next_step:null
  }]
});
caseprocessObj.sendACaseprocess({
  name: '2.现场检查记录',
  info: null,
  persons: [{
    name: '执法人员'
  }],
  create_date:new Date(),
  steps:[{
    'types':'现场检查，填写记录',
    status:0,
    prev_step:null,
    next_step:null
  }]
});
caseprocessObj.sendACaseprocess({
  name: '3.扣押物品',
  info: 'null',
  persons: [{
    name: '李四'
  }],
  create_date:new Date(),
  steps:[{
    'types':'下发扣押物品决定书',
    status:0,
    prev_step:null,
    next_step:'扣押物品现场笔录'
  },{
    'types':'扣押物品现场笔录',
    status:0,
    prev_step:'下发扣押物品决定书',
    next_step:'扣押物品清单'
  },{
    'types':'扣押物品清单',
    status:0,
    prev_step:'扣押物品现场笔录',
    next_step:null
  }]
});
caseprocessObj.sendACaseprocess({
  name: '4.接受调查询问',
  info: 'null',
  persons: [{
    name: '李四'
  }],
  create_date:new Date(),
  steps:[{
    'types':'下发扣押物品决定书',
    status:0,
    prev_step:null,
    next_step:'扣押物品现场笔录'
  },{
    'types':'扣押物品现场笔录',
    status:0,
    prev_step:'下发扣押物品决定书',
    next_step:'扣押物品清单'
  },{
    'types':'扣押物品清单',
    status:0,
    prev_step:'扣押物品现场笔录',
    next_step:null
  }]
});
caseprocessObj.sendACaseprocess({
  name: '5.询问（调查）笔录',
  info: 'null',
  persons: [{
    name: '执法人员'},
    {name:'副队长'},
    {name:'队长'}],
  create_date:new Date(),
  steps:[{
    'types':'填写询问笔录',
    status:0,
    prev_step:null,
    next_step:null
  }]
});
caseprocessObj.sendACaseprocess({
  name: '6.现场示意图',
  info: 'null',
  persons: [{
    name: '李四'
  }],
  create_date:new Date(),
  steps:[{
    'types':'拍现场照片',
    status:0,
    prev_step:null,
    next_step:null
  }]
});
caseprocessObj.sendACaseprocess({
  name: '6.行政处罚告知',
  info: 'null',
  persons: [{
    name: '李四'
  }],
  create_date:new Date(),
  steps:[{
    'types':'行政处罚告知书呈批表',
    status:0,
    prev_step:null,
    next_step:'行政处罚告知书'
  },{
    'types':'行政处罚告知书',
    status:0,
    prev_step:'行政处罚告知书呈批表',
    next_step:'送达回证'
  },{
    'types':'扣押物品清单',
    status:0,
    prev_step:'扣押物品现场笔录',
    next_step:null
  }]
});
caseprocessObj.sendACaseprocess({
  name: '7.行政处罚决定',
  info: 'null',
  persons: [{
    name: '李四'
  }],
  create_date:new Date(),
  steps:[{
    'types':'行政处罚决定书呈批表',
    status:0,
    prev_step:null,
    next_step:'行政处罚决定书'
  },{
    'types':'行政处罚决定书',
    status:0,
    prev_step:'行政处罚决定书呈批表',
    next_step:'送达回证'
  },{
    'types':'送达回证',
    status:0,
    prev_step:'行政处罚决定书',
    next_step:null
  }]
});
caseprocessObj.sendACaseprocess({
  name: '8.解除扣押物品决定书',
  info: 'null',
  persons: [{
    name: '李四'
  }],
  create_date:new Date(),
  steps:[{
    'types':'解除扣押物品决定书呈批表',
    status:0,
    prev_step:null,
    next_step:'解除扣押物品决定书'
  },{
    'types':'解除扣押物品决定书',
    status:0,
    prev_step:'解除扣押物品决定书呈批表',
    next_step:'送达回证'
  },{
    'types':'送达回证',
    status:0,
    prev_step:'解除扣押物品决定书',
    next_step:null
  }]
});
caseprocessObj.sendACaseprocess({
  name: '9.行政处罚案件结案报告',
  info: 'null',
  persons: [{
    name: '局领导'
  }],
  create_date:new Date(),
  steps:[{
    'types':'审批结案报告',
    status:0,
    prev_step:null,
    next_step:null
  }]
});


//caseprocessObj.sendACaseprocess(
//  {text: '今天还没吃过'}
//);
// caseprocessObj.sendACaseprocess(
//     {text:'这里有个事故',image:'caseprocess_123.jpg',location:{geolocation:[116.385929,39.996695]}},"58cb2031e68197ec0c7b935b","58c043cc40cbb100091c640d"
// );
// caseprocessObj.sendACaseprocess(
//     {text:'看看事故现场',video:'caseprocess_321.mp4',location:{geolocation:[116.385029,39.992495]}},"58cb3361e68197ec0c7b96c0","58c043cc40cbb100091c640d"
// );
//
// caseprocessObj.sendACaseprocess(
//     {text:'今天吃过饭了吗？'},"58bff0836253fd4008b3d41b","58c043cc40cbb100091c640d"
// );
// caseprocessObj.sendACaseprocess(
//     {text:'今天还没吃过'},"58c043cc40cbb100091c640d","58cb3361e68197ec0c7b96c0"
// );
// caseprocessObj.sendACaseprocess(
//     {text:'这里有个事故kjhkjh123',image:'caseprocess_123.jpg',location:{geolocation:[116.385929,39.996695]}},"58cb2031e68197ec0c7b935b","58c043cc40cbb100091c640d"
// );
// caseprocessObj.sendACaseprocess(
//     {text:'看看事故现场jkhkjh123',video:'caseprocess_321.mp4',location:{geolocation:[116.385029,39.992495]}},"58cb2031e68197ec0c7b935b","58c043cc40cbb100091c640d"
// );
// ObjectId("58c96cb24fd511384b81cba5")ObjectId("58c043cc40cbb100091c640d")
// caseprocessObj.getMyNewestCaseprocess("58c043cc40cbb100091c640d");
// caseprocessObj.getMyUnreadCaseprocesssCount("58bff0836253fd4008b3d41b");
// caseprocessObj.readtCaseprocess("58c85b9628b792000a779bfa");
// caseprocessObj.sendACaseprocess(
//     {text:'这里有个事故kjhkjh123'},"58c043cc40cbb100091c640d","58cb2031e68197ec0c7b935b"
// );
// caseprocessObj.getCaseprocesssInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');

// caseprocessObj.getMyNewestCaseprocessFromWho("58c043cc40cbb100091c640d","58bff0836253fd4008b3d41b",false);
module.exports = caseprocessObj;