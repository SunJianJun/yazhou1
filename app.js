var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//ÕâÊÇ¸øsocketioÁôµÄ¼àÌý¶Ë¿Ú
var server = require('http').createServer(app)
  , socketio = require('socket.io').listen(server);

require('events').EventEmitter.prototype._maxListeners = 100;

server.listen(8012);

//载入所有的http路由处理模块
var checkAttendance = require('./dbmodels/checkAttendance.js');
var routes = require('./routes/index');
var usersroute = require('./routes/users');
//ÕâÐ©¶¼ÊÇÊý¾ÝÂ·ÓÉ
var movieroute = require('./routes/movie');
var personroute = require('./routes/personroute');
var messageroute = require('./routes/messageroute');
var pointroute = require('./routes/pointroute');
var fileuploaderroute = require('./routes/fileuploaderroute');
var fileupdirectiveloaderroute = require('./routes/filedirectuploadroute');
var processIDroute = require('./routes/processIDcardroute');
var heritagepointroute = require('./routes/heritagepointroute');
var panoimgroute = require('./routes/panoimgroute');/**/
var departmentroute=require('./routes/departmentroute');
var gridarearoute = require('./routes/gridarearoute');
var spotarearoute=require('./routes/spotarearoute');

var mobilegridservice=require('./routes/mobilegridservice');//网格业务接口
var personadminroute=require('./routes/personadminroute'); //部门人员管理接口
var maproute=require('./routes/maproute');  //地图功能接口
var personalinfo=require('./routes/personalinfoconfig');//个人信息配置接口

var concreteeventroute=require('./routes/concreteeventroute');
var concretesteproute=require('./routes/concretesteproute');
var concretearguroute=require('./routes/concretearguroute');
var abstractsteproute=require('./routes/abstractsteproute');
var abstracttyperoute=require('./routes/abstracttyperoute');

// var messageroute = require('./routes/messageroute');

var http = require('http')
, path = require('path')
, cors = require('cors')
, ejs = require('ejs');
var SessionStore = require("session-mongoose");
var app = express();
app.use(cors());
//express·þÎñÆ÷¼àÌýµÄ¶Ë¿Ú
app.listen(2000);

//app.use(express.bodyParser({ keepExtensions: true, uploadDir: '/tmp' }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit:52428800}));
app.use(bodyParser.urlencoded({ extended: false ,limit:52428800}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Â·ÓÉ¶ÔÓ¦µÄ·ÃÎÊÂ·¾¶
// app.use('/', routes);
app.use('/users', usersroute);
//将所有不同种类的路由都在服务器注册
app.use('/movie', movieroute);
app.use('/person', personroute);
app.use('/message', messageroute);
app.use('/point', pointroute);
app.use('/fileupload', fileuploaderroute);
app.use('/filedirectupload', fileupdirectiveloaderroute);
app.use('/processID', processIDroute);
app.use('/heritagepoint', heritagepointroute);
app.use('/gridarea', gridarearoute);
app.use('/department', departmentroute);
app.use('/panoimg', panoimgroute);
app.use('/spotarea', spotarearoute);

app.use('/mobilegridservice', mobilegridservice);
app.use('/personadminroute',personadminroute);
app.use('/map',maproute);
app.use('/personalinfo',personalinfo);

app.use('/concreteeventroute', concreteeventroute);
app.use('/concretesteproute', concretesteproute);
app.use('/concretearguroute', concretearguroute);
app.use('/abstractsteproute', abstractsteproute);
app.use('/abstracttyperoute', abstracttyperoute);



//app.use('/panoimg/:removepanoId',panoimgroute.dopanoimgRemove);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function setStaticHeaders(res) {
console.log("ÇëÇó¾²Ì¬Êý¾ÝÄÚÈÝ");
 // res.setHeader("Access-Control-Allow-Origin", "*");
}

//ÍÐ¹Ü¾²Ì¬ÎÄ¼þµÄ¸ùÄ¿Â¼
//app.use(express.static('ionicclient'));//²âÊÔ·¢ÏÖÖ»ÄÜÓÐÒ»¸ö¾²Ì¬Ä¿Â¼
// app.use(express.static('public',{'setHeaders':setStaticHeaders}));
// app.use("/",express.static(__dirname + "/public"));//为性能优化，不用nodejs去调用静态目录
//app.get('/movie/json/:name',movie.movieJSON);//JSONÊý¾Ý

module.exports = app;