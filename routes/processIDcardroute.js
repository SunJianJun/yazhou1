﻿/*
//上面是单纯的百度ocr
//重要的是前面的api key，是在百度申请到的
var ocr = require('baidu-ocr').create('b1c4974787b7640e6480e4a840297df9','1311f98c10f240428f857e692ab8a891'),
  image =  './id_imgs/id3.jpg' ;

// detectType: `LocateRecognize`代表整图文字检测、识别,以行为单位（默认）
// languageType: `CHN_ENG`(中英)（默认）
// imageType: `2`代表图片原文件（只支持JPG，大小不能超过300K）
// image: 图片流对象 或 base64 编码的字符串
ocr.scan( 'LocateRecognize', 'CHN_ENG', 2, image, function( err, data ) {
  if ( err ) {
    return // //console.error( err );
  }

  // //console.log( 'words:' );
  // //console.log( data.word );
});
*/


/**
 * @module 身份证识别模块   url：/processID
 */

var express = require('express');
var request = require('request'),
  fs = require('fs');
var processIDPhoto = express.Router();   
 var select = require('xpath.js')
      , dom = require('xmldom').DOMParser

var idcardOCR = require('baidu-ocr-idcard').create('b1c4974787b7640e6480e4a840297df9');
var idcard =  './IDCard/id12.jpg' ;
var side='obverse';//正面为'obverse'，反面为'reverse',自动为‘auto’
/* 上传身份证图片*/
//processIDPhoto.post('/IDCard', function ( req, res ) {
processIDPhoto.post('/baidu_IDCard', function ( req, res ) {//deprated no use
try {
	if(req.body){
		// code to try
   // //console.log("待解析的身份证啊："+req.body);
   //var rqe=JSON.parse(req.body); //'解析ok！'
   for (var o in req.body) {
   	 // //console.log("待解析的req.body："+o);
   }
   // //console.log('解析文件名：'+req.body.fileURL );
	 //注意服务器端和客户端一定要名称统一，之前这里是fileName,客户端传过来是fileURL
	 idcard=req.body.fileURL;
	 if(idcard){
   // //console.log( 'idcard进入ok！');
	     idcardOCR.scan(idcard, side, function(err, data) {
        if(err){
            //res.json(err);
              // //console.log( err.errMsg );
							res.send(null);
            //return;
        }else{
        	//加入身份证的url
  			data.retData.idUrl=idcard;
  			 //console.log( data.retData );
				res.send(data.retData);
  		}
    });
    }
		}else {
		res.send(null);
	}
} catch (e) {
	// handle errors here

  			 //console.log(e );
		res.send(null);
}

});

var processIDinfo=function(cardsinfo){
	var personJson={};
for (var index = 0;  index < cardsinfo.items.length; index++) {
	 // code to be executed
	 var temp=cardsinfo.items[index];
	 switch(temp.desc)
	 {
	 	case "姓名":
	 		personJson.name=temp.content	;
	 	case "性别":
	 		personJson.sex=temp.content	;
	 	case "民族":
	 		personJson.nation=temp.content	;
	 	case "出生":
	 		personJson.birthday=temp.content	;
	 	case "住址":
	 		personJson.residence=temp.content	;
	 	case "公民身份号码":
	 		personJson.idNum=temp.content	;
	 	case "头像":
	 		personJson.images={
			coverSmall:'',
			coverBig:'',};
	 		personJson.images.coverSmall=temp.content	;
	 	default:
	 	break;
	 	}
}
	return personJson;
	}
	
	var processIdXml=function(body){
		try {
	var personJson={};
		    		var doc = new dom().parseFromString(body);     
    				// //console.log(dataxml.substring(0,20)+"\nread xml:"+doc);
    				var check = select(doc, "//status/text()");
    				if (check!='-1') {    					
						var name = select(doc, "//item[@desc=\"姓名\"]/text()")+'';
						name=name.substring(9,name.length-3)
						personJson.name=name;
						var sex = select(doc, "//item[@desc=\"性别\"]/text()")+'';
    				sex=sex.substring(9,sex.length-3)
	 					personJson.sex=sex;
	 					var nation = select(doc, "//item[@desc=\"民族\"]/text()")+'';
    				nation=nation.substring(9,nation.length-3)
	 					personJson.nation=nation;
	 					var birthday = select(doc, "//item[@desc=\"出生\"]/text()")+'';
    				birthday=birthday.substring(9,birthday.length-3)
	 					personJson.birthday=birthday;
	 					var residence = select(doc, "//item[@desc=\"住址\"]/text()")+'';
    				residence=residence.substring(9,residence.length-3)
	 					personJson.residence=residence;
	 					var idNum = select(doc, "//item[@desc=\"公民身份号码\"]/text()")+'';
    				idNum=idNum.substring(9,idNum.length-3)
	 					personJson.idNum=idNum;
	 					var coverSmall = select(doc, "//item[@desc=\"头像\"]/text()")+'';
    				coverSmall=coverSmall.substring(9,coverSmall.length-3)
    				personJson.images={};
	 					personJson.images.coverSmall=coverSmall;
	
			}
			return personJson;
			} catch (e) {
	// handle errors here

  			 //console.log(" 身份证xml解析出错："+e );
		return;
}
	}
	

				    	function strToJson(str){
var json = (new Function("return " + str))();
return json;
}

