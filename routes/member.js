const express = require('express')
const createConnection = require('../config/database2')
const { verifyToken } = require('../middlewares')

const router = express.Router()

router.get('/me', verifyToken, async (req, res) => {
	const conn = await createConnection()
	try {
		const sql =
			'SELECT mb_email, mb_name, mb_profile FROM t_member where mb_id = ?'
		const values = [res.locals.decoded.mb_id]
		const [result] = await conn.execute(sql, values)
		return res.json({
			status: 'success',
			data: result[0],
		})
	} catch (error) {
	} finally {
		if (conn) {
			conn.end()
		}
	}
})

module.exports = router
