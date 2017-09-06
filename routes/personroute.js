/**
 * @module 老的人员管理模块 url：/person
 */
var express = require('express');
var personrouter = express.Router();

//获取数据模型
var person = require('../dbmodels/personDAO.js');
//console.log('person数据模型是否存在：'+person);

var fs = require('fs');
var fds = require('fd-slicer');
var personAdd = function(req, res) {
    if(req.params.name){//update
        return res.render('person', {
            title:req.params.name+'|电影|管理|moive.me',
            label:'编辑电影:'+req.params.name,
            person:req.params.name
        });
    } else {
        return res.render('person',{
            title:'新增加|电影|管理|moive.me',
            label:'新增加电影',
            person:false
        });
    }
};


//添加一个人
var dopersonAdd = function(req, res) {

    //console.log("请求内容："+req+'<>person name in body:'+req.body.name+'<>method:'+req.method);

//req.body.data=personTestData;
//for(var i in req.body){ //console.log("请求内容子项："+i+"<>")};

    var json = req.body;
//var json =personTestData;
    //console.log('json._id>'+json._id);
    if(json._id){
    } else {//insert

        //console.log('调用了dopersonAdd方法');

        person.save(json, function(err){
            if(err) {
                res.send({'success':false,'err':err});
            } else {
                res.send({'success':true});
            }
        });/**/
    }
};

//保存人员的编辑信息
var dopersonEdit = function(req, res) {

    //console.log("请求内容："+req+'<>person name in body:'+req.body.name+'<>method:'+req.method);

//req.body.data=personTestData;
//for(var i in req.body){ //console.log("请求内容子项："+i+"<>")};

    var json = req.body;
//var json =personTestData;
    //console.log('json._id>'+json._id);
    if(json._id){//update
                 //console.log('调用了dopersonEdit方法');
        person.updateById(json, function(err){
            if(err) {
                res.send({'success':false,'err':err});
            } else {
                res.send({'success':true});
            }
        });/**/

    } else {//insert

    }
};

//根据手机号发回人员信息,用问号参数?mobile
var getPersonBymobile = function(req, res) {
    console.log('调用了personJSON方法 by params');
//for(var i in req.params){ //console.log("请求内容params子项："+i+"<>\n")};
    person.findByMobile(req.query.mobile,function(err, obj){
        res.send(obj);
    });
}

/**
 *添加人员位置 url:person/addlocation
 * @para {json} req - personid 人员id，curlocation一个定位对象{
 positioningdate: new Date(),
 SRS: '4321',
 geolocation: [119, 37]
};
 * @param {json} res -失败会返回{error：...}，成功会返回person对象
 */
var personAddLocation = function(req, res) {
    console.log('调用了personAddLocation方法 by params:'+req.params);
// //for(var i in req.params){ //console.log("请求内容params子项："+i+"<>")};
// //for(var i in req.body){ //console.log("请求内容body子项："+i+"<>\n")};
    person.addNewLocation(req.body.personid,req.body.curlocation,function(err, obj){
        if(err){
            res.send({error:err});
        }
        else {
            res.send(obj);
        }
    });
}

//
/**
 * 通过身份证解析后的json和手机uuid 和选定的部门id添加用户
 * @param {json} req - IDCard身份证识别方法返回的json 再添加 mobileUUid:"手机的uuid"，departments:[{department：“部门id”，role：“worker|admin|..”},..]
 * @param  {json} res - 注册成功返回{'success':true,"_id":“人员id”}注册失败返回{'success':false,'err':err}
 */
var personAddByIDCard= function(req, res) {
    //console.log('调用了personAddByIDCard方法 by params:'+req.params);
//for(var i in req.params){ //console.log("请求内容params子项："+i+"<>")};
//for(var i in req.body){ //console.log("请求内容body子项："+i+"<>\n")};

    var json=req.body;
    //console.log('personAddByIDCard UUid :'+json.mobileUUid);
    person.findByMobileUUid(json.mobileUUid,function(err, obj){
        //根据uuid查询用户
        //如果出错
        if (err) {

            //console.log('用户 personAddByIDCard err:'+err);
        }
        //如果没有错
        else {
            //如果查出这个UUID已有用户，一个手机不能注册两个用户
            if (obj) {
                //console.log('用户 personAddByIDCard 此用户已经存在 obj:'+obj.name);
                res.send(null);
            }
            //如果没有用户就开始存
            else {
                // delete json._id;
                //console.log('用户idNum:'+json.idNum);
                //如果身份证号不为空，这个后面还得加验证
                if (json.idNum) {
                    person.save(json, function(err,savedobj){
                        if(err) {
                            //console.log('用户save err:'+err);
                            res.send({'success':false,'err':err});
                        } else {

                            //console.log('用户已注册成功:'+json.idNum);
                            res.send({'success':true,"_id":savedobj._id});
                            if(savedobj.departments && savedobj.departments.length>0){
                                for(var index=0;index<savedobj.departments.length;index++)
                                {
                                    person.saveandRegisterwithdepartment(savedobj,savedobj.departments[index].department,null,savedobj.departments[index].role);
                                }
                            }

                        }
                    });/**/
                }

            }
        }
    });

}


//根据手机的uuid自动获取用户,错误返回{'success':false,'err':2000}
//1000 没有此uuid
//2000 未审核用户
//3000 已删除的用户
var getPersonByUUId = function(req, res) {
    //console.log('调用了getPersonByUUId方法 by params');
//for(var i in req.body){ //console.log("请求内容body子项："+i+"<>\n")};
    if (req.body.mobileUUid) {

        //console.log('req.body.mobileUUid:'+req.body.mobileUUid);
        person.findByMobileUUid(req.body.mobileUUid,function(err, obj){
            if(err) {
                //console.log('rgetPersonByUUId查询出差');
                res.send({'success':false,'err':err});
            } else if (obj) {
                //console.log('req.body.mobileUUid查询用户成功:'+obj.name);
                //console.log('\nreq.body.mobileUUid查询用户成功,用户的照片:'+obj.images.coverSmall);
                res.send(obj);
            }else {
                res.send({'success':false,'err':err});
            }});
    }else {
        res.send(null);
    }

}


//根据用户名密码获取用户
//三种角色，supper，departmentManager，worker
var getPersonByPcLogin = function(req, res) {
    console.log('调用了getPersonByPcLogin方法 by params');
    console.log(req.body);
    //for(var i in req.data){ //console.log("请求内容body子项："+i+"<>\n")};
    if (req.body.name && req.body.pwd ) {
        // //console.log('getPersonByPcLogin:'+req.body.name +'<>'+ req.body.pwd);
        person.findByNameAndPwd(req.body.name , req.body.pwd,function(err, obj){
            if(err) {
                console.log('findByNameAndPwd查询出错');
                res.send({'success':false,'err':err});
            } else if (obj) {

                console.log('pc端findByNameAndPwd查询用户成功:'+obj.name);
                // console.log('\nreq.body.mobileUUid查询用户成功,用户的照片:'+obj.images.coverSmall);
                res.send(obj);
            }else {
                console.log('没有数据');
                res.send(null);
            }});
    }else {
        res.send(null);
    }

}

// 初始化数据库里的用户
var initializePersons = function(req, res) {



    // //console.log('调用了initializePersons方法 by params');
    person.initializePersons(function(err, obj){
        // //console.log('route调用initializePersons errs'+err);
        res.send(obj);
    });
}

