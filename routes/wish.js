const express = require('express')
const createConnection = require('../config/database2')
const { verifyToken } = require('../middlewares')
const router = express.Router()

// POST /wish               위시리스트 등록 기능
router.post('/', verifyToken, async (req, res) => {
	console.log('위시리스트 등록...', req.body)
	const { pla_no } = req.body
	const conn = await createConnection()
	try {
		const sql =
			'INSERT INTO t_wishlist (mb_id, pla_no, created_at) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE mb_id = mb_id'
		const value = [res.locals.decoded.mb_id, pla_no]

		const [result] = await conn.execute(sql, value)

		return res.json({
			status: 'success',
			data: {},
		})
	} catch (err) {
		console.log(err)
	} finally {
		if (conn) {
			conn.end()
		}
	}
})

// GET  /wish/me            위시리스트 조회 기능
router.get('/me', verifyToken, async (req, res) => {
	console.log('위시리스트 조회...')
	const conn = await createConnection()
	try {
		const sql = `SELECT d.img_original_name, c.sd_nm, a.* FROM t_place a JOIN t_wishlist b ON a.pla_no = b.pla_no join t_region c on a.region_no = c.sgg_cd join t_place_image d on a.pla_no = d.pla_no WHERE b.mb_id = '2943843265' and d.img_thumb = 'y' ORDER BY b.created_at DESC`
		const value = [res.locals.decoded.mb_id]

		const [result] = await conn.execute(sql, value)

		return res.json({
			status: 'success',
			data: result,
		})
	} catch (err) {
		console.log(err)
	} finally {
		if (conn) {
			conn.end()
		}
	}
})

// DELETE   /wish/:pla_no  위시리스트 삭제 기능
router.delete('/:pla_no', verifyToken, async (req, res) => {
	console.log('위시리스트 삭제...', req.params)
	const { pla_no } = req.params
	const conn = await createConnection()
	try {
		const sql = 'DELETE FROM t_wishlist WHERE mb_id = ? AND pla_no = ?'
		const value = [res.locals.decoded.mb_id, pla_no]

		const [result] = await conn.execute(sql, value)
	} catch (err) {
		console.log(err)
	} finally {
		if (conn) {
			conn.end()
		}
	}
})

module.exports = router
