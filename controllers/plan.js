const createConnection = require('../config/database2')

/* 플랜 생성 기능 */
exports.createPlan = async (req, res) => {
	const {
		plan_name,
		plan_info,
		plan_region,
		started_date,
		ended_date,
		region_no,
	} = req.body.myPlan
	const conn = await createConnection()
	try {
		const sql =
			'INSERT INTO t_plan (plan_name, mb_id, plan_region, region_no, plan_info, plan_at, started_date, ended_date) VALUES (?, ?, ?, ?, ?, now(), ?, ?)'
		const value = [
			plan_name,
			res.locals.decoded.mb_id,
			plan_region,
			region_no,
			plan_info,
			started_date,
			ended_date,
		]
		const [result] = await conn.execute(sql, value)
		return res.json({
			status: 'success',
			data: {
				plan_no: result.insertId,
			},
		})
	} catch (error) {
		console.log(error)
		return res.json({
			status: 'error',
			message: 'server error',
		})
	} finally {
		if (conn) {
			conn.end()
		}
	}
}
/* 플랜 생성 기능 끝 */

/* 플랜 리스트 조회 기능 */
exports.getPlanList = async (req, res) => {
	const { order } = req.query

	const conn = await createConnection()
	try {
		const sql = `SELECT * FROM t_plan WHERE mb_id = ? AND now() ${
			Number(order) === 1 ? '>' : '<'
		} ended_date ORDER BY started_date ${
			Number(order) === 1 ? 'DESC' : 'ASC'
		} LIMIT 3`
		const value = [res.locals.decoded.mb_id]

		const [result] = await conn.execute(sql, value)

		return res.json({
			status: 'success',
			data: result,
		})
	} catch (error) {
		console.log(error)
		return res.json({
			status: 'error',
			message: 'server error',
		})
	} finally {
		if (conn) {
			conn.end()
		}
	}
}
/* 플랜 리스트 조회 기능 끝 */

/* 플랜 조회 기능 */
exports.getPlan = async (req, res) => {
	const { plan_no } = req.params
	const conn = await createConnection()
	try {
		const sql =
			'SELECT B.lat, B.lng, A.* FROM t_plan A JOIN t_region B on (A.region_no = B.sd_cd) WHERE plan_no = ?'
		const value = [plan_no]

		const [result] = await conn.execute(sql, value)

		if (result.length == 0) {
			return res.json({
				status: 'fail',
				message: 'client error',
			})
		}
		if (result.mb_id === res.locals.decoded.mb_id) {
			return res.json({
				status: 'fail',
				message: 'client error : id',
			})
		}
		return res.json({
			status: 'success',
			data: result[0],
		})
	} catch (error) {
		console.log(error)
		return res.json({
			status: 'error',
			message: 'server error',
		})
	} finally {
		if (conn) {
			conn.end()
		}
	}
}
/* 플랜 조회 기능 끝 */

/* 플랜 갱신 기능 */
exports.updatePlan = async (req, res) => {
	console.log('플랜 갱신...')

	const { plan_no } = req.params
	console.log(req.body)
	const { plan_name, plan_info, started_date, ended_date, plan_region } =
		req.body.myPlan
	const conn = await createConnection()

	try {
		const sql =
			'UPDATE t_plan SET plan_name = ?, plan_info = ?, plan_at = now(), started_date = ?, ended_date = ?, plan_region = ? WHERE plan_no = ? AND mb_id = ?'
		const value = [
			plan_name,
			plan_info,
			started_date,
			ended_date,
			plan_region,
			plan_no,
			res.locals.decoded.mb_id,
		]

		const [result] = await conn.execute(sql, value)

		if (result.affectedRows == 0) {
			return res.json({
				status: 'fail',
				message: 'client error',
			})
		}
		return res.json({
			status: 'success',
			data: {},
		})
	} catch (error) {
		console.log(error)
		return res.json({
			status: 'error',
			message: 'server error',
		})
	} finally {
		if (conn) {
			conn.end()
		}
	}
}
/* 플랜 갱신 기능 끝 */