// 得到用户的最新位置
var getPersonLatestPosition = function(req, res) {
    // //console.log('call getPersonLatestPosition');
    //for(var i in req.body){ //console.log("getPersonLatestPosition 请求内容body子项："+i+"<>\n")};
    var personID=req.body.personID;
    // 调用方法
    // messageObj.getMessagesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    console.log('personID:'+personID);
  if(personID) {
    person.getNewPersonLatestPosition(personID, function (err, obj) {
      if (!err) {
        // console.log('getPersonLatestPosition 查询所有'+personID+'最新的位置:'+obj);
        res.send(obj);
      } else {
        // //console.log('getPersonLatestPosition 查询所有'+personID+'最新的位置:'+err);
        res.send(null);
      }
    });
  }else{
    res.send({error:null});
  }
}
// 得到用户一段时间内的位置
var getPersonPositionInTimespan = function(req, res) {
    // //console.log('call getPersonLatestPositionInTimespan');
    //for(var i in req.body){ //console.log("getPersonLatestPositionInTimespan 请求内容body子项："+i+"<>\n")};
    var personid=req.body.personID;
    var startTime=req.body.startTime;
    var endTime=req.body.endTime;
    console.log(req.body);
    // 调用方法
    // messageObj.getMessagesInATimeSpanFromWho("58cb3361e68197ec0c7b96c0","58cb2031e68197ec0c7b935b",'2017-03-01','2017-03-24');
    // //console.log('senderID:'+senderID);
    person.getNewPersonLatestPositionInTimespan(personid,startTime,endTime,function( err,obj){
        if(!err) {
            // //console.log('getPersonLatestPositionInTimespan 查询所有'+personid+'发送的消息id:'+obj);
            res.send(obj);
        } else{
            // //console.log('getPersonLatestPositionInTimespan 查询所有'+personid+'发送的消息为空:'+err);
            res.send(null);
        }});
}

// 根据用户id查询同事
var getWorkmatesByUserId = function(req, res) {
    // //console.log('call getWorkmatesByUserId');
    //for(var i in req.body){ //console.log("getWorkmatesByUserId 请求内容body子项："+i+"<>\n")};
    var userid=req.body.userid;
    //userid='598dbc99d354e88c0bf3212e'
    // 调用方法
    person.newgetWorkmatesByUserId(userid,function(err,obj){
        if(!err) {
            res.send(obj);
        } else{
            // //console.log('getWorkmatesByUserId 查询所有'+userid+'相关同事为空:'+err);
            res.send(null);
        }});
};


var getUserPicById = function(req, res) {
    // //console.log('call getUserPicById');
    //for(var i in req.body){ //console.log("getUserPicById 请求内容body子项："+i+"<>\n")};
    var userid=req.body._id;
    // 调用方法
    person.getUserPicById(userid,function( err,obj){
        if(!err) {
            // //console.log('getUserPicById 查询'+userid+'照片ok:');
            res.send(obj);
        } else{
            // //console.log('getUserPicById 查询'+userid+'照片错误:'+err);
            res.send(null);
        }});
};

/**
 * 通过url直接获取用户头像，get方法，./person/personPic?pid=111
 * @param {String} req - 人员id pid
 * @param {binary/image} res - jpeg图片
 */
