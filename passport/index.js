const passport = require('passport')
const local = require('./localStrategy')
const kakao = require('./kakaoStrategy')

module.exports = () => {
	/* passport.serializeUser((user, done) => {
		console.log('시리얼');
		done(null, user.id)
	})
	
	passport.deserializeUser((id, done) => {
		console.log('디시리얼');
		User.findOne({ where: { id } })
			.then((user) => done(null, user))
			.catch((err) => done(err))
	})
 */

	local()
	// kakao()
}
