// const express = require('express');
// const router = express.Router();
// const path = require('path');

// router.get('/file/:filename', (req, res) => {
//     try {
//         const filename = req.params.filename;
//         console.log("요청된 파일 이름:", filename); // 파일 이름 로그
  
//         const directoryPath = path.join(__dirname, '../uploads');
//         const filePath = path.join(directoryPath, filename);
//         console.log("계산된 파일 경로:", filePath); // 파일 경로 로그
  
//         res.download(filePath, filename, (err) => {
//             if (err) {
//                 console.error("다운로드 중 오류 발생:", err); // 다운로드 오류 로그
//                 res.status(500).send({
//                     message: "파일을 다운로드하는 데 실패했습니다.",
//                     error: err
//                 });
//             }
//         });
//     } catch (err) {
//         console.error("라우트 처리 중 오류 발생:", err); // catch 블록 오류 로그
//         res.status(500).send("서버 오류");
//     }
// });

// module.exports = router;