var personPic = function(req, response) {
    console.log('call personPic:'+req.query.pid);
    // for(var i in req.body){ //console.log("getUserPicById 请求内容body子项："+i+"<>\n")};
    var userid=req.query.pid;
    if(!userid){
        // //console.log('getUserPicById 查询'+userid+'照片错误:'+err);
        imgData= "data:image/jpeg;base64,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"

        response.set( 'content-type', "image/jpeg" );//设置返回类型
        var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = new Buffer(base64Data, 'base64');
        var stream = new fds.BufferSlicer(dataBuffer).createReadStream();
        var responseData = [];//存储文件流
        if (stream) {//判断状态
            stream.on( 'data', function( chunk ) {
                responseData.push( chunk );
            });
            stream.on( 'end', function() {
                var finalData = Buffer.concat( responseData );
                response.write( finalData );
                response.end();
            });
        }
        return;
    }
    // 调用方法
    person.getUserPicById(userid,function( err,imgData){
        if(!err) {
            // //console.log('getUserPicById 查询'+userid+'照片ok:');
            if(!imgData){
                imgData= "data:image/jpeg;base64,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"
            }
            // res.send(imgData);
            response.set( 'content-type', "image/jpeg" );//设置返回类型
            var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = new Buffer(base64Data, 'base64');
            var stream = new fds.BufferSlicer(dataBuffer).createReadStream();
            var responseData = [];//存储文件流
            if (stream) {//判断状态
                stream.on( 'data', function( chunk ) {
                    responseData.push( chunk );
                });
                stream.on( 'end', function() {
                    var finalData = Buffer.concat( responseData );
                    response.write( finalData );
                    response.end();
                });
            }

        } else{
            // //console.log('getUserPicById 查询'+userid+'照片错误:'+err);
            imgData= "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQIAHAAcAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAGdAiYDASIAAhEBAxEB/8QAHAABAAMBAQEBAQAAAAAAAAAAAAQFBgcDAgEI/8QAVhAAAQMDAQQEBg0IBwQKAwAAAAECAwQFEQYSITFBBxNRYRQVInGBszI0NTZVc3R1kZWhstMjQlJWYpSx0hYzU3KCksElQ2OiCCREVGWDhJPR8cLi8P/EABsBAQACAwEBAAAAAAAAAAAAAAACAwQFBgEH/8QANhEBAAIBAgIIBAYCAgIDAAAAAAECAwQREyEFEjFBUWGBkTJxscEGIkJD0fCh4RQVM/EWI1L/2gAMAwEAAhEDEQA/AP6pAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACqiIqqqIib1VQAMrdNfafoHuiZVrXVDeMVExZlTzqnkp6VQq5da3apbmgssMDF3tfW1W/8AyMRfvGBqelNHpP8AzZIj6+0MrHos+TnFft9W+Bye46r1RHOieFW2HKZRsdK5yfS5+SL/AEu1P8IUX7l/+5gR+JNBPOLTPpLIjorNPg7EDklLrDVSuxG+2VK80fSvZ9rXl9Sa4uUTG+M7C536T6GobIv+R+yvoRVLcf4g6PvPV4kRPnyQv0bnr3b+regobPq2zXWZtPBVpDWL/wBmqWrDL6Guxn0ZL421MlcletSd48mFelqTtaNpAATRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8c5GoquXCJzU5R0t3i8Q3+mt1qu09vhSkSd/UNTaernubvVd6JhvJUOdyLVOft3CBLmvN76iRz19D1VF+lDB1OqyYo3x45t8phutN0Llz4ozb8pf0v4TB/bR/5kPXKH830MNprWu6mjgR7Nz43wo17F70LGwxVrqpfEVdWW6iY5WzSwzO2ZF4KxjFy3Pa7G7lvNJ/8AKMdJmM2Oa7dv95F+h5jsvz84dV1TrWgskzqOBjq+5omfBoVRNjsWR3Bieff2Ipza9XK5ahcvjqoR1PnLaKDLYG/3ub173bu5Ce+zQsiayl/JIm9c5dtLzcq8VVeaqeDrVUJwWNfSc5rvxNk1u9aT1K+Hf6yztNo8WDnHOfFXRsbGxGRtaxicGtTCJ6DR2xVWhiz2Y+0rY7VMrk23Ma3muclzExscbWM9i1MIc5qstbRERO7LmUevo0qmtw7Ze3gpFhtKI7M0mU7GpgtAY1c16x1Yl5u+Yo2RMRsbUa1OSH0AVzO7x41lJT1sPVVcEc8f6MjUciebsPqgrLvY8eKqpaqlbxoa2RXNx2Mk3ub6dpPMegMzR9IanRW6+C8x9PWEL465I6t43h81XSfWT1UlJbrO2lqIkRXpcJcO87WMztN/azhSP/TnUv8A4Qn/AKeT+c+Lra6a5xNbUNVJGLmOZi4fGva1f9OC8zH3iautbW0k7WuqpnJHT1DW/k5O1ypyciZVW8+W46fD+IddrbxTHfa0920f4V49Bgn8tac2xk6T7pblatypbVKi8GxzPie7zIqONZofXdJqqpnpY6GsoqqKNJVbO1Nlzc4y1UXfv7UQ4xTUsdPlzculdvfK/e969qqbPopVf6bPxzt8mf8A3GYO30lNTirHHydaflEJ9IdD4MOmtliNrQ7IADZOSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxzpabs62gfyfbmJ9Er/5jJG+6ZqVWV9jrkRdl3XUrl5ZVEe37jjnzmzTTQ0tJjwmd2wxV4NTirl7kTf9CczEyZaYa3vedorzn6u/6Gyx/wAGsz3b/V90FqdebonVufDDT5ZPPGuFcip/VIvfxVeXnU3sEMdPCyGBjY4mNRrWNTCNROSHjbaKG30UVLToqRxpjK8XLzcveq71JJ8i6X6St0jqJy7bV7o8vPzY2bLOW/WAAapUAAAAAAAAAAARrjRQXCkkpqpm3E/0K1eSovJU5KSQSraazFqztMDn00M9DWPoqxdqVqbUciJhJmfpJ38lTkvcptOh+F0mqLpUJ7GGjjiXzve538GnhqK1+NKDYiVGVcS9ZTyL+a/sXuXgpoehSlVNP1tfKzq6irq3I+NVRVjSNEYjV78o5fSfU/w90v8A9liimT469vnHj/L3pPWdbQ2rbtnaPv8AZ0MAHUONAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABluku1Pu2kKxtOzbqqbFVAicVexc4TzptJ6Tl+iKdtQya7KmWz/kqdVThEnFf8TvsRDrmt7jJa9LXCop1xUqzqofjHqjGfa5DDUNKyio4KWH+rhYkbfMiYOI/GWsnFirp6z8fOflH8z9HQ9E5bxgtTu3/9/Z7AA+ctgAByoxqueqNanFV3IegDMai15pvT8bnXG6QJI1P6qJ229fQhhem65a8odGR3SntrbXYanYa+Vs6PqGo9PJ2248hF4c964U2/R/Qes19o6ldq+M8o/wB+inNqMeGN7z/LqNvrX19TM+BG+L2JsMl5yvzvVv7KcM81zyTfYGe6Pampq9EWSetarah9KzaymOG5PsRDQmt1FOHktTwnb2XKy3XCV1bPQXBrI6tiq+NW7mzRZ3Ob3pwVOS9ylmcd/wCkPebxaW6cWyPljlWpVzXRplVfwRvpzw7zYS3++aPslvqekq3Q0DKl6QpV0sqSsSTZyjZGonkqqIvDKblNtHQep1GlrrMFd4nfeI7Y25dim2ox1ycOZ2lsgV1qvtru0SSW24U1S1eGxImfo4llhexTTXpak9W0bSufgAIAeukqxbRq9adVxRXhF3cm1LG8f8bE+lidp5EC+MlW3PmpfbVK5tVAqfpxrtJ9OFT0m06G106HWUy92+0/Ke1XmxRlpNJ73XwR7dVxV9vpqyBcw1EbZWeZyZT+JIPtMTu5OY25SAAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGJ6SZduWxUXKSqdUO70iYqp/zOaUp99JtVJHqm1sidhY6OZy8/ZPYn/4qZzxhVf2q/Qh8x/FVL59fO08qxEff7um6Pptp6+f8tACkjuk7V8trHp5sE+nuMEyojlWN3Y7h9Jy99PevczNkmaNs0L43q5GvRWrsuVq+hU3oZnUWh7Te7XLSPSop5H+xqI5nrI1fOq707jUg8xZ8mG0Wx2mJh4/mC79AmpI6x6UFXR1cKr5Mj5Nh3pRTtVJa9W6k01RWbpCr6Ga3UyxudDSRqklUrMbPWvzhURURfJRM8zag3uX8U9I5MXC60R5xG0/35MWuiw1t1orzVl5u1v09bmzVj0hgbiOONjcq7CbmtTzGah6TbFJKjXx10TVX2b4kVE+hyqX+qNO0eo6FlPWLIx0blfHJGu9iqmF86dxgXdG0VNdaCGpuUkkFS97VWOJGuRWt2kTeq8cKYeix6G+Of8AkWnrc/7H+2fSKTH5u1vb9ZrdquzRxTu24XK2enqIl8qNyb2vapgemCwdI2uqGjtVRX2iptlNJ1qLExYHyvRFRHSIqqmcKvscJvXcdRoKSGgooKSlZsQQsRjG5zhEPc90HTeq6O3rp7flnunn/fRiZtPjzfHG7gGhOgyupK5lVqG49TGzekFI9dp3ndwwdspbDb6R8T6WGSJ0eMbEz0RcdqZwvpLMFOu6W1Wuv181vSOUJ4sdcVerTlAFVGoqqqIicVUFZdG1U0nVxxuWJOzmpg46de20zssflVdMKraZEX9pf9EK99XO92XSv9C4PRlvqXf7vH95UQlw2nnPJ6Gf/JnROHFD3lDb9FVR1ui6SBV8qkklpV8zHqjf+XZNcYnoxRsMV8pWJhsddtomf04o1/jk2x9e6Oy8bSYsnjWPo5XWV6ue8eYADNYwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADmuv6VlRrOl21cm1b3Yx3Sp/8lK60J+ZMvpaXnSm6SlvNjqYnbKyR1FOq4/uPT7qmSfUTP9nK9fSfMvxHiyx0heaztE7fR1GgnfT1/vem+KZP7Vn0KfTLQv58279lpV5XtX6T0inlidmN7k9O40k0y7crf4ZnNo4Y0iibG1VVGphMrvPsiW6rWqY7abhzeKpwUlmtvWa2mLdqAAQLzdae007ZKjbfJI7YhhjTakld+i1Of+h5Wk3nq1jeRPM5frxbae62hs9fSsdFUPc9FlTLU6p6ZXs3qiBtquF4/KX6d9PTrwt9LIrUx/xHpvcvcmELiitlDQxJHR0dPCzsZGif/ZkVjHhn807zz7Ozn5/6280uUFBc6C4Z8AraeoVOKRSI5U9HElldcLJbq/Dqikj61PYzRpsSN70c3CoQHVNbYV/2hI+ttfDwrH5WBP8AiInsm/tJvTmnMjw6ZP8Axzz8J+09/wDjy3ebb9jQA/I3tkY18bmuY5Mtc1coqdqKfpQ8ADyq2yOp3tgXEipuERvOwi1txbCqsiRHyJx7EKqaqnmXy5HY7EXCEmO1Tu9krGenJKitUbd8j3PXsTchn1thxRy5ylyhf9EWdm/Lvx4Wzf8A+Sw6EYzovhay23WdjUaya4SI3HNrGtj/AItU2Z9d6KjbRYt//wAw5fXTvnsAA2DEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYzpWpGzadgrHZRKCqjncqcdhV2H+jZeq+gyXimFFx1kn2HWLjRw3C31NHUt2oKiN0T07WuTC/wATiTamup1lt9ZIramietNLhMK5W8Hf4m7LvScN+LtHkm+PUY52jsn7fdvuisvWpOPwWi2uBvspH+lUQ+mW+kReKu87ykVVVcqqqveGoqrhqKqryQ47g377trs1EUbImI2NqNb2IfRU22mqmTNc5VZHza5ePoLYwMterbbfd5KFc7pR22CaSrma3qoutVmfKVucbk55XCedSusFumlqFvF2b/tGZuI4l3pSxLwYnf8ApL2nvdbDTXO7W6uqFVVo1cqR48mTOFTa8ypktyzr1pj2p2z2/wAR9Z9vE32jk8qqohpYHzVMrIomJlz3rhEK5LnWT+VQ2qZ8XKSokSDa8zVy76UQsZ6aGd8L5o2vdE7bjVyZ2XYxlO89Sutq1js3n++AqVu0tNvulBNSx85mOSaNvnVu9E71TBaRvZNG18bmvjemUc1co5F/ifR8xxsiYjImNYxODWphE9Atasxyjaf7/e0Z9UXTVQit9w5XYVP+5vVeKf8ADVf8q9xfxTRyrIkUjXrG5WP2Vzsu7F796H7NGyaJ8UrGvje1Wua5Mo5F4opWacszLJT1MEUz5Y5ah0zdvi1FRqI1V542eJZa1cletafzfX/f1+fa7VqV1dXTQSK1kOGp+c5NyliCqlorO8xu8UPjOp/SZ/lPp18WlgkmqWNWONqvVW7lwiZLiSCKT2cbF9BXx2OO66ht1siz1T3eEVTeKJCxUXH+J2y36ew2eixU1uauCtedpeXvWlZtbsh0fQtBJbdJWynnTE/VdbKmOEj1V7vtcpegH2WlIpWKx2Q5G9pvabT3gAJIgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABz/pI0+nXNv9M1+Y2JHXMjTKuiThIic1Zv8AO1V7EOgHhX1LKOiqKmb+rhjdI7zIiqv8DG1empqsNsOTsn+7rtPmthyRerk8NupVY17XLK1yIqO2tyovPcTIoY4kxGxrfMhnLRJVWq3U9TUo6WgnZ18jWN30ivXawiJxjTPBN7cdnDSRSMljbJE9r43ptNc1coqdqKfFdTW1bTHW61d+11kvoAGK8AAAAAAAAAAAAPCsq4KKndPUyJHG3dld+V5Iic1XsQ9iJmdoH7W1UVHSyVFQ7ZiYmVwmVXsRE5qvBENN0a0LPE3jmRzX1d0RsrlT/dRpnYi/wpnP7SuMTS089dVR11wjWJka7VNSu4xr+m/kr+xPzfObTowl2bZcqDO6irpGsTsY9ElRP+dUO0/B0Yq6u9Zje/V7fDnzj/bA6T34HLx5tkAD6Q50AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFulY23WyrrZGueymhfM5reKo1qrhPoKSC9X6eCOWPTjdiRqPTNezgqZ7CM3iJ2lOuO1o3j6w0oM7411B+rjf39n8o8a6g/Vxv7+z+U84keftKXCt5e8fy0QM7411B+rjf39n8o8a6g/Vxv7+z+UcSPP2k4VvL3j+WiBnfGuoP1cb+/s/lHjXUH6uN/f2fyjiR5+0nCt5e8fy0RnukR7o9CX90edpKGX7qn5411B+rjf39n8pDvE99udpraGTTrEZUwvhVVr2LjaaqZ4d5G94tWYjf2lPHjmt4tO3KfGP5ZuNEbGxG7kRqImPMUc1pq4Lki2ao8BpJUV1Q3CPZtclYxfYu7V4dyqT7FO+e00yzorahjeqmavFsjPJei+lFJ58Omb4L2pPb2Tv/DqonZVeK6r4auGfNFj6Ng+VjvVLvjqKW4M/QmZ1D/Q5uU+lC3B5xp74ifSDdVwXmLr2U9fDNQVD1w1s6JsvXsa9PJXzZz3FoedRBFUwPhqI2SwvTDmPTKKnmKFsF+o7vS22ytp66mna5YWVcqsdHsplWbe/O7emUXn2F2DTzq7xjwx+ae7x+X+/d5MxEbzyaIBLdqVjEWewbbuaU9bG5E/zbJ8dRef1euX+aH+cyr9BdI0nacNvbf6Koz4p/VHvD7B+Mo79L/Vaeq075p4WJ95V+wqNQs1Zbkps2y3U0dRO2nbI+qWVUcqKudlETgjVXjyPf8AotfFZvbFNax2zPJ7GbHaerFo3+cJdwudNQqxkqufUSf1cETdqSTzN7O9d3eRkfeKveyOmt0a/wBr+Wl+hFRqfSpJttuhoWvciulqZd81RJvfIvevJOxE3ITTXTalOVI385/j+d1qq8VTu3y3i5K7nsOZGn0I0ivstVBcIq6nrZKySPyUirlRyNTmrHIibLu/C54F+D2NReP/AFBuFp0cKvjzUiJ7Dapl/wAXVrn7EQq+J66BqbtHS3GvobOlXT19W6SKZapseWMRI27lTOPIVfSdL+D6TOum/dFZ/wA7MLX88Ex47OlgzvjXUH6uN/f2fyjxrqD9XG/v7P5T6dxI8/aXP8K3l7x/LRAzvjXUH6uN/f2fyjxrqD9XG/v7P5RxI8/aThW8veP5aIGd8a6g/Vxv7+z+UeNdQfq439/Z/KOJHn7ScK3l7x/LRAzEuoLpSS0vjGxdRTz1EdOsjaxj1ar3I1FxjemVQ057W0W7EbUmvaAAkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKjWHvSvXyGf1biZZ/cmi+IZ91CHrD3pXr5DP6txMs/uTRfEM+6hD9fot/b9UsAE1QAAAAAAADm+sbctiu8t1jTFprnItSqcKefgki9jXbkVeSoi81KW0yyT1d0fJI5WsqepYxV3MRrW8POqqp1+aKOeJ8UzGyRvarXMcmUci8UVOaHK7lYm6Ru8jYOs8S3CRHROe5XJTzYROrVV/NciJsqvNFTsOE/E3QXK+twR2/FH3j7t70frIvHCv29z3BFuNW6ip+uSmnqGo5Ee2FNpzW83Y547E3n3Q1lPXU6T0czJol3bTV4L2L2L3KcB1LdXrbcm0eVxbWosc1A5j1Znbp34RJU7nfmuTkvDt7S46PaGe71cWoKpng9ND1kVJTq5Fk2s7L3yY3Iu5Wo3zqvIhmg6MkctouMn+5kuE7ol5K1MIqp/iRx1f4QxY8usmb13msbxPh/d2F0jea4J27+TYAA+nubCn1XZvHdq6iOVIaqKRs9PKqZRkjeCqnNFRVRU7FUuAvAhkx1yUml43ieUpUvNLRavbDi1JNcblJ+UayiggldHIsUiSLO9jlRdh2N0eU44yvcXJXafRWWmGF6bMsCvglavFr2uVHIvpT7SxcqNarnKiNRMqq7kQ+H6yIrmtStdoiZjb1dfuHzLH1sT41VzUe1W5auFTKYyhCo7nHXVOxRRvmpmou1VJujz2NX87zpuTtPuudU1Ekdttbdu5VaK2PsibwdK/sa3PpXCJxI4dNly5a4aR+ae4mYrG88ldZHVd+t9stVHI7w6qgRaidN/UQp5LpV/aXCo1OarnginZrfSQ0FDT0dIxI6eCNsUbE/NaiYRCs0npug0za2UdvYqrhOtmeuXyuRMZcv8E4JyLo+vdD9E06NxzEc7WneZ+3yhzmt1f/ACLfl+GAAG3YIAAAAAz2tPadt+c6T1zTQmf1p7TtvznSeuaaAhHxT6LbfBX1+wACaoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVGsPelevkM/q3Eyz+5NF8Qz7qEPWHvSvXyGf1biZZ/cmi+IZ91CH6/Rb+36pYAJqgAAAAAAAA8K+jp7hRzUlbCyemmbsvjemUch7gTG/KXsTtzhze46eutmcvgccl1t6ex2XJ4TEnYqKqJIneio7tReJnqi1T11X1tDY73BcHbuuji8G2v77n+SqedFO0jBzeb8LaLJl4td679sRPJsqdKZa12mImXO7Voa6zUbEvd9ka5y/lIqSJjVRv6PWYzntciJ3YN5b6Ont9FBSUUTYaaFiMjjbwaiEgG50mg0+jiYwUiu/h3sPNqcmf45AAZagAAGXvGjaWuuMtdSVlXb6ibCzeDq1WSqiY2la5FTaxhMpjPPJirho270tQ5bjBPqCnR2Y3RytaiJy2oF2W578u9B10Gq1nQuj1e9r12tPfHKfdm4dfmxconePNzCltd+rVbFTWpaBnDrq17UaxO5jFVXebcnebfTen6axwSdW509XMqOnqpcbcq8uHBqcmpuT6VLgHnR3Quk6O3thr+ae+eco6jW5M8bTyjyAAbZiAAAAAAAAM/rT2nbfnOk9c00Bn9ae07b850nrmmgIR8U+i23wV9fsAAmqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFRrD3pXr5DP6txMs/uTRfEM+6hD1h70r18hn9W4mWf3JoviGfdQh+v0W/t+qWCDe7tQ2S2y190nbT0sWNp6oq71XCIiJvVVVUREQwUnSk11hqrzDaZvAZVWC1RuenhNwnRVRWtiTKtaipvVd+EXcTVOlg51b+kSShs9DNqWzXmBzljiqKzwBYYGyPcjUw1zlfjKonDvOigAZzTl9rquvvNFerctBJQ1GzFMiqsNRC5Msc16/nY4pyUraTWsVJqO82/UVTbaSkh2JqKsSdrY5YnJhWuVXbpGqi5TsVFA2oK63Xy23O0rc7dWRVVAiPXr4V2mqjc7WFTjjC8DIUerLslVXXSCjmvul6qkbW26a3w4lbvRqwqxyorlXO0i9mQOgA5tUdIl/ghfUP6PL8lLGiue5ZYtpGpxXZRc8DaWC+0d907SXqgWR1HUw9cxFb5WOaKic0wqYAtQYNNW6ivOz/RfS07KZVT/rt4f4KzHa2NMyL6UQrNW9JdPZekSktD6rq6Clp3S3Dq6Z873yOROrjbsoqtwmXKvYqIB08FZpy+23UdqiuVmqmVVHIqoj2oqYVNyoqLvRU7FM/qOp1jDe5mWWo0uyg6tJGNr3ytmRETylXZ3bOeYGzByHTOttZ6gpWzUbtGNSSV8cDJamVr50auNtrd67Kqi4zv7jqFjW5OtVOt7ZSMuOF65tIrliRcrjZV2/hjjzAnAyWoqrU0V5WGzVmnI6bqetSKu6zrsJ7J2Gr7FN28x2n9capvNnguK1+iqGOdXLFHVzSMe5qOVEcqbW5FxlO5QOvAptKy3me3ulv0lqllc/MT7ar1jVmExvdzznhuIOp9RXWz18UNBpe43eB8e2s9LLE1GOyqbKo9yLngvpA04Obz9KMlLc6W21ukNQw3CqRzoadGwPe9G8XIiSZwnau41emL/LfFqeusl2tfU7OPD4ms6zOfY4cucY3+dAL0GS6TdR1+mNP09da6aCpqJK2Cm6qZyta5JHbPHkuVTeQ21HSLUeW2g0vRt/QmqZ5nJ6WtRANyDI6B1LX3uW90N5paaC42mr8FmdSvV0MmWo5HN2t6bl3opcanq7vR2zrNP2yG5VqvRvUy1HUNRq8XbWFzjsAtgYFrekurRHPl0rbkX81GT1Dk9OWoRdJarv0vSBV6XuzrZc201L18tbbmPjSB+cJHI1VVNpexFyB0gEK917bVZq+4SJllLBJOqdqNarv9CHo27z37StrutVSpSTVkDZ1gR+3sI7em/CcsKB4a09p235zpPXNNAZ/WntO2/OdJ65poCEfFPott8FfX7AAJqgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABUaw96V6+Qz+rcTLP7k0XxDPuoQ9Ye9K9fIZ/VuJln9yaL4hn3UIfr9Fv7fqlOajkw5EVMou/wA5x+x1FzodHOhtUUFN1F5rknuVS1qsoIWzOc9+yu9yq1VRMbt+86bqjxkunrg2xMY66Ohc2m237CI9UwjlXuzn0GKvvjrT+pNLTyw3q82ylt81PVPo29a+SddhEfIxFTKYRy55KpNUo7NXVFfqjUtTp62UmpdONrqeqa10yNdHU9U3afAr02FwqZVMphV3KdQ1JTXWss8kNirordXPVqJUSw9b1bc+VhucbWM4zuyc+s1ruVztb7Tb4tS2qKCd9ZQ3CuSOJaZ+cticxHq6ZuVd7JOG7PA6jC2VKZjZXtdOjERz2twiuxvVE5JnkBzDRFl8dpqu36mrqjUFkpbiyKmkuDkVVkjYnWr5OE2Ue7GOG5TI6dp5bfJqHWlq0XaaqwPVVpUWRkT0pYcor449hUVXKjnZVUVdxfUuj9e0ukH2WOttkMUnWU7kplVXyNmlVZah73J7JGquGt5rvXcX2tlrG6fk0TpayVznz0jaNlWsaNpaaFzdlzlkVd6o3PkomcgbOimprnpuGoomIykrKVJY27KNw17MpuTuU4xpmtuc+kOi+w2u8TWZa6OodLVRNa5XJCi4jRHblVVXh3HbrbQst1opaCHKxU0DIGd6NajU/gYPQejaeu6MrVZtX2lHSUsszmxy5a+NVlerXNc1ctXZcnBQPK0y3Sxa/qLBU3ysvVDLaH1si1iMV9PI16NTe1qYa5FXcvYe/Q7Upb+ha01j0y2GlmqMfso97v4FtUaXt2mdKX1NLWlErZ6WRERiq+WZ+wqMRXuVVXevNdx76JsK0XRtaLJXMdG5LcynnYu5Wq5mHp9KqBxuz3mkvWlEr59dXxusvBJKuGBsr2QxPY10mxsbKMc3DcKqque06Boe8UlnrbNSz0UkDtUUyXNK+SXb66re1HPhXKZTDcbKZ4JhOBVt05rp2kYtEuprZHbms8DdekqVV60vDdDs5STZ8njg2uobhLpukt1La9NXC79TCrKdaZrFSFWtRrUcrlTZynNOWQKroiYxkus+oajaddQ1SMa32KYRiLj05KjpBstnvHSzp+LUFPHNRLaqt7kkcrWpsOY7KqipuRFXdwNV0W2Cs09pKKC7K1bnUzS1tWjVyjZZHK5WovPG5PQVnSHpOp1ZqK1UvgrYLY2F/htxbJ+VWJVTapmJndt4Tad2JgDn99tunrl0Pag1DbNLUNp6mRzrVVRRo2aRjZGpHLnGW5XO7K5Q7xbXSOt1M6ZVWRYmq5V5rspk57qbTF1tjKp1ugbqHTk7mvnsFUqNWJG4VPBnbkREwn5N27duU6NSSrPSQyrE+FZGNcsciIjmZTguOaAcRv1hpdaXvpEu1ydUK+zQut9EyOZzGt2IdtyqiLvy9c4XcU1o0/RzQdHk1x0laKKnqauJiysVk3hzJKZy7T02cpvai4XO9d3A32otO3+y3y/3HTdFFdLbfocVtD1yRSxTIxWdbGrvJVFTGWqqGLtNmvFssmlqO1aIuzLjb62nrKx0k8bYp3xxPY7Zc567OdrsRO4DaaDpIdN9KGo9O2lFis7qKnuEdKiqrIJHOc1yMReCLhFwaHWusGWSSC2WqmW56krExS0Ea43f2ki/mRpzVfQR9A6cuVHcrvqHUroFvl1ViOhp1V0dNCxMMiav53HKrzU0VusNst10uFyo6OKKur3I6onTe5+EwiZXgm7gm7IHLtHwXaw681ZNcc36+Ja6eqf1bWsc97lfmGJV9jGmyiInp4nSdJ6mt2p7etTbnuSSN3V1FNKmzNTyc2SNXe1U+3kU1ptldF0q3+4zUz22+e30sUUy42Xva56uROe7KF+zT1sZqN19jpWx3R8K075mKresZlFTaRNzlTG5V3oBn+l6gq7jo5YrfTyVFRHWUsyMYm/DJmOVfMiIqmStms6i4a/pLsr6x9kr6iS1WmlhfiOZrEV01W9F4tRUw3ng2XSTQ3q9UFJY7Ox0NJcZequFc16ItPTomXI1OKuenkoqcMlLq6yVli1DpG8afs0lwttlgnpHUNK5rZI2Pa1rXsRyojsYwu/O8CV0MQyy6fuV5qYnxzXm51NajXtVrkYr9hiKi8NzftOgGOseodR3a7wNdpSe2WjyuuqK+pYk3DydmNuefHKmuqHSNgkdCxJJUaqsYrsI5cbkzyA5p0zw3qmoo7rHdK1umqbZ8Z0NCqQzrFnDpGyoiuXGUy3duRd5tNI2ay2aywR6cpYYKGZqTNdGm+XaTKPc5d7lVOamE1Ve9YXrTlfYm6Hq4LjXQuplnWrikpWI5MK/bRc4RFXdjJ0PTNtWz6dtltc/rHUlNHAr/wBJWtRFX7AKjpUVU6ONSYXCrQTJnztVC7sNOlLZLfTtTDYqeONE7MNRCh6U6S912iLjS6ZhgnuMqNYkcyMVHM2k20RH+Sq4zx3FzpltyZp63NvnVeNEp2JU9V7HrMeVjHf2AQtae07b850nrmmgM/rT2nbfnOk9c00BCPin0W2+Cvr9gAE1QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqNYe9K9fIZ/VuJln9yaL4hn3UIesPelevkM/q3Eyz+5NF8Qz7qEP1+i39v1SwATVAAAAAAAAAAAAAAAAAItJcaOsqKmClqYZZ6Z+xNG1yK6N3YqciJV6gt1JfqOzVEzmXCsYr4Y+rcqORM58rGE4LxIzesRvMpxivM7RE79vp2rUFZqK+0Gnbd4ddplhpUe2NXo1XYVy7tybywhkbNCyWNcse1HNXGNy7z3rRv1d+byaWisXmOUvsAHqICDWXi3UVUlNWV1LTzrGsqMllRiqxFxtb+RUO13pdtR1K3239ZnH9amPp4ELZaV7ZhbTT5b861mfRpQfMUjJomyRPa+N6Za5q5RU7UU+iaoAAAAAAABn9ae07b850nrmmgM/rT2nbfnOk9c00BCPin0W2+Cvr9gAE1QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqNYe9K9fIZ/VuJln9yaL4hn3UIesPelevkM/q3Eyz+5NF8Qz7qEP1+i39v1SwATVAAAAAAeVLUwVcKTUs0c0SqqI+NyORVRcLvQ57036mlsunY7fQvc2uuSrGisXymxp7JU71yjfSW3RXpb+iul4oZ8+G1KpNUJnc1ypuaidybvPkx4z9bNwqx2Rzn6M2dJFNLGovO0zO0R47dstiCt1HeqTT9mqblXuVsEDc4Ti5V3I1O9V3HKaC79Imrqd98sb6ajoWS7NPSLj8smcLlypvROa5TONyDLqK45iu0zPhBptDfPWcm8VrHLeZ2jfwdoPKepgp1iSeaOJZXbEaPcibbuxM8V7jA9FmuavUk9fa7zBHFdaLKudEmGvajtld2dyovoXJi7gk3Sb0pLRtkf4jtblRysdhNlq4cqL2ucmEXsQrvrK9Stscbzadoj6+y/H0XeMt6Z56sUjeZ7flt47u7me15qOLS2mqq4SYdMibEEa/nyL7FP9V7kNAxqMY1rdyImEQwGv8AQ1fqu+UVS68pR26kYrmRti2nMkzna3rhfTwwXaibxjnhxvLF0VcNs0cedqxznz8uXiyunNK6003QpfrTUQVddXNSeut9QzDnqqq7COz7Lf2pvXmRNZ1Orm6303X1Vut8NWsro6CPrco5XImWvXuzjO4m9E8F8vdVUXip1FcpqKhq3RsgkcqtqURq+y37uLe0has1Nc9VV9iqrVpe8o611fXrmFVR6bt2UTdwNTPUjBE1mY322jt32nnLpazknVzF4rbaJiZ2223ido7Y38Ply3ePSfcNYV9NabRfbTQQrVVbVgZTTbTpnt3bK79yeUh2fS9RcKqxUkt4o20VcrVSWnauUZhVRERcrywcj1BUauv2q7LeItH1cTLaquZTzStRHuVc5Vd2OXLkdG0XdNS3GWqTUtlitkbGtWFWSbe2q5znevDcZOln/wC607zO/KN4/wBNf0hTfS0rEUjbeZ2mN95nsiN57tplqXJlqoiqmU4pyMBpezam03ql9ElX4z03U9ZP11Q/8rA7Ocd6qq+Zd67ibrq7aqpq2lt+lbTHO6oYrlrJXZZFhd6Km5EXhvVVz2GZ0LfNWN6R6qwagrqetZFTrLL1TE2Y1VGqmFRE/SwqF2bLSctazE7xO2/d8mNptPljT3vE1mJjfaec7R3+Ux3c4U9RbrPqjpe1BT6pm2I6ZrGU0TpuqR6Iibs89y5wnaX2rrJ0e2TTVarqS3Ml6lyQoyTbmV+PJ2d6rxxvKPWd8sl4kmqr9oS8KsGWuq0asWGouEVXJjd2ZKqzs07H1VbRdHN9rY3Ij43yK+Vjk7U3KioYE2pE2rEVmZ35zE78/RuIx5LVpaZvWKxEdWJrtvEePWjt+TpHQjDVQ9HlAlZteW574kdyjV27HdxVPObwhWSqdW2ijqX0klG6WJrlp5Ew6Ld7FU7iabfDSKY61id9oczq8k5c98kxtMzIAC1jgAAAADP609p235zpPXNNAZ/WntO2/OdJ65poCEfFPott8FfX7AAJqgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABUaw96V6+Qz+rcTLP7k0XxDPuoQ9Ye9K9fIZ/VuJln9yaL4hn3UIfr9Fv7fqlgAmqAAAAAHGJEbqrp6WKfD6Szx5ax3BVZhfvvRfQbXpavlZp7Rk9bbZ+oq+tjZG/ZR3Fd+5d3BFKbVfRe646hmvdivE1rrpl2pNlFVFdjCqioqKmeabznfSPYdS2xLbb7vqGa6srJfIi8tzWKioiOXP8Ae/iafJbLp6ZN685mecT49nm6fDj0+ty4OreNqxEdWYnu5z5c2l6aZa+fSOk6Solc+Wqkas71REzJsJjKJu4ud9B1FVodJ6UyuI6K3U30o1P4qv2qZKLo+rbho2ez6ku76usSp8IpqtqucsKo1ERPK5cd3eR67Qup9Qx09FqnUkUtrhVFWOkg2HzY4K5V5/T5i6sZaWtkikzNojbs5fP6sa9tPlx0w2yRFaTMzynnvz3jl6d2zCdH81VbtP6x1jKisdJE6CBf0pXvyqp5lVv2nQugi0R0GiWVuEWe4SOlc/nsoqtan2KvpNXWaWtdRpR+nkg6q2rEkSNjXCtwuUci9ud+e053B0XaktLXRWHV89PTZVUjw9mM9yKqEKafJp7VmK9aIifee1bl1uHXY8lZv1JtaO2J+GI2iOXu0FNfrpUdMVVZY6r/AGVTUaSvhRjfZ7Kc8Z4uRfQe/SNJq2Nj1066hhtrKZ8lTPMmXtVEXKInm7jlOibDqK+6su0tLfJIqmme1s9U9XotS1HYxlN+PJ/gf0JeKPxhaa2jRyNWohfFtdm01Uz9pPT2vqMV9943mduf+FOtpi0WfHFerbaIiY2/zPnO/wDLjfRJo2quVhtt1df66npW1CzMooNzFc1/F2/C5xv3Hp0gakvNR0lR2yw3eG2toYka99ROkcTnOw521nc7crURMclJ2gKfXVhpKKxJZaVlHBUq6WrmnTDo1dlyNRF8+FwUup6K36e6SLtW6vs0lwslxRHwztj20jdu+hdyoqZzjBjTHU09YrE15xvM7x/ebYVtGTWZLXmL8rdWI6s9s+HfO3dPNcM03q2qpJqum6QEqauNiyJFTuzGqpvxuXGPQa7oo1HVam0lHV3BGrWRSuglc1Mbatwu1jkuFTPec6pdUaXtzayPo6sVfLd66LwdEax2w3PBcKq8O7HedK6MNOzaY0hS0NWqeFvc6aZEXOy93LPPCIiGRpZ3yx1J3jad+czHl297C6Rjq4J4sbTvHV/LFbbbTvyju7GoqZmU1PLPMuI42q9y9iImVOR9H1ZNSWK/a3kt9RcKy5VapHBAmX9Uj8Iid2V/5Tp+o6Ka42C5UVM9rJ6inkiY53BHK1UTJy3TGjdYVFutlnu9Sy0Wa3ydZilkzNO5HbSb0Xdhf/pS3U9fiV6sTPKdvmxtBwuBfr2iN5jffvrG8zEbc+c7dis6R9XXnUdvptPs03XW6WvmbsJO9EdMjVzsomE5439xpLddtesgit1u07Z6RKeJjWxzVaOexmMNVWo7PLjg9rTR1d86Ybhc62mniorRAlPSrMxWo9y5TaTPFPZrnzEjW+kbhDeP6U6Pk6q8sT8vTuXyKpqcsduE4c+5THimSetm3mee3LaJ2j08WbbNp4imm6tY5b895iLT3Tz8NufPZoNGpqjZq3asW37Tlb1DaTPkpv2s59BpCu07XVNystJWV1FJQ1MzEc+nkXKsX/8Au3f2libPHERWNp3+bQ57TOSd4iPKOwABNSAAAAAM/rT2nbfnOk9c00Bn9ae07b850nrmmgIR8U+i23wV9fsAAmqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFRrD3pXr5DP6txMs/uTRfEM+6hD1h70r18hn9W4mWf3JoviGfdQh+v0W/t+qWACaoAAAAAD8VqKuVRMn6AAAAAAD8RqJwRE9B+gAD8exr2q17Uci8lTJ+gDzigihTEUbGf3Woh6AAmdwAAAAAAAAAAAAAAAGf1p7TtvznSeuaaAz+tPadt+c6T1zTQEI+KfRbb4K+v2AATVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACo1h70r18hn9W4mWf3JoviGfdQh6w96V6+Qz+rcTLP7k0XxDPuoQ/X6Lf2/VLABNUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM/rT2nbfnOk9c00Bn9ae07b850nrmmgIR8U+i23wV9fsAAmqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAES8UfjG01tFt9X4TA+HbxnZ2mqmcc+JS01u1LT08ULLva1bGxGIq25/JMf2xpQRmkTO6dck1jaPoz/gep/he1fVz/AMYeB6n+F7V9XP8AxjQA84cefvL3iz4R7Qz/AIHqf4XtX1c/8YeB6n+F7V9XP/GNABw48/eTiz4R7Qz/AIHqf4XtX1c/8YeB6n+F7V9XP/GNABw48/eTiz4R7Qz/AIHqf4XtX1c/8YeB6n+F7V9XP/GNABw48/eTiz4R7Qz/AIHqf4XtX1c/8YeB6n+F7V9XP/GNABw48/eTiz4R7Qz/AIHqf4XtX1c/8YeB6n+F7V9XP/GNABw48/eTiz4R7Qz/AIHqf4XtX1c/8YeB6n+F7V9XP/GNABw48/eTiz4R7Qz/AIHqf4XtX1c/8YeB6n+F7V9XP/GNABw48/eTiz4R7Qz/AIHqf4XtX1c/8YeB6n+F7V9XP/GNABw48/eTiz4R7Qz/AIHqf4XtX1c/8YeB6n+F7V9XP/GNABw48/eTiz4R7Qz/AIHqf4XtX1c/8YeB6n+F7V9XP/GNABw48/eTiz4R7Qz/AIHqf4XtX1c/8YeB6n+F7V9XP/GNABw48/eTiz4R7Qz/AIHqf4XtX1c/8YeB6n+F7V9XP/GNABw48/eTiz4R7Qz/AIHqf4XtX1c/8YeB6n+F7V9XP/GNABw48/eTiz4R7Qz/AIHqf4XtX1c/8YeB6n+F7V9XP/GNABw48/eTiz4R7QzFTZb5XyUjbhdaB1PDUxVDmw0LmOdsORyIirKqJnHYppwD2tYr2PLXm3KQAEkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/2Q=="

            response.set( 'content-type', "image/jpeg" );//设置返回类型
            var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = new Buffer(base64Data, 'base64');
            var stream = new fds.BufferSlicer(dataBuffer).createReadStream();
            var responseData = [];//存储文件流
            if (stream) {//判断状态
                stream.on( 'data', function( chunk ) {
                    responseData.push( chunk );
                });
                stream.on( 'end', function() {
                    var finalData = Buffer.concat( responseData );
                    response.write( finalData );
                    response.end();
                });
            }
            // response.send(null);
        }}

    );
}

