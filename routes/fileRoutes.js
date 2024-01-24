const express = require('express');
const multer = require('multer');
const router = express.Router();
const File = require('../models/FileModel');
//const FileGrid = require('../models/FileGridModel');
const path = require('path');
const generateUniqueKey = require('../config/key');
const fs = require('fs');
const { createReadStream }= require('fs');
const { createBucket, createModel } = require('mongoose-gridfs');
const fileUpload = require('express-fileupload');
const { MongoClient, GridFSBucket, ObjectID } = require('mongodb');

const { Readable } = require('stream');
const getBucket = require('../config/bucket');

// Multer 설정: 메모리 스토리지 사용
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 18 },}).single('file');


router.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/' // 임시 파일이 저장될 디렉토리
  }));

router.post('/uploadGrid', async (req, res) => {
    //console.log(req.file);
    console.log(req.files);
    console.log(req.files.file);
    //console.log(req);
    if (!req.files || !req.files.file) {
        return res.status(400).send('No file uploaded');
    }
    const file = req.files.file;
    const bucketName = 'gridFiles';

    try {
        const bucket = await getBucket(bucketName);
        const uploadStream = bucket.openUploadStream(file.name);
        fs.createReadStream(file.tempFilePath).pipe(uploadStream)
          .on('error', (error) => {
            res.status(500).send(error.message);
          })
          .on('finish', () => {
          });
        const extension = path.extname(file.name);
        const key = await generateUniqueKey();
        const file_upload = new File({
                filename: file.name,
                filedata: 'grid',
                extension: extension,
                path: file.path,
                size: file.size,
                // key: hashedKey,
                key: key,
                email: req.body.email
            });
        
        file_upload.save();
        return res.status(200).json({
                message: "Successfully Saved!",
                file: file,  });
        
  } catch(error) {
        console.log(error);
        return res.status(403).json({
            message: "Save Failed!",
            file: req.files.file,  });
    }
});


router.post('/upload', upload, async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    // 파일을 Base64 문자열로 변환
    const filedata = req.file.buffer.toString('base64');

    const key = await generateUniqueKey();
    const useremail = req.body.email;
    // 비밀번호 해시 생성
    // const salt = await bcrypt.genSalt(10);
    // const hashedKey = await bcrypt.hash(key, salt);
    // 파일 확장자 추출
    const extension = path.extname(req.file.originalname);

    // 파일 정보 저장
    const file = new File({
        filename: req.file.originalname,
        filedata: filedata,
        extension: extension,
        path: req.file.path,
        size: req.file.size,
        // key: hashedKey,
        key: key,
        email: useremail
    });

    await file.save();
    
    res.status(201).json({ message: 'File uploaded successfully', fileKey: key});
});

router.post('/find', async (req, res) => {
    try {
        const { email } = req.body; // 클라이언트에서 보낸 이메일 추출

        // 해당 이메일과 일치하는 파일 정보 검색
        const files = await File.find({ email: email }).select('filename size key -_id');
        
        // 파일 정보 응답
        res.status(200).json({ files: files });
    } catch (error) {
        console.error(error);
        res.status(500).send('파일 검색 중 오류 발생');
    }
});

// 파일 다운로드 라우트
router.get('/download/:key', async (req, res) => {
    try {
        // 파일 key를 사용하여 데이터베이스에서 파일 찾기
        const file = await File.findOne({ key: req.params.key });

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        var filedata = file.filedata;
        // Base64 인코딩된 데이터를 binary 데이터로 변환
        var fileContents = Buffer.from(filedata, 'base64');
        
        // 파일 확장자에 따른 Content-Type 설정
        let contentType = 'application/octet-stream'; // 기본값
        switch (file.extension) {
            case '.pdf':
                contentType = 'application/pdf';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.ppt':
            case '.pptx':
                contentType = 'application/vnd.ms-powerpoint';
                break;
            case '.xls':
            case '.xlsx':
                contentType = 'application/vnd.ms-excel';
                break;
            case '.doc':
            case '.docx':
                contentType = 'application/msword';
                break;
            case '.hwpx':
            case '.hwp':
                contentType = 'application/x-hwp';
                break;
            case '.mp3':
                contentType = 'audio/mpeg';
                break;
            case '.mp4':
                contentType = 'video/mp4';
                break;
        }
        
        if (file.filedata === 'grid') {
            const bucketName = "gridFiles";
            const bucket = await getBucket(bucketName);
            const downloadStream = bucket.openDownloadStreamByName(file.filename);

            downloadStream.on('file', (file) => {
                res.setHeader('Content-Type', contentType);
                res.setHeader('Content-Disposition', 'attachment; filename=' + file.filename);
            });

            downloadStream.pipe(res);
        } else {

        // 클라이언트에게 파일 전송
        res.writeHead(200, {
        'Content-Disposition': `attachment; filename=${file.filename}`,
        'Content-Type': contentType,
        });
        res.end(fileContents);
    }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error downloading the file');
    }
});

router.delete('/delete/:key', async (req, res) => {
    try {
        const Files_r = await File.deleteOne({ key: req.params.key });
        //console.log(Files_r);
        if (Files_r.deletedCount === 1) {
            console.log("Successfully deleted one document.");
          } else {
            console.log("No documents matched the query. Deleted 0 documents.");
          }

        res.status(200).send({ message: "File successfully deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error deleting the file" });
    }
});

module.exports = router;