const express = require('express')
const createConnection = require('../config/database2')
const { verifyToken } = require('../middlewares')
const router = express.Router()

// GET  /reservation/me         숙소 예약 리스트 조회 기능
router.get('/me', verifyToken, async (req, res) => {
	console.log('내 예약')
	const conn = await createConnection()

	try {
		const sql =
			'SELECT c.plan_no, a.plan_day, a.pla_no, a.reservation_cost, a.reservation_yn, a.room_n, b.pla_name, c.started_date from t_reservation a join t_place b on ( a.pla_no = b.pla_no ) join t_plan c on (a.plan_no = c.plan_no) where c.mb_id = ? ORDER BY plan_no DESC'
		const value = [res.locals.decoded.mb_id]

		const [result] = await conn.execute(sql, value)

		let result2 = []
		let result2_idx = 0
		let result2_first_item = result[0].pla_no

		await result.map((item, idx) => {
			if (idx > 0) {
				if (result2_first_item === item.pla_no) {
					result2[result2_idx].push(item)
					result2_first_item = item.pla_no
				} else {
					result2[++result2_idx] = [item]
					result2_first_item = item.pla_no
				}
			} else {
				result2[result2_idx] = [item]
			}
		})

		let tmpDate1 = new Date() // 11/30
		let plan_idx = 0
		let date_idx = 0

		const result3 = result2.map((item) => {
			if (plan_idx !== item[0].plan_no || plan_idx === 0) {
				plan_idx = item[0].plan_no
				tmpDate1 = new Date(item[0].started_date)
				tmpDate1.setDate(tmpDate1.getDate() - 1)
				date_idx = 0
			}

			let tmpDate2 = new Date(tmpDate1)
			tmpDate2.setDate(tmpDate1.getDate() + date_idx)
			date_idx += item.length
			return {
				days: item.length,
				start_day: tmpDate2.toLocaleDateString().replace(/ /gi, ''),
				...item[0],
			}
		})

		return res.json({
			status: 'success',
			data: result3,
		})
	} catch (err) {
		console.log(err)
	} finally {
		if (conn) {
			conn.end()
		}
	}
})

// GET /reservation/:plan_no    플랜 숙소 리스트 조회 기능
router.get('/:plan_no', async (req, res) => {
	console.log('플랜의 숙소 예약 리스트...')
	const { plan_no } = req.params

	const conn = await createConnection()

	try {
		const sql =
			'SELECT a.plan_day, a.pla_no, b.pla_name, a.reservation_cost, a.room_n from t_reservation a join t_place b on ( a.pla_no = b.pla_no) where a.plan_no = ? order by a.plan_day'
		const value = [plan_no]

		const pre_sql = 'SELECT started_date FROM t_plan WHERE plan_no = ?'
		const [pre_result] = await conn.execute(pre_sql, value)

		const { started_date } = pre_result[0]

		const [result] = await conn.execute(sql, value)

		let result2 = []
		let result2_idx = 0
		let result2_first_item = result[0].pla_no
		await result.map((item, idx) => {
			if (idx > 0) {
				if (result2_first_item === item.pla_no) {
					result2[result2_idx].push(item)
					result2_first_item = item.pla_no
				} else {
					result2[++result2_idx] = [item]
					result2_first_item = item.pla_no
				}
			} else {
				result2[result2_idx] = [item]
			}
		})

		let date_idx = 0
		let tmpDate1 = new Date(started_date)
		tmpDate1.setDate(tmpDate1.getDate() + 1)
		const result3 = result2.map((item) => {
			let tmpDate2 = new Date(tmpDate1)
			date_idx += item.length - 1
			console.log(date_idx, item.length);
			tmpDate2.setDate(tmpDate1.getDate() + date_idx)
			let tmpDate3 = new Date(tmpDate2)
			tmpDate3.setDate(tmpDate2.getDate() - item.length)
			date_idx++
			console.log(tmpDate3, tmpDate2);
			return {
				days: item.length,
				start_day: tmpDate3.toLocaleDateString().replace(/ /gi, ''),
				end_day: tmpDate2.toLocaleDateString().replace(/ /gi, ''),
				...item[0],
			}
		})

		return res.json({
			status: 'success',
			data: result3,
		})
	} catch (err) {
		console.log(err)
	} finally {
		if (conn) {
			conn.end()
		}
	}
})

// PUT  /reservation/:plan_no    숙소 예약 갱신 기능
router.put('/:plan_no', async (req, res) => {
	console.log('숙소 예약 갱신 기능...')
	const { plan_no } = req.params

	const conn = await createConnection()

	try {
		const sql =
			`UPDATE t_reservation SET reservation_yn = 'y' WHERE plan_no = ?`
		const value = [plan_no]

		const sql2 = `UPDATE t_plan SET pay_yn = 'y' WHERE plan_no = ?`

		const [result] = await conn.execute(sql, value)
		const [result2] = await conn.execute(sql2, value)

		return res.json({
			status: 'success',
			data: '',
		})
	} catch (err) {
		console.log(err)
	} finally {
		if (conn) {
			conn.end()
		}
	}
})

module.exports = router
