const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const File = require('../models/FileModel'); // 파일 모델 경로에 맞게 조정

// nodemailer transporter 설정
const transporter = nodemailer.createTransport({
    service: 'gmail', // 사용할 이메일 서비스
    auth: {
        user: 'seoyunchocolate@gmail.com', // 이메일 주소
        pass: 'rongttjhcvqullvs' // 이메일 비밀번호
    }
});

router.post('/send', async (req, res) => {
    const { email } = req.body;

    try {
        // 해당 이메일로 등록된 파일들 검색
        const files = await File.find({ email: email });

        if (!files.length) {
            return res.status(404).send('No files found for this email.');
        }

        // 이메일 보내기
        const mailOptions = {
            from: 'seoyunchocolate@gmail.com',
            to: email,
            subject: 'Your Files',
            html: `<h1>Your Files</h1>
                   <p>Here are the files you requested:</p>
                   <ul>
                   ${files.map(file => `<li>Filename: ${file.filename}, Key: ${file.key}</li>`).join('')}
                   </ul>
                   <p>Thank you for using our service!</p>`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send('Email sent successfully');
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving files');
    }
});

module.exports = router;
