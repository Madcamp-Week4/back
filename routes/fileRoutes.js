const express = require('express');
const multer = require('multer');
const router = express.Router();
const File = require('../models/FileModel');

// Multer 설정
const upload = multer({ dest: 'uploads/' });

// 파일 업로드 라우트
router.post('/upload', upload.single('file'), async (req, res) => {
    // 파일 정보 저장
    const file = new File({
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
    });

    const savedFile = await file.save();
    
    res.status(201).send({ message: 'File uploaded successfully', fileId: savedFile._id });
});

// 파일 다운로드 라우트
router.get('/download/:id', async (req, res) => {
    const file = await File.findById(req.params.id);
    res.download(file.path, file.filename);
});

module.exports = router;
