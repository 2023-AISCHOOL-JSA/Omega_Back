const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const createConnection = require('../config/database2')

module.exports = () => {
	passport.use(
		new LocalStrategy(
			{
				usernameField: 'mb_id',
				passwordField: 'mb_pw',
				passReqToCallback: false,
			},
			async (mb_id, mb_pw, done) => {
				try {
					const conn = await createConnection()
					const sql = 'SELECT * FROM t_member WHERE mb_id = ?'
					const values = [mb_id]
					const [result] = await conn.execute(sql, values)
					const exUser = result[0]
					if (exUser) {
						if (exUser.mb_pw == mb_pw) {
							done(null, exUser)
						} else {
							done(null, false, { message: '비밀번호가 일치하지 않습니다.' })
						}
					} else {
						done(null, false, { message: '가입되지 않은 회원입니다.' })
					}
				} catch (error) {
					console.error(error)
					done(error)
				}
			},
		),
	)
}
