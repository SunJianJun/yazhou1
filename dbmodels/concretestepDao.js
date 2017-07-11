var mongodb = require('./mongodb');
var Concretestepmodule = require('./concretestepschema');
var ConcreteeventSchema = require('./concreteeventschema');//这里相当于ConcreteeventSchema的export，真正要引用ConcreteeventSchema，应该这样ConcreteeventSchema.ConcreteeventSchema
var db = mongodb.mongoose.connection;
db.on('error',
  console.error.bind(console, '连接错误:')
);
db.once('open', function () {
  console.log('mongodb connection is ok!:a' + mongodb);
});


//console.log('mongodb Schema:'+Schema);

var Concretestepmodel = Concretestepmodule.Concretestepmodel;
//console.log('mongodb Schema:++'+Concretestepmodel);
var Concreteeventmodel = ConcreteeventSchema.Concreteeventmodel;

var ConcretestepDAO = function () {
};
ConcretestepDAO.prototype.save = function (obj, callback) {
  Concretestepmodel.create();
  // 终端打印如下信息
  console.log('called Concretestep save');
  var instance = new Concretestepmodel(obj);
  console.log('instance.save:' + instance.name);
  instance.save(function (err) {
    console.log('save Concretestep' + instance + ' fail:' + err);
    callback(err);
  });
};

ConcretestepDAO.prototype.findByName = function (name, callback) {
  Concretestepmodel.findOne({name: name}, function (err, obj) {
    callback(err, obj);
  });
};

ConcretestepDAO.prototype.sendAConcretestep = function (concretestepObj, outcallback) {

  //console.log('添加数据');
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback sendAConcretestep 出错：-' + '<>' + err);
    } else {
      console.log('callback sendAConcretestep 成功：-' + '<>' + obj);
    }
  };

  // concretestepObj.sender=senderID;

  // concretestepObj.receiver=receiverID;
  // concretestepObj.status = 1;
  //console.log(concretestepObj);
  var newM = new Concretestepmodel(concretestepObj);
  newM.save(function (err, uobj) {
    if (err) {
      console.log('callback sendAConcretestep 出错：' + '<>' + err);
      callback(err, null);
    } else {
      console.log('callback sendAConcretestep 成功：' + '<>' + uobj._id);
      callback(err, uobj);
    }
  });
};


ConcretestepDAO.prototype.getMyNewestConcretestep = function (receiverID, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getMyNewestConcretestep 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback getMyNewestConcretestep 成功：' + '<>' + obj[index]);
      }
      //console.log('callback getMyNewestConcretestep 成功：'+'<>');
    }
  };

  var query = Concretestepmodel.find({'receiver': receiverID, status: 0});
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
ConcretestepDAO.prototype.updateaddargu = function (eventId,step, callback) {
  var callback = callback ? callback : function (err, obj) {
    if (err) {
      console.log('callback updateaddargu 出错：' + '<>' + err);
    } else {
      console.log('callback updateaddargu 成功：' + '<>' + obj);
    }
  }
  var steps=step;
  //Concretestepmodel.find({_id: eventId},function(err,step){
  //  if(err){
  //
  //  }else{
  //    if(step.argu) {
  //      var steps;
  //      if(step.argu.length){
  //        steps = step.argu.push(stepjson);
  //      } else {
  //        steps = step.argu = [stepjson];
  //      }
  //      console.log('找不到了')
  //      console.log(steps)
        Concretestepmodel.update({_id: eventId}, {$set: {'argu':steps}}, function (err, res) {
          if (!err) {
            //console.log('修改');
            callback(err, res);
          }
          else {
            console.log('没有数据');
            callback(err, 0);
          }
        });
      //}
  //  }
  //})
};

