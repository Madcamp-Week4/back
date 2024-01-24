const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const client = require('../config/googleOAuth');
require('dotenv').config();

router.post('/google-login', async (req, res) => {
    const { token }  = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.
            GOOGLE_CLIENT_ID
        });

        const { name, email, picture } = ticket.getPayload();

        // MongoDB에 사용자 확인 및 저장
        let user = await User.findOne({ email: email });

        if (!user) {
            user = await User.create({ username: name, email: email, profilePicture: picture });
        }

        // JWT 토큰 생성
        const jwtToken = jwt.sign(
            {
                username: user.username, 
                email: user.email
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: "Google 로그인 성공", token: jwtToken});
    } catch (error) {
        console.error(error);
        res.status(500).send("인증 오류");
    }
});

module.exports = router;
