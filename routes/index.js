const express = require('express')
const { renderMain } = require('../controllers')
const router = express.Router()
const createConnection = require('../config/database2')
const path = require('path')

// GET	/	: backend 서버접속 확인용 페이지
router.get('/', renderMain)

// GET	/test	: DB 연결 테스트 확인용 라우터
router.get('/test', async (req, res) => {
	// const conn = await createConnection()
	// const [result] = await conn.query('show tables')
	// console.log(result)
})

router.get('/test-img', (req,res) => {
	console.log();
	res.sendFile(path.join(__dirname, 'img.jpg'))
})

module.exports = router