ConcretestepDAO.prototype.getMyNewestConcretestepFromWho = function (receiverID, senderID, isAbstract, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback getMyNewestConcretestepFromWho 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback getMyNewestConcretestepFromWho 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {

        console.log('callback getMyNewestConcretestepFromWho 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  };

  var query = Concretestepmodel.find({'receiver': receiverID, sender: senderID, status: 1}, {});
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
          // unreadconcretesteps:docs
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

ConcretestepDAO.prototype.concretestepDelete = function (name, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback concretestepDelete 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback concretestepDelete 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {
        console.log('callback concretestepDelete 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  };
  var query = Concretestepmodel.remove({'name': name, status: 1}, {});
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
ConcretestepDAO.prototype.concretesteppeopleDelete = function (areaID, position, outcallback) {
  // var areaID=area.areaID;
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback concretesteppeopleDelete 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback concretesteppeopleDelete 成功：' + '<>' + obj[index]);
      }
      if (obj.abstract) {
        console.log('callback concretesteppeopleDelete 成功：' + '<>' + obj.abstract + '<>' + obj.count + '<>' + obj.lastTime);
      }
    }
  }
  // query=Concretestepmodel.update({'name':name,status:1},{'persons':person.splice(id,1)},{});
  var query = Concretestepmodel.find({_id: areaID, status: 1}, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      var person = result[0].persons;
      if (person && person.length && (person.length > (position))) {
        person.splice(position, 1)
        Concretestepmodel.update({_id: areaID}, {$set: {'persons': person}}, function (err, res) {
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

ConcretestepDAO.prototype.getConcretestepsInATimeSpanFromWho = function (receiverID, senderID, startTime, endtime, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getConcretestepsInATimeSpanFromWho 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        //console.log('callback getConcretestepsInATimeSpanFromWho 成功：'+'<>'+obj[index]);
      }
      if (obj.abstract) {

        //console.log('callback getConcretestepsInATimeSpanFromWho 成功：'+'<>'+obj.abstract+'<>'+obj.count+'<>'+obj.lastTime);
      }

    }
  };

  var query = Concretestepmodel.find();
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
        //     unreadconcretesteps:docs
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
ConcretestepDAO.prototype.getoneeventstep=function (ID,outcallback) {
  // var areaID=area.areaID;
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback getoneeventstep 出错：' + '<>' + err);
    } else {
        console.log('callback getoneeventstep 成功：' + '<>' + obj);
      }
    }
  var query = Concretestepmodel.findOne({_id: ID}, function (err, result) {
    if (err) {
      outcallback(err,null)
    } else {
      console.log(result);
      outcallback(null,result);
    }
  });
}
ConcretestepDAO.prototype.geteventstep=function (ID,status,outcallback) {
  // var areaID=area.areaID;
  // console.log('步骤')
  // console.log(ID)
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback getoneeventstep 出错：' + '<>' + err);
    } else {
      console.log('callback getoneeventstep 成功：' + '<>' + obj);
    }
  }
  //console.log(ID)
  var query = Concretestepmodel.find({_id:{$in:ID}, status:status}, function (err, result) {
    if (err) {
      outcallback(err,null)
    } else {
    // enumerate(school_paper['result'])
    //   console.log('依次打出')
    //   for(var sor=0;sor<result.length;sor++){
    //     console.log(result[sor]);
    //   }
      result.sort();
      outcallback(null,result);
    }
  });

  // items = Concretestepmodel.find({'_id':{'$in':ID}});
  // item_indexes = {id_:index for index, id_ in enumerate(school_paper['ID'])
  // items.sort(key=lambda item: item_indexes[item['_id']])
}


ConcretestepDAO.prototype.getMyUnreadConcretestepsCount = function (receiverID, outcallback) {
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      //console.log('callback getMyUnreadConcretestepsCount 出错：'+'<>'+err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        //console.log('callback getMyUnreadConcretestepsCount 成功：'+'<>'+obj[index]);
      }
      //console.log('callback getMyUnreadConcretestepsCount 成功：'+'<>未读消息数量:'+obj);
    }
  };

  var query = Concretestepmodel.find({'receiver': receiverID, status: 0}, {_id: 1});
  query.exec(function (err, docs) {
    if (!err) {
      callback(err, docs.length);
    }
    else {
      callback(err, 0);
    }
  });
};


