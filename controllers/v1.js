const jwt = require('jsonwebtoken')

exports.createToken = async (req, res) => {
	try {
		const token = jwt.sign(
			{
				id: res.locals.mb_id,
				nick: res.locals.mb_name,
			},
			process.env.JWT_SECRET,
			{ expiresIn: '1h', issuer: 'campusstay' },
		)
		return res.json({
			code: 200,
			message: '토큰이 발급되었습니다.',
			token,
		})
	} catch (error) {
		console.error(error)
		return res.status(500).send({
			code: 500,
			message: '서버 에러',
		})
	}
}

exports.tokenTest = (req, res) => {
	res.json(res.locals.decoded)
}
