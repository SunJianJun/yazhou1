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
          outcallback(err,null)
        } else {
          outcallback(null,obj)
        }
    })

}

ConcretearguDAO.prototype.findByName = function (name, callback) {
  Concreteargumodel.findOne({name: name}, function (err, obj) {
    callback(err, obj);
  });
};

//新建参数
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

//添加参数值
ConcretearguDAO.prototype.setAConcreteargu = function (arguid,argu,setwho,callback) {
  // callback('',[arguid,argu]);
  Concreteargumodel.update({_id:arguid},{value:argu,setByWho:setwho,setTime:new Date()},function (err, uobj) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, uobj);
    }
  });
};

//添加多条数据
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
      callback(null, docs);
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