/**
 * 根据部门统计相关人员
 * @param {json} req - 部门id {departmentID:''}
 * @param {json} res - 根据部门统计相关人员：{error:错误信息,{统计信息}}，统计信息 具体如下：
 { departmentID: 'ObjectId("58c3a5e9a63cf24c16a50b8c")',单位id
   fullcount: 14,单位总人数
   malecount: 13,单位男性人数
   femalecount: 1,单位女性人数
   unknownSexCount: 0,单位不知道性别的人数（统计图表上不用显示，这种多半是身份证号有问题的测试人员）
   titlescount: 各种职位的人数
    { '5952112dea76066818fd6dcf': 1,前面是职务id，后面是人数
      '5952112dea76066818fd6dd0': 3,
      '5952112dea76066818fd6dd3': 1,
      '5952112dea76066818fd6dd4': 1,
      notitle: 8 },有可能有无职务的情况
   youngcount: 7, 18-35之间的年轻人数
   middlecount: 3, 35-50之间的中年人数
   oldcount: 1, 50-60之间的老年人数
   noage: 1, 没有岁数的身份证异常人员
   下面这一条是供测试的，可以查到具体的人
   names: '58dbe6e28efc529008caedce,韦小宝;58e1aa13c6cfe9b40853ed6d,王艳杰;58c043cc40cbb100091c640d,谭剑;58e0dd85e978587014e67f78,刘利军;58cb3361e68197ec0c7b96c0,申康呈;58ddcce6ac015a08090007ce,李晓晨;58dd91ebac015a0809ffffba,赵本山;58cb2031e68197ec0c7b935b,周鹏宇;593a6d2cf06286140edf82f1,吴兴学;593a6d2cf06286140edf82f4,王业鑫;593a6d29f06286140edf82ea,赵新天;593a6d2cf06286140edf82ee,刘文光;58caf425a56e60640bc5a188,高磊;58bff0836253fd4008b3d41b,谢进成;' }
 */
