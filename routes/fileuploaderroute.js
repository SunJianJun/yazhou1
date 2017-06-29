/**
 * @module 文件上传模块
 */

var express = require('express');
var uuid = require('node-uuid');

var uploadPhoto = express.Router();
var commentImgDir='./public/images';
var IDcardImgDir='./IDCard';
// $rootScope.applicationServer = 'http://localhost:2000/';//加上客户端applicationserver 就可以直接访问
var videoDir='./public/videos';
var voiceDir='./public/voices';
var fs = require('fs');

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
/**
 * 上传文件的基本函数
 * 没有暴露出可访问url
 * @param ImgDir 文件路径
 * @param imgfileName 文件名
 * @returns {*}
 */
var uploadImgs = function(ImgDir,imgfileName){ return multer({
    storage: storage(ImgDir,imgfileName),
    limits: 52428800,//上传结束时触发
    onFileUploadComplete:function(file){
        //console.log("upload commentImg complete\n"+file.path);
    }
}).single('file')};//这个‘file’跟客户端的filekey要一致才行

var uploadIDcards = function(ImgDir,imgfileName){ return multer({
    storage: storage(ImgDir,imgfileName),
    limits: 52428800,//上传结束时触发
    onFileUploadComplete:function(file){
        //console.log("upload IDcardImg complete\n"+file.path);
    }
}).single('file')};//这个‘file’跟客户端的filekey要一致才行

var uploadVideo = function(videoDir,videofileName){ return multer({
    storage: storage(videoDir,videofileName),
    limits: 52428800,//上传结束时触发
    onFileUploadComplete:function(file){
        // console.log("upload videofileName complete\n"+file.path);
    }
}).single('file')};//这个‘file’跟客户端的filekey要一致才行


var uploadVoices = function(voiceDir,voicefileName){ return multer({
    storage: storage(voiceDir,voicefileName),
    limits: 52428800,//上传结束时触发
    onFileUploadComplete:function(file){
        console.log("upload voicefileName complete\n"+file.path);
    }
}).single('file')};//这个‘file’跟客户端的filekey要一致才行


/**
 * 将普通图片上传封装为一个函数，以供其他地方使用
 * url:/filedirectupload/photo
 * @param {file} req -普通图片文件
 * @param {json} res - 成功后返回{
			fileType:'commentImg',
			filename:'images/'+一个uuid的图片文件名+".jpg"
			} 失败返回 null
 */
