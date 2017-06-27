var mongodb = require('./mongodb');
var attendanceRecordSchema = require('./attendanceRecordschema');
var db = mongodb.mongoose.connection;
db.on('error', console.error.bind(console, '连接错误:'));
db.once('open', function () {
  console.log('mongodb connection is ok!:' + mongodb);
});
var attendanceRecordmodel = mongodb.mongoose.model("attendanceRecord", attendanceRecordSchema);

console.log('mongodb attendanceRecord model is ok?:' + mongodb.mongoose.model("attendanceRecord"));
//for(var i in attendanceRecord){console.log("attendanceRecord model items："+i+"<>")};
var attendanceRecordDAO = function () {};

attendanceRecordDAO.prototype.save = function (obj, callback) {
  attendanceRecordmodel.create();
  // 终端打印如下信息
  console.log('called attendanceRecord save');
  var instance = new attendanceRecordmodel(obj);
  console.log('instance.save:' + instance.name);
  instance.save(function (err) {
    console.log('save attendanceRecord' + instance + ' fail:' + err);
    callback(err);
  });
};

attendanceRecordDAO.prototype.findByName = function (name, callback) {
  attendanceRecordmodel.findOne({name: name}, function (err, obj) {
    callback(err, obj);
  });
};


module.exports = new attendanceRecordDAO();