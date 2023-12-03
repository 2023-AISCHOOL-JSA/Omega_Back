const jwt = require('jsonwebtoken')

exports.createToken = async (req, res) => {
	try {
		const token = jwt.sign(
			{
				mb_id: res.locals.mb_id,
				mb_name: res.locals.mb_name,
			},
			process.env.JWT_SECRET,
			{ expiresIn: '1d', issuer: 'campusstay' },
		)
		return res.json({
			status: 'success',
			data: { token },
		})
	} catch (error) {
		// console.error(error)
		return res.json({
			status : 'error',
			message: '서버 에러',
		})
	}
}

exports.tokenTest = (req, res) => {
	res.json(res.locals.decoded)
}