var uploadCommonFile= function( req, res ){
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


/**
 * 将身份证上传封装为一个函数，以供其他地方使用
 * url:/filedirectupload/IDCard
 * @param {file} req -身份证图像文件
 * @param {json} res - 成功后返回{
			fileType:'IDCard',
			filename:'IDCard/'+一个uuid的身份证图片文件名+".jpg"
			} 失败返回 null
 */
var uploadIDcardsFile= function( req, res ){
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


/**
 * // 将视频上传封装为一个函数，以供其他地方使用
 * url:/filedirectupload/video
 * @param {file} req -视频文件
 * @param {json} res - 成功后返回{
			fileType:'video',
			filename:'video/'+一个uuid的视频文件名+".mp4"
			} 失败返回 null
 */
var uploadVideoFile= function( req, res ){
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


/**
 * 将声音上传封装为一个函数，以供其他地方使用
 * url:/filedirectupload/voice
 * @param {file} req -声音文件
 * @param {json} res - 成功后返回{
			fileType:'voice',
			filename:'voice/'+一个uuid的声音文件名+".m4a"
			} 失败返回 null
 */
var uploadVoicesFile= function( req, res ){
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
    });
};

/**
 * 自动根据类型识别存放文件夹
 * @param {json} req - 请求参数：
 file64：图片，语音，视频64位后的编码
 type:上传文件类型（0:图片；1:语音；2:小视频）， url:/filedirectupload/uploadFile64

 * @param {json} res - 正确返回 {
                        fileType:'commentImg',
                        filename:'images/'+imgfileName+".jpg"
                    }，{
                        fileType:'voice',
                        filename:'voices/'+voicefileName+".wav"
                    }，{
                        fileType:'video',
                        filename:'videos/'+videofileName+".mp4"
                    }，错误返回{
            err:'上传参数不对',
            filename:'null'
        } 或者文件保存错误会返回 错误详情
 */
var uploadFile64= function( req, res ){
    // console.error(JSON.stringify(req));
    console.log("接收到文件类型："+req.body.type+"<>");
    if((req.body.type>-1) && req.body.file64){
        console.log("开始存储文件类型："+req.body.type+"<>");
        switch (req.body.type+""){
            case '0'://图片
                var imgfileName=uuid.v1();
                var base64Data = req.body.file64.replace(/^data:image\/\w+;base64,/, "");
                var dataBuffer = new Buffer(base64Data, 'base64');
                fs.writeFile(commentImgDir+'/'+imgfileName+".jpg", dataBuffer, function(error) {
                    if(error){
                        console.error(JSON.stringify(error));
                        return res.end({
                            err:JSON.stringify(error),
                            filename:'null'
                        } );
                    }else{
                        console.log('Success!'+commentImgDir+'/'+imgfileName+".jpg");
                        res.send({
                            fileType:'commentImg',
                            filename:'images/'+imgfileName+".jpg"
                        });
                    }
                });

                break;
            case '1'://语音
                // console.log("将声音上传封装为一个模块，以供其他地方使用");
                var voicefileName=uuid.v1();
                var base64Data = req.body.file64.replace(/^data:audio\/\S+;base64,/, "");
                // console.log("过滤后的声音b64："+base64Data);
                var dataBuffer = new Buffer(base64Data, 'base64');
                fs.writeFile(voiceDir+'/'+voicefileName+".wav", dataBuffer, function(error) {
                    if(error){
                        console.error(JSON.stringify(error));
                        return res.end({
                            err:JSON.stringify(error),
                            filename:'null'
                        } );
                        // return res.end('Error uploading voice file.');
                    }else{
                        console.log('Success!'+voiceDir+'/'+voicefileName+".wav");

                        //console.log('视频上传Success!'+voice+'/'+voice+".mp4");
                        res.send({
                            fileType:'voice',
                            filename:'voices/'+voicefileName+".wav"
                        });
                    }
                });
                break;
            case '2'://视频
                var videofileName=uuid.v1();
                var base64Data = req.body.file64.replace(/^data:video\/\S+;base64,/, "");
                var dataBuffer = new Buffer(base64Data, 'base64');
                fs.writeFile(videoDir+'/'+videofileName+".mp4", dataBuffer, function(error) {
                    if(error){
                        console.error(JSON.stringify(error));
                        return res.end({
                            err:JSON.stringify(error),
                            filename:'null'
                        } );
                        // return res.end('Error uploading video file.');
                    }else{
                        console.log('视频上传Success!'+videoDir+'/'+videofileName+".mp4");
                        res.send({
                            fileType:'video',
                            filename:'videos/'+videofileName+".mp4"
                        });
                    }
                });
                break;
            default:

                console.error("不知道的处理文件类型:"+req.body.type+"");
                return res.end({
                    err:"不知道的处理文件类型"+req.body.type+"",
                    filename:'null'
                });

                break;
        }

    }else {
        console.log("文件类型等参数错误！");
        res.send({
            err:'上传参数不对',
            filename:'null'
        });
    }

};


/* 上传普通图片*/
uploadPhoto.post('/photo', function ( req, res ) {
    // //console.log('手机段file post数据服务器端收到: ' + req+"<>"+res);
    uploadCommonFile(req, res);
});

/* 上传身份证图片*/
uploadPhoto.post('/IDCard', function ( req, res ) {
    // //console.log('手机段身份证 post数据服务器端收到: ' + req+"<>"+res);
    uploadIDcardsFile(req, res);
});

/* 上传音频文件*/
uploadPhoto.post('/voice', function ( req, res ) {
    // //console.log('音频文件 post数据服务器端收到: ' + req+"<>"+res);
    uploadVoicesFile(req, res);
});

/* 上传小视频*/
uploadPhoto.post('/video', function ( req, res ) {
    // //console.log('手机段file post数据服务器端收到: ' + req+"<>"+res);
    uploadVideoFile(req, res);
});

/* 上传小视频*/
uploadPhoto.post('/uploadFile64', function ( req, res ) {
    // //console.log('手机段file post数据服务器端收到: ' + req+"<>"+res);
    uploadFile64(req, res);
});
module.exports = uploadPhoto; 