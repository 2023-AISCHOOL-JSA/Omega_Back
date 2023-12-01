const express = require('express')
const { Client } = require('@elastic/elasticsearch')
const { verifyToken } = require('../middlewares')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const axios = require('axios')
const router = express.Router()
const createConnection = require('../config/database2')

try {
	fs.readdirSync('uploads')
} catch (error) {
	fs.mkdirSync('uploads')
}

/* 엘라스틱서치 객체 생성 */
const client = new Client({
	node: process.env.SEARCH_URI,
	maxRetries: 5,
	requestTimeout: 60000,
	sniffOnStart: true,
})

/* 이미지 업로드용 객체 생성 */
const upload = multer({
	storage: multer.diskStorage({
		destination(req, file, cb) {
			cb(null, 'uploads/')
		},
		filename(req, file, cb) {
			const ext = path.extname(file.originalname)
			cb(null, 'upload_img_' + Date.now() + ext)
		},
	}),
	limits: { fileSize: 20 * 1024 * 1024 },
})

/*     네이버 검색 알고리즘    
    제목과 가장 일치 > 제목 + 지역 일치 > 카테고리 일치 > 리뷰 일치    
    연관 검색어 사전이 있음(족뱅이 -> 족발, 고기, 불족발, 부추무침)
    거리 가중치 부여 해야함
    인기순은 시간,범위상 못함

    1. 유명한 단어면 지도의 확대 레벨 기준으로 검색해줌 ex) 족발
        전국지도 => 해당 단어의 인기있는 장소
        지역지도 => 해당 지역의 장소
    2. 애매한 단어면 지도 확대 레벨에 상관없이 현재 지도 중심 좌표를 기준으로 검색해주고 지도가 이동되어 확대 ex) 데이

    3. 유명하지 않은 단어면 현재 사용자 위치를 기준으로 검색해줌 ex) 르블랑

    4. 하지만 유일무이한 단어면 해당 장소로 이동됨 ex)조발 */

// GET  /search/place   여행지 검색 기능
router.get('/place', async (req, res) => {
	const { keyword, pla_code, region_no, center_lat, center_lng} = req.query
	let query = {}
	let size = 20
	// case1. 검색어 + 지도중심좌표
	// case2. 카테고리 + 지역
	// console.log(keyword, pla_code, region_no, center_lat, center_lng)
	if (keyword) {
		// 검색어
		query = {
			function_score: {
				query: {
					match: {
						keywordLoc: keyword,
					},
				},
				functions: [
					{
						filter: {
							geo_distance: {
								distance: '10km',
								pla_location: {
									lat: center_lat,
									lon: center_lng,
								},
							},
						},
						weight: 2, // 명시적으로 가중치를 설정
					},
				],
				score_mode: 'sum',
				boost_mode: 'sum',
			},
		}
	} else if (pla_code && region_no) {
		// 카테고리 + 지역
		query = {
			bool: {
				filter: [
					{
						term: {
							pla_code_main:pla_code,
						},
					},
					{
						term: {
							region_no: region_no,
						},
					},
				],
			},
		}
		size = 10000
	} else {
		// 예외
	}
	try {
		const result = await client.search({
			index: 'test1',
			query: query,
			size : size
		})
		const data = result.hits.hits.map((item) => {
			const { pla_location, pla_thumb, ...item2 } = item._source
			return {
				...item2,
				latlng: { lat: pla_location.lat, lng: pla_location.lon },
				img : pla_thumb
			}
		})
		res.send({ status: 'success', data: data })
	} catch (error) {
		console.error(error)
	}
})

/* POST /search/img     이미지 검색 기능 */
router.post('/img', verifyToken, upload.single('img'), async (req, res) => {
	console.log('..................', req.file)
	axios
		.post('http://127.0.0.1:5000/upload', {
			file_path: `C:/Users/gjaischool/Desktop/real-project/back1/uploads/${req.file.filename}`,
		})
		.then(async (response) => {
			const analysis_data = response.data

			const pla_no_list = analysis_data.map((item) => item.pla_no)

			const conn = await createConnection()
			try {
				const sql = `SELECT * FROM t_place WHERE pla_no IN (${pla_no_list.map(
					(item) => '?',
				)}) order by field(pla_no, ${pla_no_list.map((item) => '?')})`
				const value = pla_no_list.concat(pla_no_list)
				const [result] = await conn.execute(sql, value)

				return res.json({
					status: 'success',
					data: result,
				})
			} catch {
				return res.json({
					status: 'error',
					data: 'server error',
				})
			} finally {
				if (conn) {
					conn.end()
				}
			}
		})
		.catch((error) => {
			return res.json({ status: 'error', message: 'analysis server error' })
		})
})

module.exports = router
