const createConnection = require('../config/database2')

exports.getRegionList = async (req, res) => {
	const { keyword } = req.query
	const conn = await createConnection()
	try {
		let sql = `SELECT sgg_cd, region_name, sd_nm, sgg_nm FROM t_region`
		if (keyword) {
			sql += ` WHERE region_code IN (SELECT MIN(region_code) from (SELECT * FROM t_region WHERE region_name LIKE ?) A GROUP BY A.sd_cd)`
		} else {
			sql += ' WHERE region_level = 0 ORDER BY sd_cd'
		}
		const [result] = await conn.execute(sql, [`%${keyword}%`])
		const data = result.map((item) => {
			return {
				...item,
				sd_nm: item.sd_nm + ` ${item.sgg_nm}`,
				full_nm: item.region_name,
			}
		})
		const data2 = {}
		data.map((item) => {
			const { region_name, ...item2 } = item
			data2[region_name] = item2
		})
		console.log(data2)
		return res.json({
			status: 'success',
			data: data2,
		})
	} catch (err) {
		console.log(err)
	} finally {
		if (conn) {
			conn.end()
		}
	}
}

exports.getRegionGuide = async (req, res) => {
	const { region_no } = req.params

	const conn = await createConnection()
	try {
		const sql =
			'select a.region_no, a.region_name, a.region_info, a.lat, a.lng,b.region_level ,b.sgg_cd, concat(b.sd_nm, b.sgg_nm) sgg_nm from t_region_guide a join t_region b on a.region_no= b.sgg_cd where b.sgg_cd = ? order by b.region_level limit 1;'
		const value = [
			region_no % 1000 > 0 ? parseInt(region_no / 1000) * 1000 : region_no,
		]
		let [result] = await conn.execute(sql, value)
		const region_name = result[0].region_name 

		if(result[0].region_level == 0){
			if(region_name.length == 4){
				result[0].region_name = region_name[0] + region_name[2]
			}else{
				result[0].region_name = region_name.substring(0,2)
			}
		}
		return res.json({
			status: 'success',
			data: result[0],
		})
	} catch (err) {
		console.log(err)
	} finally {
		if (conn) {
			conn.end()
		}
	}
}

exports.getRegionDormitory = async (req, res) => {
	const { region_no } = req.params

	const conn = await createConnection()
	try {
		const sql =
			`select B.img_original_name, C.sd_nm region_main, A.* from t_place A JOIN t_place_image B ON (A.pla_no = B.pla_no) JOIN t_region C ON (A.region_no = C.sgg_cd) where B.img_thumb = 'y' AND A.region_no = ? AND A.pla_code_main = '숙박' order by RAND() LIMIT 4`

// select * from t_place where region_no = 29000 and pla_code_main <> '숙박' order by RAND() LIMIT 3;
// select * from t_place where region_no = 29000 and pla_code_main <> '숙박' order by RAND() LIMIT 3;
// select * from t_place where region_no = 29000 and pla_code_main <> '숙박' order by RAND() LIMIT 2;
		const value = [region_no]
		let [result] = await conn.execute(sql, value)

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
}

exports.getRegionPlace = async (req, res) => {
	const { region_no } = req.params

	const conn = await createConnection()
	try {
		const sql =
			`select B.img_original_name, C.sd_nm region_main, A.* from t_place A JOIN t_place_image B ON (A.pla_no = B.pla_no) JOIN t_region C ON (A.region_no = C.sgg_cd) where B.img_thumb = 'y' AND A.region_no = ? AND A.pla_code_main <> '숙박' order by RAND() LIMIT 10`

// select * from t_place where region_no = 29000 and pla_code_main <> '숙박' order by RAND() LIMIT 3;
// select * from t_place where region_no = 29000 and pla_code_main <> '숙박' order by RAND() LIMIT 3;
// select * from t_place where region_no = 29000 and pla_code_main <> '숙박' order by RAND() LIMIT 2;
		const value = [region_no]
		let [result] = await conn.execute(sql, value)

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
}