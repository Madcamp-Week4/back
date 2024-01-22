// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const router = express.Router();

// // 파일 저장을 위한 multer 설정
// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'uploads/') // 파일이 저장될 경로
//   },
//   filename: function(req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//   }
// });

// const upload = multer({ storage: storage });

// router.post('/file', upload.single('file'), (req, res) => {
//   try {
//     // 파일 업로드 성공 응답
//     res.status(200).send("파일 업로드 성공");
//   } catch (error) {
//     res.status(500).send("서버 오류");
//   }
// });

// module.exports = router;