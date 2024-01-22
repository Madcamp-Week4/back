const express = require('express');
const multer = require('multer');
const router = express.Router();
const generateRandomKey = require('../config/key');
const File = require('../models/FileModel');
const bcrypt = require('bcrypt');

// Multer 설정
const upload = multer({ dest: 'uploads/' });

// 파일 업로드 라우트
router.post('/upload', upload.single('file'), async (req, res) => {
    key = generateRandomKey();
    useremail = req.body.email;
    // 비밀번호 해시 생성
    const salt = await bcrypt.genSalt(10);
    const hashedKey = await bcrypt.hash(key, salt);
    
    // 파일 정보 저장
    const file = new File({
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        key: hashedKey,
        email: useremail
    });
    
    res.status(201).json({ message: 'File uploaded successfully', fileKey: key});
});

// 파일 다운로드 라우트
router.get('/download/:id', async (req, res) => {
    const file = await File.findById(req.params.id);
    res.download(file.path, file.filename);
});

module.exports = router;