var getDepartmentPsersonelStatistic=function(req,res) {
  var dep=req.body.departmentID;
    if(dep){
        person.getDepartmentPsersonelStatistic(dep,function(err,obj){
            if(obj){
                res.send({success:obj})
            }else{
                res.send({error:err})
            }
        });
    }else{
      res.send({error:"统计需要单位id"})
    }
}
/**
 * 对一个人 一段时间内的定位数据进行统计
 * @param {json} req -
 *  personid-人员id ,
 *  sartTime-开始时间 ,
 *  endTime-结束时间 ,
 *  timetype-时间分割类型"day"/"week"/"month" <br/> 传入参数 {personid:"58c043cc40cbb100091c640d",sartTime:"2017-01-01",endTime:"2017-08-17",timetype:"day"}
 * @param {json} res - 回调函数, 返回值 有两种，   没有错误时 callback(null, obj);   有错误时  callback({error:err}, null); 返回的统计数据内容obj：
 * [{"
 * _id":"2017-07-19",//按照时间分割类型timespan 返回的具体时间值 这种 是 按 day分割的，如果按week分割，这里可能是33或者34，表示一年内的第33周或34周
 * "all":6,//定位点数量
 * "positionsCount":0,//一个timespan内的所有定位点
 * "morningpositionsCount":0,//一个timespan内的上午定位点
 * "afternoonpositionsCount":0,//一个timespan内的下午定位点
 * "allLocationPoints":null,//调试用，可以返回期间所有的定位点 目前返回是null
 * "name":"谭剑",//统计人员的姓名
 * "pathlength":5,//一个timespan内的定位点总长度，可以显示为人员的行动路径
 * "averageSpeed":0.1636//一个timespan内的平均速度，km/h，公里/小时
 * },....]
 */