ConcretestepDAO.prototype.readtConcretestep = function (mid, outcallback) {

  console.log('a--------------------------------')
  var callback = outcallback ? outcallback : function (err, obj) {
    if (err) {
      console.log('callback readtConcretestep 出错：' + '<>' + err);
    } else {
      for (var index = 0; index < obj.length; index++) {
        console.log('callback readtConcretestep 成功：' + '<>' + obj[index]);
      }
      console.log('callback readtConcretestep 成功：' + '<>');
    }
  };

  Concretestepmodel.findOne({name: mid.name}, function (err, obj) {
    if (!err && obj) {
      console.log('添加');
      console.log(mid.persons);
      Concretestepmodel.update({name: mid.name}, {persons: mid.persons}, function (err, uobj) {
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


var concretestepObj = new ConcretestepDAO();

// concretestepObj.sendAConcretestep({
//   name: '1.立案审批表',
//   type: 'null',
//   create_date:new Date(),
//   argu:[{
//     conId:'1234'
//   }],
//   status:1,
//   wordTemplate:`<p style="text-align:center">
//     <strong><span style="font-size:29px;font-family:宋体">三亚市崖州区综合行政执法局</span></strong>
// </p>
// <p style="text-align:center">
//     <strong><span style="font-size:29px;font-family:宋体">案件调查终结报告</span></strong>
// </p>
// <p>
//     <span style="font-size:19px;font-family:仿宋">&nbsp;&nbsp;&nbsp; </span>
// </p>
// <p>
//     <span style="font-size:19px;font-family:仿宋">&nbsp;&nbsp; </span><span style="font-size:20px;font-family:仿宋">&nbsp;</span><span style="font-size:20px;font-family:仿宋">一、当事人及案由</span>
// </p>
// <p style="text-indent: 40px">
//     <span style="font-size:20px;font-family:仿宋">当事人：三亚崖州港湾投资有限公司 </span>
// </p>
// <p style="text-indent:40px;line-height:29px;vertical-align:baseline">
//     <span style="font-size:20px;font-family:仿宋">法定代表人</span><span style="font-size:19px;font-family:仿宋_GB2312;color:black">：</span><span style="font-size:19px;font-family:仿宋">陈川乐，男，汉族，身份证号码<span>460001197008011016</span></span>
// </p>
// <p style="text-indent: 40px">
//     <span style="font-size:20px;font-family:仿宋">住所：三亚市天涯区解放路四路<span>743</span>号工商银行大楼五层</span><span style="font-size:19px;font-family:仿宋_GB2312;color:black"> </span>
// </p>
// <p style="text-indent: 40px">
//     <span style="font-size:20px;font-family:仿宋">联系电话：<span style="color:black">18789001151</span><span style="color:black">。</span></span>
// </p>
// <p style="text-indent: 40px">
//     <span style="font-size:20px;font-family:仿宋;color:black">2017</span><span style="font-size:20px;font-family:仿宋;color:black">年<span>2</span>月<span>6</span>日，我局执法人员在环境市容巡查、整治过程中，当事人</span><span style="font-size:19px;font-family:仿宋_GB2312">三亚崖州港湾投资有限公司</span><span style="font-size:20px;font-family:仿宋;color:black">在</span><span style="font-size:19px;font-family:仿宋_GB2312;color:black">三亚市崖州区中心渔港</span><span style="font-size: 19px;font-family:仿宋">交易中心道路</span><span style="font-size:19px;font-family: 仿宋_GB2312;color:black">随意倾倒、堆放生活垃圾</span><span style="font-size:20px;font-family:仿宋;color:black">。</span><span style="font-size:20px;font-family:仿宋;color:black">执法人员当场对违法情况进行拍照取证，制作了《现场检查记录》，填写了</span><span style="font-size:19px;font-family:仿宋">三崖综执（三队）立字〔<span>2017</span>〕<span>008</span>号</span><span style="font-size:20px;font-family:仿宋">《立案审批表》并经局领导审批，本案由<span style="color:black">执法证号为：<span>HN-SY0016472(B</span>）姓名：邢贞琪，<span>HN-SY0023673(B</span>）姓名：梁梅两名调查人员负责调查处理。</span></span>
// </p>
// <p style="text-indent: 40px">
//     <span style="font-size:20px;font-family:仿宋;color:black">&nbsp;</span>
// </p>
// <p style="margin-left: 0;text-indent: 40px">
//     <span style="font-size: 20px;font-family:仿宋;color:black">二、</span><span style="font-size:20px;font-family:仿宋;color:black">调查经过及证据</span>
// </p>
// <p>
//     <span style="font-size:20px;font-family:仿宋;color:black">&nbsp;</span>
// </p>
// <p>
//     <span style="font-size:20px;font-family:仿宋;color:black">&nbsp;&nbsp;&nbsp; 2017</span><span style="font-size:20px;font-family:仿宋;color:black">年<span>2</span>月<span>6</span>日，执法人员进行了现场检查并进行拍照取证，发出</span><span style="font-size:19px;font-family:仿宋_GB2312;color:black">三崖综执（三队）询字<span>[2017]006</span></span><span style="font-size:19px;font-family:仿宋_GB2312;color:black">号</span><span style="font-size:20px;font-family:仿宋;color:black">《接受调查询问通知书》，于<span>2016</span>年<span>2</span>月<span>7</span>日向当事人进行了调查询问，制作了《询问（调查）笔录》一份，当事人提供</span><span style="font-size:20px;font-family:仿宋;color:black">营</span><span style="font-size:20px;font-family:仿宋;color:black">业执照复印件、法定代表人身份证复印件、委托代理人身份证复印件、授权委托书</span><span style="font-size: 20px;font-family:仿宋;color:black">各一份。调查人员调取的证据有：</span>
// </p>
// <p style="text-indent: 40px;vertical-align: baseline">
//     <span style="font-size:20px;font-family: 仿宋;color:black">1</span><span style="font-size:20px;font-family:仿宋;color:black">、《现场检查记录》一份<span>2</span>、现场图片×份<span>3</span>、现场示意图一份<span>4</span>、《询问（调查）笔录》一份<span>5</span>、营业执照复印件一份<span>6</span></span><span style="font-size:20px;font-family:仿宋">、</span><span style="font-size:20px;font-family: 仿宋;color:black">法定代表人身份证复印件一份<span>7</span>、委托代理人身份证复印件一份<span>8</span>、授权委托书</span><span style="font-size:20px;font-family:仿宋;color:black">原件一份。</span>
// </p>
// <p style="text-indent: 40px;vertical-align: baseline">
//     <span style="font-size:20px;font-family: 仿宋;color:black">&nbsp;</span>
// </p>
// <p style="vertical-align: baseline">
//     <span style="font-size:20px;font-family:仿宋;color:black">&nbsp;&nbsp;&nbsp; </span><span style="font-size:20px;font-family:仿宋;color:black">三、定性分析</span>
// </p>
// <p style="text-indent:40px">
//     <span style="font-size:20px;font-family:仿宋;color:black">以上事实和证据，调查人员认为当事人的行为违反了</span><span style="font-size:19px;font-family:仿宋_GB2312;color:black">《中华人民共和国固体废物污染环境防治法》第七十四条第一款第（一）项</span><span style="font-size: 20px;font-family:仿宋;color:black">“</span><span style="font-size:20px;font-family:仿宋">违反本法有关城市生活垃圾污染防治的规定，有下列行为之一的，由县级以上地方人民政府环境卫生行政主管部门责令停止违法行为，限期改正，处以罚款（一）随意倾倒、剖撒或者堆放生活垃圾的；</span><span style="font-size:20px;font-family:仿宋;color:black">”</span><span style="font-size: 20px;font-family: 仿宋;color: black">之规定，构成了</span><span style="font-size:20px;font-family:仿宋;color:black">随意倾倒、堆放生活垃圾</span><span style="font-size:20px;font-family:仿宋">的违法事实。</span>
// </p>
// <p style="text-indent:40px">
//     <span style="font-size:20px;font-family:仿宋">&nbsp;</span><span style="font-size:20px;font-family:仿宋">四、处罚依据及意见</span>
// </p>
// <p style="vertical-align: baseline">
//     <span style="font-size:20px;font-family:仿宋;color:black">&nbsp;&nbsp;&nbsp;&nbsp; </span><span style="font-size:20px;font-family:仿宋;color:black">依据</span><span style="font-size:19px;font-family:仿宋_GB2312;color:black">《中华人民共和国固体废物污染环境防治法》第七十四条第二款</span><span style="font-size:20px;font-family:仿宋;color:black">“</span><span style="font-size:20px;font-family: 仿宋">单位有前款第一项、第三项、第五项行为之一的，处五千元以上五万元以下的罚款；有前款第二项、第四项行为之一的，处一万元以上十万元以下的罚款。个人有前款第一项、第五项行为之一的，处二百元以下的罚款。<span style="color:black">”</span></span><span style="font-size: 20px;font-family: 仿宋;color: black">之规定，建议对当事人作出处以人民币<span>30000</span>元的罚款。</span>
// </p>
// <p style="vertical-align: baseline">
//     <span style="font-size: 20px;font-family: 仿宋;color: black">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><span style="font-size: 20px;font-family: 仿宋;color: black">承办机构：</span><span style="font-size:20px;font-family:仿宋;color:black">崖州区综合行政执法局执法三队</span>
// </p>
// <p style="vertical-align: baseline">
//     <span style="font-size:20px;font-family:仿宋;color:black">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><span style="font-size:20px;font-family:仿宋;color:black">承办人： <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
// </p>
// <p style="vertical-align: baseline">
//     <span style="font-size:20px;font-family:仿宋;color:black">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2017</span><span style="font-size:20px;font-family:仿宋;color:black">年<span>2</span>月<span>10</span>日</span>
// </p>`,
//   currentPusher:'张三'
// });




// concretestepObj.sendAConcretestep({
//   name: '2.现场检查记录',
//   info: null,
//   persons: [{
//     name: '执法人员'
//   }],
//   create_date:new Date(),
//   steps:[{
//     'types':'现场检查，填写记录',
//     status:0,
//     prev_step:null,
//     next_step:null
//   }]
// });
// concretestepObj.sendAConcretestep({
//   name: '3.扣押物品',
//   info: 'null',
//   persons: [{
//     name: '李四'
//   }],
//   create_date:new Date(),
//   steps:[{
//     'types':'下发扣押物品决定书',
//     status:0,
//     prev_step:null,
//     next_step:'扣押物品现场笔录'
//   },{
//     'types':'扣押物品现场笔录',
//     status:0,
//     prev_step:'下发扣押物品决定书',
//     next_step:'扣押物品清单'
//   },{
//     'types':'扣押物品清单',
//     status:0,
//     prev_step:'扣押物品现场笔录',
//     next_step:null
//   }]
// });
// concretestepObj.sendAConcretestep({
//   name: '4.接受调查询问',
//   info: 'null',
//   persons: [{
//     name: '李四'
//   }],
//   create_date:new Date(),
//   steps:[{
//     'types':'下发扣押物品决定书',
//     status:0,
//     prev_step:null,
//     next_step:'扣押物品现场笔录'
//   },{
//     'types':'扣押物品现场笔录',
//     status:0,
//     prev_step:'下发扣押物品决定书',
//     next_step:'扣押物品清单'
//   },{
//     'types':'扣押物品清单',
//     status:0,
//     prev_step:'扣押物品现场笔录',
//     next_step:null
//   }]
// });
// concretestepObj.sendAConcretestep({
//   name: '5.询问（调查）笔录',
//   info: 'null',
//   persons: [{
//     name: '执法人员'},
//     {name:'副队长'},
//     {name:'队长'}],
//   create_date:new Date(),
//   steps:[{
//     'types':'填写询问笔录',
//     status:0,
//     prev_step:null,
//     next_step:null
//   }]
// });
// concretestepObj.sendAConcretestep({
//   name: '6.现场示意图',
//   info: 'null',
//   persons: [{
//     name: '李四'
//   }],
//   create_date:new Date(),
//   steps:[{
//     'types':'拍现场照片',
//     status:0,
//     prev_step:null,
//     next_step:null
//   }]
// });
// concretestepObj.sendAConcretestep({
//   name: '6.行政处罚告知',
//   info: 'null',
//   persons: [{
//     name: '李四'
//   }],
//   create_date:new Date(),
//   steps:[{
//     'types':'行政处罚告知书呈批表',
//     status:0,
//     prev_step:null,
//     next_step:'行政处罚告知书'
//   },{
//     'types':'行政处罚告知书',
//     status:0,
//     prev_step:'行政处罚告知书呈批表',
//     next_step:'送达回证'
//   },{
//     'types':'扣押物品清单',
//     status:0,
//     prev_step:'扣押物品现场笔录',
//     next_step:null
//   }]
// });
// concretestepObj.sendAConcretestep({
//   name: '7.行政处罚决定',
//   info: 'null',
//   persons: [{
//     name: '李四'
//   }],
//   create_date:new Date(),
//   steps:[{
//     'types':'行政处罚决定书呈批表',
//     status:0,
//     prev_step:null,
//     next_step:'行政处罚决定书'
//   },{
//     'types':'行政处罚决定书',
//     status:0,
//     prev_step:'行政处罚决定书呈批表',
//     next_step:'送达回证'
//   },{
//     'types':'送达回证',
//     status:0,
//     prev_step:'行政处罚决定书',
//     next_step:null
//   }]
// });
// concretestepObj.sendAConcretestep({
//   name: '8.解除扣押物品决定书',
//   info: 'null',
//   persons: [{
//     name: '李四'
//   }],
//   create_date:new Date(),
//   steps:[{
//     'types':'解除扣押物品决定书呈批表',
//     status:0,
//     prev_step:null,
//     next_step:'解除扣押物品决定书'
//   },{
//     'types':'解除扣押物品决定书',
//     status:0,
//     prev_step:'解除扣押物品决定书呈批表',
//     next_step:'送达回证'
//   },{
//     'types':'送达回证',
//     status:0,
//     prev_step:'解除扣押物品决定书',
//     next_step:null
//   }]
// });
// concretestepObj.sendAConcretestep({
//   name: '9.行政处罚案件结案报告',
//   info: 'null',
//   persons: [{
//     name: '局领导'
//   }],
//   create_date:new Date(),
//   steps:[{
//     'types':'审批结案报告',
//     status:0,
//     prev_step:null,
//     next_step:null
//   }]
// });




// concretestepObj.getMyNewestConcretestepFromWho("58c043cc40cbb100091c640d","58bff0836253fd4008b3d41b",false);
module.exports = concretestepObj;