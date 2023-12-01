const passport = require('passport') // 로그인 로직 모듈
const conn = require('../config/database') // db - mysql
const axios = require('axios')

/* 로컬 로그인 기능 */
exports.login = (req, res, next) => {
	passport.authenticate(
		'local',
		{ session: false },
		(authError, user, info) => {
			if (authError) {
				console.error(authError)
				return next(authError)
			}
			if (!user) {
				return res.json({
					status: 'fail',
					message: info.message,
				})
			}
			res.locals.mb_id = user.mb_id
			res.locals.mb_name = user.mb_name
			return next()
		},
	)(req, res, next) // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
}
/* 로컬 로그인 기능 끝 */

/* 로컬 회원가입 기능 */
exports.join = (req, res) => {
	const { mb_id, mb_pw } = req.body
	const sql =
		'INSERT INTO t_member (mb_id, mb_pw, mb_name, mb_phone, mb_email, mb_type) VALUES (?, ?, ?, ?, ?, ?)'
	conn.query(sql, [mb_id, mb_pw, 'name', mb_id, mb_id, 'L'], (err, rows) => {
		if (err) {
			console.error(err)
			return res.json({
				status: 'error',
				message: '서버 에러',
			})
		}
		return res.json({
			status: 'success',
			data: {},
		})
	})
}
/* 로컬 회원가입 기능 끝 */

/* 카카오 소셜 로그인 url 전달 */
exports.kakao_url = (req, res) => {
	res.json({
		status: 'success',
		data: {
			url: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}`,
		},
	})
}
/* 카카오 소셜 로그인 url 전달 끝 */

/* 구글 소셜 로그인 url 전달 */
exports.google_url = (req, res) => {
	res.json({
		status: 'success',
		data: {
			url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=profile email`,
		},
	})
}
/* 구글 소셜 로그인 url 전달 끝 */

/* 카카오 소셜 로그인 기능 */
exports.kakao = (req, res, next) => {
	const data = {
		grant_type: process.env.KAKAO_GRANT_TYPE,
		client_id: process.env.KAKAO_CLIENT_ID,
		redirect_uri: process.env.KAKAO_REDIRECT_URI,
		code: req.query.code,
	}

	const config = {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	}

	axios
		.post(
			'https://kauth.kakao.com/oauth/token',
			new URLSearchParams(data),
			config,
		)
		.then((tokenRes) => {
			axios
				.get('https://kapi.kakao.com/v2/user/me', {
					headers: { Authorization: `Bearer ${tokenRes.data.access_token}` },
				})
				.then((dataRes) => {
					console.log(dataRes.data)
					const kId = dataRes.data.id
					const kName = dataRes.data.properties.nickname
					const kEmail = dataRes.data.kakao_account.email
					const kPicture = dataRes.data.properties.profile_image

					// 이미 가입된 회원인지 조회하는 sql
					let sql1 = `SELECT mb_id FROM t_member WHERE mb_id = ?`
					// 회원가입 sql
					let sql2 = `INSERT INTO t_member(mb_id, mb_pw, mb_name, mb_phone, mb_email, mb_type, joined_at, mb_profile)
VALUES(?, 'pw', ?, 'phone', ?, 'k', default, ?)`

					conn.query(sql1, [kId], (err1, rows1) => {
						if (rows1?.length == 0) {
							conn.query(
								sql2,
								[kId, kName, kEmail, kPicture],
								(err2, rows2) => {
									if (!err) {
										console.log('회원가입 성공!')
									}
								},
							)
						}
						res.locals.mb_id = String(kId)
						res.locals.mb_name = kName
						return next()
					})
				})
				.catch((error) => {
					return res.json({ status: 'error' })
				})
		})
		.catch((err) => console.error(err))
}
/* 카카오 소셜 로그인 기능 끝 */


/* 구글 소셜 로그인 기능 */
exports.google = (req, res, next) => {
	const data = {
		grant_type: process.env.GOOGLE_GRANT_TYPE,
		client_id: process.env.GOOGLE_CLIENT_ID,
		client_secret: process.env.GOOGLE_CLIENT_SECRET,
		redirect_uri: process.env.GOOGLE_REDIRECT_URI,
		code: req.query.code,
	}

	axios
		.post('https://oauth2.googleapis.com/token', new URLSearchParams(data))
		.then((tokenRes) => {
			axios
				.get('https://www.googleapis.com/oauth2/v3/userinfo', {
					headers: { Authorization: `Bearer ${tokenRes.data.access_token}` },
				})
				.then((dataRes) => {
					// console.log(dataRes.data)
					let gId = dataRes.data.sub
					let gName = dataRes.data.name
					let gEmail = dataRes.data.email
					let gPicture = dataRes.data.picture

					// 이미 가입된 회원인지 조회하는 sql
					let sql1 = `SELECT mb_id FROM t_member WHERE mb_id = ?`
					// 회원가입 sql
					let sql2 = `INSERT INTO t_member(mb_id, mb_pw, mb_name, mb_phone, mb_email, mb_type, joined_at, mb_profile)
             VALUES(?, ' ', ?, 'phone', ?, 'g', default, ?)`

					conn.query(sql1, [gId], (err1, rows1) => {
						if (rows1?.length == 0) {
							conn.query(
								sql2,
								[gId, gName, gEmail, gPicture],
								(err2, rows2) => {
									if (!err2) {
										console.log('회원가입 성공')
									}
								},
							)
						}
						res.locals.mb_id = String(gId)
						res.locals.mb_name = gName
						return next()
					})
				})
				.catch((dataErr) => {
					return res.json({ status: 'error' })
				})
		})
		.catch((tokenErr) => console.error(tokenErr))
}
/* 구글 소셜 로그인 기능 끝 */
