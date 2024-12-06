const express = require('express');
const router = express.Router();
const { registerUser } = require('../models/userController');

// 회원가입 라우트
router.post('/register', registerUser);

module.exports = router;

router.post('/register', (req, res) => {
    // 회원가입 로직
});

module.exports = router;