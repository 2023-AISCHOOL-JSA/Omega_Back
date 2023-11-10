const express = require('express')
const { login, join } = require('../controllers/auth')
const { createToken } = require('../controllers/v1')
const router = express.Router()

// POST /auth/login : 로그인 기능
router.post('/login', login, createToken)

// POST /auth/join  : 회원가입 기능
router.post('/join', join)

module.exports = router
