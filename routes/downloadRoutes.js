const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/file/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const directoryPath = path.join(__dirname, '../uploads');
    const filePath = path.join(directoryPath, filename);

    res.download(filePath, filename, (err) => {
      if (err) {
        res.status(500).send({
          message: "파일을 다운로드하는 데 실패했습니다.",
          error: err
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류");
  }
});

module.exports = router;