/* 플랜 삭제 기능 */
exports.deletePlan = async (req, res) => {
	const { plan_no } = req.params
	const conn = await createConnection()

	try {
		const sql = 'DELETE FROM t_plan WHERE plan_no = ? AND mb_id = ?'
		const value = [plan_no, res.locals.decoded.mb_id]

		const [result] = await conn.execute(sql, value)

		if (result.affectedRows == 0) {
			return res.json({
				status: 'fail',
				message: 'client error',
			})
		}
		return res.json({
			status: 'success',
			data: {},
		})
	} catch (error) {
		console.log(error)
		return res.json({
			status: 'error',
			message: 'server error',
		})
	} finally {
		if (conn) {
			conn.end()
		}
	}
}
/* 플랜 삭제 기능 끝 */

/* 플랜 상세 저장 및 갱신 */
exports.setPlanDetail = async (req, res) => {
	const data = req.body.myListObj
	const { plan_no } = req.params

	console.log(data)

	const days = Object.keys(data)
	const routes = Object.values(data)

	const conn = await createConnection()

	try {
		const sql = `INSERT INTO t_plandetail (plan_no, plan_day, plan_route) VALUES (?, ?, ?)
			ON DUPLICATE KEY UPDATE plan_route = ?`
		days.map(async (item, idx) => {
			const routeSize = routes[idx].length
			const value = [plan_no, item, routes[idx], routes[idx]]
			const [result] = await conn.execute(sql, value)
			if (days.length - 1 > idx) {
				const sql2 = `INSERT INTO t_reservation (mb_id, reservation_yn, plan_no, plan_day, pla_no) VALUES (?, 'n', ?, ?, ?) ON DUPLICATE KEY UPDATE pla_no = ?`
				const value2 = [
					res.locals.decoded.mb_id,
					plan_no,
					item,
					routes[idx][routeSize - 1],
					routes[idx][routeSize - 1],
				]
				await conn.execute(sql2, value2)
			}
		})
		const sql3 = `DELETE FROM t_plandetail WHERE plan_no = ? AND plan_day > ?`
		const value3 = [plan_no, days.length]
		await conn.execute(sql3, value3)

		const sql4 = `DELETE FROM t_reservation WHERE plan_no = ? AND plan_day > ?`
		const value4 = [plan_no, days.length]
		await conn.execute(sql4, value4)

		return res.json({
			status: 'success',
			data: {},
		})
	} catch (error) {
		console.log(error)
		return res.json({
			status: 'error',
			message: 'server error',
		})
	} finally {
		if (conn) {
			conn.end()
		}
	}
}
exports.getPlanDetail = async (req, res) => {
	const { plan_no } = req.params

	const conn = await createConnection()

	bgArr = ['#34EAAD', '#EBDA34', '#1F3871']

	try {
		const sql = `SELECT * FROM t_plandetail WHERE plan_no = ?`
		const value = [plan_no]
		const [result] = await conn.execute(sql, value)
		const data = await result.map(async (resultItem, resultIdx) => {
			let plan_route = resultItem.plan_route
			let plan_route_arr = plan_route
				.substring(1, plan_route.length - 1)
				.split(',')

			const sql2 = `SELECT CONVERT(?, CHAR) as myDay, @rownum := @rownum + 1 AS markerIndex, A.*, B.img_original_name img, C.sd_nm region_main FROM (SELECT @rownum :=0) AS r, t_place A JOIN t_place_image B ON (A.pla_no = B.pla_no) JOIN t_region C ON (A.region_no = C.sgg_cd) WHERE B.img_thumb = 'y' AND A.pla_no IN  (${plan_route_arr.map(
				(arrItem) => '?',
			)}) order by field(A.pla_no, ${plan_route_arr.map((arrItem) => '?')})`
			const plan_route_parseInt = plan_route_arr.map((item) => parseInt(item))
			const value2 = [resultItem.plan_day]
			.concat(plan_route_parseInt)
			.concat(plan_route_parseInt)
			const [result2] = await conn.execute(sql2, value2)
			
			return result2.map((item) => {
				const bgIdx = Number(item.myDay) > 3 ? 2 : Number(item.myDay) - 1
				const { lat, lng, ...item2 } = item
				return {
					...item2,
					latlng: { lat, lng },
					bgColor: { backgroundColor: bgArr[bgIdx] },
				}
			})
		})

		const data_pre = await Promise.all(data)

		const data_pre_flat = data_pre.flat()

		return await res.json({
			status: 'success',
			data: data_pre_flat,
		})
	} catch (error) {
		console.log(error)
		return res.json({
			status: 'error',
			message: 'server error',
		})
	} finally {
		if (conn) {
			conn.end()
		}
	}
}
