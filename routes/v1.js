const express = require('express')
const { verifyToken } = require('../middlewares')
const { tokenTest } = require('../controllers/v1')
const router = express.Router()

// GET  /test   :   토큰 검증
router.get('/test', verifyToken, tokenTest)

module.exports = router
