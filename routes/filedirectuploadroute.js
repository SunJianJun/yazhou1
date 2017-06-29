/**
 * @module �ļ��ϴ�ģ��
 */

var express = require('express');
var uuid = require('node-uuid');

var uploadPhoto = express.Router();
var commentImgDir='./public/images';
var IDcardImgDir='./IDCard';
// $rootScope.applicationServer = 'http://localhost:2000/';//���Ͽͻ���applicationserver �Ϳ���ֱ�ӷ���
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
    // ע�⣬�˴���uploadsĿ¼�Ǵ���Ŀ�ĸ�Ŀ¼��ʼѰ��
    // ���û�еĻ�����Ҫ�ֶ��½����ļ��� './upload'
    callback(null,fileDir ); },
    filename: function ( req, file, callback ) {

        // multer�����Զ�����ļ���׺������Ҫ�ֶ����
        //������ļ���������file-1476361627446.jpg
        //callback(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1]);
        //������ļ����Ǹ���ʱ�����ɵ�uuid�ļ���������6c84fb90-12c4-11e1-840d-7b25c5ee775a.jpg
        callback(null, imgfileName + '.' + file.mimetype.split('/')[1]);
    }
})
};
/**
 * �ϴ��ļ��Ļ�������
 * û�б�¶���ɷ���url
 * @param ImgDir �ļ�·��
 * @param imgfileName �ļ���
 * @returns {*}
 */
var uploadImgs = function(ImgDir,imgfileName){ return multer({
    storage: storage(ImgDir,imgfileName),
    limits: 52428800,//�ϴ�����ʱ����
    onFileUploadComplete:function(file){
        //console.log("upload commentImg complete\n"+file.path);
    }
}).single('file')};//�����file�����ͻ��˵�filekeyҪһ�²���

var uploadIDcards = function(ImgDir,imgfileName){ return multer({
    storage: storage(ImgDir,imgfileName),
    limits: 52428800,//�ϴ�����ʱ����
    onFileUploadComplete:function(file){
        //console.log("upload IDcardImg complete\n"+file.path);
    }
}).single('file')};//�����file�����ͻ��˵�filekeyҪһ�²���

var uploadVideo = function(videoDir,videofileName){ return multer({
    storage: storage(videoDir,videofileName),
    limits: 52428800,//�ϴ�����ʱ����
    onFileUploadComplete:function(file){
        // console.log("upload videofileName complete\n"+file.path);
    }
}).single('file')};//�����file�����ͻ��˵�filekeyҪһ�²���


var uploadVoices = function(voiceDir,voicefileName){ return multer({
    storage: storage(voiceDir,voicefileName),
    limits: 52428800,//�ϴ�����ʱ����
    onFileUploadComplete:function(file){
        console.log("upload voicefileName complete\n"+file.path);
    }
}).single('file')};//�����file�����ͻ��˵�filekeyҪһ�²���


/**
 * ����ͨͼƬ�ϴ���װΪһ���������Թ������ط�ʹ��
 * url:/filedirectupload/photo
 * @param {file} req -��ͨͼƬ�ļ�
 * @param {json} res - �ɹ��󷵻�{
			fileType:'commentImg',
			filename:'images/'+һ��uuid��ͼƬ�ļ���+".jpg"
			} ʧ�ܷ��� null
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
 * �����֤�ϴ���װΪһ���������Թ������ط�ʹ��
 * url:/filedirectupload/IDCard
 * @param {file} req -���֤ͼ���ļ�
 * @param {json} res - �ɹ��󷵻�{
			fileType:'IDCard',
			filename:'IDCard/'+һ��uuid�����֤ͼƬ�ļ���+".jpg"
			} ʧ�ܷ��� null
 */
var uploadIDcardsFile= function( req, res ){
    var imgfileName=uuid.v1();
    uploadIDcards(IDcardImgDir,imgfileName)(req, res, function ( error )
    { if ( error ) { // //console.error(JSON.stringify(error));
        return res.end('Error uploading file.'); }

        //console.log('���֤�ϴ�Success!'+IDcardImgDir+'/'+imgfileName+".jpg");
        res.send({
            fileType:'IDCard',
            filename:IDcardImgDir+'/'+imgfileName+".jpg"
        });

        //res.end('File is uploaded');

    });
};


/**
 * // ����Ƶ�ϴ���װΪһ���������Թ������ط�ʹ��
 * url:/filedirectupload/video
 * @param {file} req -��Ƶ�ļ�
 * @param {json} res - �ɹ��󷵻�{
			fileType:'video',
			filename:'video/'+һ��uuid����Ƶ�ļ���+".mp4"
			} ʧ�ܷ��� null
 */
var uploadVideoFile= function( req, res ){
    var videofileName=uuid.v1();
    uploadVideo(videoDir,videofileName)(req, res, function ( error )
    { if ( error ) { // //console.error(JSON.stringify(error));
        return res.end('Error uploading video file.'); }

        //console.log('��Ƶ�ϴ�Success!'+videoDir+'/'+videofileName+".mp4");
        res.send({
            fileType:'video',
            filename:'videos/'+videofileName+".mp4"
        });

        //res.end('File is uploaded');

    });
};