var countByPersonLocations=function(req,res){
  var personid=req.body.user,
    sart=req.body.start,
    end=req.body.end,
    timetype=req.body.timespan;
  // console.log(personid,sart,end,timetype)
  if (!personid || !sart || !end  || !timetype) {
    res.send({error: "统计参数不完整"});
    return;
  }
    person.countByPersonLocations(personid,sart,end,timetype,function(err,obj){
      if(obj){
        res.send({success:obj})
      }else{
        res.send({error:err})
      }
    })
}
// 测试
// daoObj.countByPersonLocations("58c043cc40cbb100091c640d","2017-01-01","2017-08-17","day",null);
// daoObj.countByPersonLocations("58c043cc40cbb100091c640d","2017-01-01","2017-08-17","week",null);
//获取人员所在部门
var getpersondepartment=function(req,res){
    var userid=req.body.userid;
    console.log('--------------------------------')
    console.log(userid)
    person.getpersondepartment(userid, function (err,obj) {
        if(obj){
            res.send({success:obj})
        }else{
            res.send({error:err})
        }
    })
}
//考勤统计 timespan:day,week,month
var countByPersonAttendences=function(req,res){
    var userid=req.body.user;
    var sTime=req.body.start;
    var eTime=req.body.end;
    var timespan=req.body.timespan;
    person.countByPersonAttendences(userid, sTime, eTime,  timespan, function (err,obj) {
        if(obj){
            res.send({success:obj})
        }else{
            res.send({error:err})
        }
    })
}

