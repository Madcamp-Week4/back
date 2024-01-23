const express = require('express');
const multer = require('multer');
const router = express.Router();
const crypto = require('crypto');
const { GridFSBucket } = require('mongodb');
const { getGfs } = require('../config/db');

const gfs = getGfs();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

    // 여기에서 GridFSBucket 인스턴스 생성
    const bucket = new GridFSBucket(gfs.db, {
        bucketName: 'uploads'
    });

  // Stream to GridFS
  const stream = bucket.openUploadStream(req.file.originalname);
  stream.on('error', (error) => {
    return res.status(500).send('Error uploading file');
  });

  stream.on('finish', () => {
    // 파일 업로드 완료 후 추가 작업 (예: 데이터베이스에 메타데이터 저장)
    res.status(201).json({ message: 'File uploaded successfully', fileId: stream.id });
  });

  stream.end(req.file.buffer);
});

router.post('/find', async (req, res) => {
    try {
      const { email } = req.body; // 클라이언트에서 보낸 이메일 추출
  
      // 해당 이메일과 일치하는 파일 메타데이터 검색
      const files = await gfs.files.find({ "metadata.email": email }).toArray();
  
      if (!files || files.length === 0) {
        return res.status(404).send('No files found');
      }
  
      // 간단한 파일 정보 (이름, 크기, ID 등)를 응답으로 보냄
      const fileInfos = files.map(file => ({
        filename: file.filename,
        size: file.length,
        key: file._id
      }));
  
      res.status(200).json({ files: fileInfos });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error searching for files');
    }
  });
  

router.delete('/delete/:fileId', (req, res) => {
    try {
        const file_id = new mongoose.Types.ObjectId(req.params.fileId);
  
        gfs.remove({ _id: file_id, root: 'uploads' }, (err, gridStore) => {
        if (err) {
            return res.status(404).send('File not found');
        }
  
        res.status(200).send({ message: "File successfully deleted" });
      });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error deleting the file" });
    }
});
  

router.delete('/delete/:fileId', (req, res) => {
    try {
        const file_id = new mongoose.Types.ObjectId(req.params.fileId);
  
        gfs.remove({ _id: file_id, root: 'uploads' }, (err, gridStore) => {
        if (err) {
            return res.status(404).send('File not found');
        }
  
        res.status(200).send({ message: "File successfully deleted" });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error deleting the file" });
    }
  });
  