/**
 * �������ϴ���װΪһ���������Թ������ط�ʹ��
 * url:/filedirectupload/voice
 * @param {file} req -�����ļ�
 * @param {json} res - �ɹ��󷵻�{
			fileType:'voice',
			filename:'voice/'+һ��uuid�������ļ���+".m4a"
			} ʧ�ܷ��� null
 */
var uploadVoicesFile= function( req, res ){
    console.log("�������ϴ���װΪһ��ģ�飬�Թ������ط�ʹ��");
    var voicefileName=uuid.v1();
    uploadVoices(voiceDir,voicefileName)(req, res, function ( error )
    { if ( error ) { //
        return res.end('Error uploading voice file.'); }

        //console.log('��Ƶ�ϴ�Success!'+voice+'/'+voice+".mp4");
        res.send({
            fileType:'voice',
            filename:'voices/'+voicefileName+".m4a"
        });
    });
};

/**
 * �Զ���������ʶ�����ļ���
 * @param {json} req - ���������
 file64��ͼƬ����������Ƶ64λ��ı���
 type:�ϴ��ļ����ͣ�0:ͼƬ��1:������2:С��Ƶ���� url:/filedirectupload/uploadFile64

 * @param {json} res - ��ȷ���� {
                        fileType:'commentImg',
                        filename:'images/'+imgfileName+".jpg"
                    }��{
                        fileType:'voice',
                        filename:'voices/'+voicefileName+".m4a"
                    }��{
                        fileType:'video',
                        filename:'videos/'+videofileName+".mp4"
                    }�����󷵻�{
            err:'�ϴ���������',
            filename:'null'
        } �����ļ��������᷵�� ��������
 */
var uploadFile64= function( req, res ){
    // console.error(JSON.stringify(req));
    console.log("���յ��ļ����ͣ�"+req.body.type+"<>");
    if((req.body.type>-1) && req.body.file64){
        console.log("��ʼ�洢�ļ����ͣ�"+req.body.type+"<>");
        switch (req.body.type){
            case '0'://ͼƬ
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
            case 1://����
                // console.log("�������ϴ���װΪһ��ģ�飬�Թ������ط�ʹ��");
                var voicefileName=uuid.v1();
                var base64Data = req.body.file64.replace(/^data:audio\/\w+;base64,/, "");
                var dataBuffer = new Buffer(base64Data, 'base64');
                fs.writeFile(voiceDir+'/'+voicefileName+".m4a", dataBuffer, function(error) {
                    if(error){
                        console.error(JSON.stringify(error));
                        return res.end({
                            err:JSON.stringify(error),
                            filename:'null'
                        } );
                        // return res.end('Error uploading voice file.');
                    }else{
                        console.log('Success!'+voiceDir+'/'+voicefileName+".m4a");

                        //console.log('��Ƶ�ϴ�Success!'+voice+'/'+voice+".mp4");
                        res.send({
                            fileType:'voice',
                            filename:'voices/'+voicefileName+".m4a"
                        });
                    }
                });
                break;
            case 2://��Ƶ
                var videofileName=uuid.v1();
                var base64Data = req.body.file64.replace(/^data:video\/\w+;base64,/, "");
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
                        console.log('��Ƶ�ϴ�Success!'+videoDir+'/'+videofileName+".mp4");
                        res.send({
                            fileType:'video',
                            filename:'videos/'+videofileName+".mp4"
                        });
                    }
                });
                uploadVideo(videoDir,videofileName)(base64Data, res, function ( error )
                { if ( error ) { // //
                    console.error(JSON.stringify(error));
                    return res.end('Error uploading video file.'); }

                    console.log('��Ƶ�ϴ�Success!'+videoDir+'/'+videofileName+".mp4");
                    res.send({
                        fileType:'video',
                        filename:'videos/'+videofileName+".mp4"
                    });

                    //res.end('File is uploaded');

                });
                break;
            default:break;
        }

    }else {
        console.log("�ļ����͵Ȳ�������");
        res.send({
            err:'�ϴ���������',
            filename:'null'
        });
    }

};


/* �ϴ���ͨͼƬ*/
uploadPhoto.post('/photo', function ( req, res ) {
    // //console.log('�ֻ���file post���ݷ��������յ�: ' + req+"<>"+res);
    uploadCommonFile(req, res);
});

/* �ϴ����֤ͼƬ*/
uploadPhoto.post('/IDCard', function ( req, res ) {
    // //console.log('�ֻ������֤ post���ݷ��������յ�: ' + req+"<>"+res);
    uploadIDcardsFile(req, res);
});

/* �ϴ���Ƶ�ļ�*/
uploadPhoto.post('/voice', function ( req, res ) {
    // //console.log('��Ƶ�ļ� post���ݷ��������յ�: ' + req+"<>"+res);
    uploadVoicesFile(req, res);
});

/* �ϴ�С��Ƶ*/
uploadPhoto.post('/video', function ( req, res ) {
    // //console.log('�ֻ���file post���ݷ��������յ�: ' + req+"<>"+res);
    uploadVideoFile(req, res);
});

/* �ϴ�С��Ƶ*/
uploadPhoto.post('/uploadFile64', function ( req, res ) {
    // //console.log('�ֻ���file post���ݷ��������յ�: ' + req+"<>"+res);
    uploadFile64(req, res);
});
module.exports = uploadPhoto; 