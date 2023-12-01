const jwt = require('jsonwebtoken')

// exports.isLoggedIn = (req, res, next) => {
// 	if (req.isAuthenticated()) {
// 		next()
// 	} else {
// 		res.status(403).send('로그인 필요')
// 	}
// }

// exports.isNotLoggedIn = (req, res, next) => {
// 	if (!req.isAuthenticated()) {
// 		next()
// 	} else {
// 		const message = encodeURIComponent('로그인한 상태입니다.')
// 		res.redirect(`/?error=${message}`)
// 	}
// }

// 토큰 검증 기능
exports.verifyToken = (req, res, next) => {
	try {
		res.locals.decoded = jwt.verify(
			req.headers.authorization,
			process.env.JWT_SECRET,
		)
		return next()
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.json({
				status: 'fail',
				message: '토큰이 만료되었습니다.',
			})
		}
	}
	return res.json({
		code: 401,
		message: '유효하지 않은 토큰입니다.',
	})
}
