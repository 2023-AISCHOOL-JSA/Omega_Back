const passport = require('passport') // 로그인 로직 모듈
const conn = require('../config/database') // db - mysql

// 로컬로그인 기능
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
				return res.redirect(`/?error=${info.message}`)
			}
			res.locals.mb_id = user.mb_id
			res.locals.mb_name = user.mb_name
			return next()
		},
	)(req, res, next) // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
}

// 회원가입 기능
exports.join = (req, res) => {
	const { mb_id, mb_pw } = req.body
	const sql =
		'INSERT INTO t_member (mb_id, mb_pw, mb_name, mb_phone, mb_email, mb_type) VALUES (?, ?, ?, ?, ?, ?)'
	conn.query(
		sql,
		[mb_id, mb_pw, 'name', mb_id, mb_id, 'L'],
		(err, rows) => {
			if (err) {
				console.error(err)
				return res.status(500).send({
					code: 500,
					message: '서버 에러',
				})
			}
			return res.json({
				code : 200,
				message : '회원가입 성공'
			})
		},
	)
}
