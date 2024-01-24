const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send("아이디가 잘못되었습니다.");
        }

        // 비밀번호 비교
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).send("비밀번호가 잘못되었습니다.");
        }

        const userInfo = {
            username: user.username,
            email: user.email
        };
        res.status(200).json({ message: "로그인 성공!", user: userInfo });
    } catch (err) {
        console.error(err);
        res.status(500).send("서버 오류");
    }
});

router.post('/signup', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // 동일한 이메일로 가입된 사용자가 있는지 확인
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send('이미 사용중인 이메일입니다.');
        }

        // 비밀번호 해시 생성
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 새로운 사용자 생성
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // 사용자 저장
        await newUser.save();
        res.status(201).send('회원가입 성공');
    } catch (err) {
        console.error(err);
        res.status(500).send('서버 오류');
    }
});

router.put('/edit', async (req, res) => {
    const { email, newUsername } = req.body;

    try {
        // email을 사용하여 사용자 데이터베이스에서 사용자를 찾고, username을 업데이트
        const updatedUser = await User.findOneAndUpdate({ email: email }, { username: newUsername }, { new: true });

        if (updatedUser) {
            res.status(200).json({ message: "사용자 이름이 성공적으로 업데이트되었습니다." });
        } else {
            res.status(404).json({ message: "해당 이메일을 가진 사용자를 찾을 수 없습니다." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "사용자 이름 업데이트 중 오류가 발생했습니다." });
    }
});

module.exports = router;