//new xiangyun IDCard ocr
/**
 * 身份证图片识别方法，一般是紧跟着身份证图片上传方法的返回值进行调用
 * @param {json} req - {fileURL：“上传身份证照片后服务器返回的地址”}
 * @param {json} res - 如果识别正确返回{
 	 	name;
	 	sex;
	 	nation;
	 	birthday;
	 	residence;
	 	idNum;
	 	images={
			coverSmall:'base64',
			coverBig:'',}}这些属性，如果失败，返回null
  */
var IDCard=function ( req, res ) {//deprated no use
    try {
        if(req.body){
            // code to try
            // //console.log("待解析的身份证啊："+req.body);
            //var rqe=JSON.parse(req.body); //'解析ok！'
            for (var o in req.body) {
                // //console.log("待解析的req.body："+o);
            }
            // //console.log('解析文件名：'+req.body.fileURL );
            //注意服务器端和客户端一定要名称统一，之前这里是fileName,客户端传过来是fileURL
            idcard=req.body.fileURL;
            if(idcard){
                // //console.log( 'idcard进入ok！');


                var that = this;
                var formData = {
                    key : '5YvFQKftFc9eoTTF23jC7e',
                    secret : '30e8964158ac4bd0968be8ff041bceba',
                    typeId : '2',
                    format : "xml",
                    imagetype : 'image/jpeg',
                    file : fs.createReadStream( idcard )//,'image/jpeg'}
                };

                var options = {
                    url: 'http://netocr.com/api/recog.do',
                    method: 'POST',
                    formData: formData
					/*headers: {
					 'apikey': this.apikey
					 }*/
                };

                request( options,  function ( err, respon, body ) {
                    if ( err ) {
                        //console.log('\nIDcard ocr err:'+err);
                        return;
                        //return cb( null, err );
                    }

                    // 处理请求结果
                    //var response = that._responseParse( detectType, body );

                    //console.log('\nIDcard ocr ok:'+respon+'<>'+body);
                    //测试xml的读取
                    //var xml = body;
                    //var dataxml=fs.readFileSync("C:/mySanyaHeritage360Server/routes/testid.xml", "utf-8");


					/*
					 var out=JSON.stringify(body);

					 for (var obj in body.cardsinfo) {
					 // code to be executed
					 //console.log('\nbody_obj:'+obj+'<>'+obj.length);
					 for (var index = 0;  index < obj.length-1; index++) {
					 // code to be executed
					 //console.log('\obj1:'+obj[index]+'<>'+obj[index].length);
					 }
					 }*/
                    var idjson=processIdXml(body);
                    if (idjson && idjson.name) {
                        res.send(idjson);
                    }else {
                        res.send(null);
                    }
                    // 出错
					/*
					 if ( response.error ) {
					 //console.log('\nIDcard ocr err:'+err);

					 cb( response.data, null );
					 } else {
					 //console.log('\nIDcard ocr err:'+err);
					 cb( null, response.data );
					 }*/
                });
            };
        }
        else {
            res.send(null);
        }
    } catch (e) {
        // handle errors here

        //console.log(e );
        res.send(null);
    }

};



processIDPhoto.post('/IDCard', IDCard);

module.exports = processIDPhoto;