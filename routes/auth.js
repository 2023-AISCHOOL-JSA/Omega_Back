const express = require('express')
const {
	login,
	join,
	kakao_url,
	google_url,
	kakao,
	google,
} = require('../controllers/auth')
const { createToken } = require('../controllers/v1')
const router = express.Router()

// POST /auth/login : 로그인 기능
router.post('/login', login, createToken)

// POST /auth/join  : 회원가입 기능
router.post('/join', join)

// GET /auth/kakao-url  :  카카오 로그인 링크 반환 기능
router.get('/kakao-url', kakao_url)

// GET /auth/google-url  : 구글 로그인 링크 반환 기능
router.get('/google-url', google_url)

// GET /auth/kakao  : 카카오 로그인 기능
router.get('/kakao', kakao, createToken)

// GET /auth/google  : 구글 로그인 기능
router.get('/google', google, createToken)

module.exports = router
