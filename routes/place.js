const express = require('express')
const createConnection = require('../config/database2')
const { verifyToken } = require('../middlewares')
const router = express.Router()

// GET  /place/:pla_no  여행지 상세보기 기능
router.get('/:pla_no', async (req, res) => {
	const { pla_no } = req.params
	const conn = await createConnection()

	try {
		const sql = 'SELECT * FROM t_place WHERE pla_no = ?'
		const value = [pla_no]

		const [result] = await conn.execute(sql, value)

		return res.json({
			status: 'success',
			data: result,
		})
	} catch (err) {
		return res.json({
			status: 'error',
			message: 'server error',
		})
	} finally {
		if (conn) {
			conn.end()
		}
	}
})

module.exports = router