personrouter.get('/add',personAdd);//增加
personrouter.post('/add',dopersonAdd);//提交
personrouter.post('/edit',dopersonEdit);//提交
personrouter.options('/add',dopersonAdd);//提交
personrouter.get('/personPic',personPic);//编辑查询
personrouter.get('/getPersonBymobile',getPersonBymobile);//编辑查询
personrouter.post('/addlocation',personAddLocation);//提交
personrouter.post('/registerByIdcard',personAddByIDCard);//提交
personrouter.post('/getPersonByUUId',getPersonByUUId);//提交
personrouter.post('/pcLogin',getPersonByPcLogin);//提交
personrouter.post('/getUserPicById',getUserPicById);//提交
// personrouter.post('/initializePersons',initializePersons);//提交
personrouter.post('/getPersonLatestPosition',getPersonLatestPosition);//提交
personrouter.post('/getPersonLatestPositionInTimespan',getPersonPositionInTimespan);//提交
personrouter.post('/getWorkmatesByUserId',getWorkmatesByUserId);//提交   根据用户id查询同事
personrouter.post('/getDepartmentPsersonelStatistic',getDepartmentPsersonelStatistic)
personrouter.post('/countByPersonLocations',countByPersonLocations);
personrouter.post('/getpersondepartment',getpersondepartment);
personrouter.post('/countByPersonAttendences',countByPersonAttendences)

module.exports = personrouter;