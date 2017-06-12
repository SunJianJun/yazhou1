var express = require('express');
var uuid = require('node-uuid');
var uploadPhoto = express.Router();
var commentImgDir='./public/images';
var IDcardImgDir='./IDCard';
// $rootScope.applicationServer = 'http://localhost:2000/';//加上客户端applicationserver 就可以直接访问
var videoDir='./public/videos';
var voiceDir='./public/voices';

// Generate a v1 (time-based) id
//uuid.v1(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a'

// Generate a v4 (random) id
//uuid.v4(); // -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1'
var multer = require('multer')
//fileDir= './upload'
var storage =function(fileDir,imgfileName){ return multer.diskStorage({ destination: function ( req, file, callback ) { 
	// 注意，此处的uploads目录是从项目的根目录开始寻找 
	// 如果没有的话，需要手动新建此文件夹 './upload'
	callback(null,fileDir ); }, 
	filename: function ( req, file, callback ) {

        // multer不会自动添加文件后缀名，需要手动添加
        //下面的文件名是这样file-1476361627446.jpg
        //callback(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1]);
        //下面的文件名是根据时间生成的uuid文件名，类似6c84fb90-12c4-11e1-840d-7b25c5ee775a.jpg
        callback(null, imgfileName + '.' + file.mimetype.split('/')[1]);
    }
})
};

var uploadImgs = function(ImgDir,imgfileName){ return multer({
    storage: storage(ImgDir,imgfileName),
    limits: 1000000,//上传结束时触发
		onFileUploadComplete:function(file){			
			 //console.log("upload commentImg complete\n"+file.path);
		}
}).single('file')};//这个‘file’跟客户端的filekey要一致才行

var uploadIDcards = function(ImgDir,imgfileName){ return multer({
    storage: storage(ImgDir,imgfileName),
    limits: 1000000,//上传结束时触发
		onFileUploadComplete:function(file){			
			 //console.log("upload IDcardImg complete\n"+file.path);
		}
}).single('file')};//这个‘file’跟客户端的filekey要一致才行

var uploadVideo = function(videoDir,videofileName){ return multer({
    storage: storage(videoDir,videofileName),
    limits: 1000000,//上传结束时触发
		onFileUploadComplete:function(file){			
			 // console.log("upload videofileName complete\n"+file.path);
		}
}).single('file')};//这个‘file’跟客户端的filekey要一致才行


var uploadVoices = function(voiceDir,voicefileName){ return multer({
    storage: storage(voiceDir,voicefileName),
    limits: 1000000,//上传结束时触发
    onFileUploadComplete:function(file){
        console.log("upload voicefileName complete\n"+file.path);
    }
}).single('file')};//这个‘file’跟客户端的filekey要一致才行

// 将文件上传封装为一个模块，以供其他地方使用 
uploadPhoto.uploadCommonFile= function( req, res ){ 
	var imgfileName=uuid.v1();
	uploadImgs(commentImgDir,imgfileName)(req, res, function ( error ) 
	{ if ( error ) { // //console.error(JSON.stringify(error));
		return res.end('Error uploading file.'); } 
		 //console.log('Success!'+commentImgDir+'/'+imgfileName+".jpg");
		res.send({
			fileType:'commentImg',
            filename:'images/'+imgfileName+".jpg"
			});
		//res.end('File is uploaded'); 
		}); 
};

// 将身份证上传封装为一个模块，以供其他地方使用 
uploadPhoto.uploadIDcardsFile= function( req, res ){ 
	var imgfileName=uuid.v1();
	uploadIDcards(IDcardImgDir,imgfileName)(req, res, function ( error ) 
	{ if ( error ) { // //console.error(JSON.stringify(error));
		return res.end('Error uploading file.'); } 
		
		 //console.log('身份证上传Success!'+IDcardImgDir+'/'+imgfileName+".jpg");
		res.send({
			fileType:'IDCard',
			filename:IDcardImgDir+'/'+imgfileName+".jpg"
			}); 

		//res.end('File is uploaded'); 
		
		}); 
};

// 将视频上传封装为一个模块，以供其他地方使用 
uploadPhoto.uploadVideoFile= function( req, res ){ 
	var videofileName=uuid.v1();
	uploadVideo(videoDir,videofileName)(req, res, function ( error ) 
	{ if ( error ) { // //console.error(JSON.stringify(error));
		return res.end('Error uploading video file.'); } 
		
		 //console.log('视频上传Success!'+videoDir+'/'+videofileName+".mp4");
		res.send({
			fileType:'video',
			filename:'videos/'+videofileName+".mp4"
			}); 

		//res.end('File is uploaded'); 
		
		}); 
};

// 将声音上传封装为一个模块，以供其他地方使用
uploadPhoto.uploadVoicesFile= function( req, res ){
	console.log("将声音上传封装为一个模块，以供其他地方使用");
    var voicefileName=uuid.v1();
    uploadVoices(voiceDir,voicefileName)(req, res, function ( error )
    { if ( error ) { //
        return res.end('Error uploading voice file.'); }

        //console.log('视频上传Success!'+voice+'/'+voice+".mp4");
        res.send({
            fileType:'voice',
            filename:'voices/'+voicefileName+".m4a"
        });

        //res.end('File is uploaded');

    });
};

/* 上传普通图片*/
uploadPhoto.post('/photo', function ( req, res ) {
      // //console.log('手机段file post数据服务器端收到: ' + req+"<>"+res);
	 		uploadPhoto.uploadCommonFile(req, res); 
	 });
	 
/* 上传身份证图片*/
uploadPhoto.post('/IDCard', function ( req, res ) {
      // //console.log('手机段身份证 post数据服务器端收到: ' + req+"<>"+res);
	 		uploadPhoto.uploadIDcardsFile(req, res); 
	 });

/* 上传音频文件*/
uploadPhoto.post('/voice', function ( req, res ) {
    // //console.log('音频文件 post数据服务器端收到: ' + req+"<>"+res);
    uploadPhoto.uploadVoicesFile(req, res);
});
	 
/* 上传小视频*/
uploadPhoto.post('/video', function ( req, res ) {
      // //console.log('手机段file post数据服务器端收到: ' + req+"<>"+res);
	 		uploadPhoto.uploadVideoFile(req, res); 
	 });
module.exports = uploadPhoto; 