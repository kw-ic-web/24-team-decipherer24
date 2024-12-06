const bcrypt = require('bcrypt');
const User = require('../models/User');  // MongoDB User 모델

// 회원가입
const registerUser = async (req, res) => {
    const { id, password } = req.body;

    try {
        // 아이디 중복 확인
        const existingUser = await User.findOne({ id });
        if (existingUser) {
            return res.status(400).json({ message: "ID가 이미 사용 중입니다." });
        }

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);

        // 새 사용자 생성
        const newUser = new User({
            id,
            password: hashedPassword
        });

        await newUser.save();  // 사용자 정보 MongoDB에 저장
        res.status(201).json({ message: "회원가입 성공!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 오류", error });
    }
};

// 로그인
const loginUser = async (req, res) => {
    const { id, password } = req.body;

    try {
        // 사용자 찾기
        const user = await User.findOne({ id });
        if (!user) {
            return res.status(400).json({ message: "아이디가 존재하지 않습니다." });
        }

        // 비밀번호 확인
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
        }

        // 로그인 성공
        res.status(200).json({ message: "로그인 성공!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 오류", error });
    }
};

module.exports = { registerUser, loginUser };
