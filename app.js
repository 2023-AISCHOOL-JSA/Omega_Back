/* 모듈 불러오기 */
const express = require('express') // 서버 모듈
const path = require('path') // 디렉토리 모듈
const cookieParser = require('cookie-parser') // 쿠키 관련 모듈
const passport = require('passport') // 로그인 로직 모듈
const morgan = require('morgan') // 로그 모듈
const session = require('express-session') // 세션 관련 모듈
const nunjucks = require('nunjucks') // html view engine 모듈
const dotenv = require('dotenv') // 서버 환경변수 파일 모듈
const cors = require('cors') // cors 모듈
const bodyParser = require('body-parser') // post값 받는 모듈

/* 서버 환경 설정 시작 */
dotenv.config() // .env 파일 변수 불러오기

const v1 = require('./routes/v1') // 토큰 관련 라우터
const authRouter = require('./routes/auth') // 회원 가입 및 로그인 라우터
const indexRouter = require('./routes') // 메인 라우터
const { sequelize } = require('./models')
const passportConfig = require('./passport') // 로그인 로직 모듈 설정 파일

const app = express()

passportConfig()

app.set('port', process.env.PORT || 8002) // 포트번호 8002번
app.set('view engine', 'html') // view engine 설정
nunjucks.configure('views', {
	express: app,
	watch: true,
})
sequelize
	.sync({ force: false })
	.then(() => {
		console.log('데이터베이스 연결 성공')
	})
	.catch((err) => {
		console.error(err)
	})
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(
	session({
		resave: false,
		saveUninitialized: false,
		secret: process.env.COOKIE_SECRET,
		cookie: {
			httpOnly: true,
			secure: false,
		},
	}),
)
app.use(passport.initialize())
app.use(passport.session())
/* 서버 환경설정 끝 */

/* 라우터 URL 매핑 */
app.use('/v1', v1)
app.use('/auth', authRouter)
app.use('/', indexRouter)

/* 에러 처리 라우터 */
app.use((req, res, next) => {
	const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
	error.status = 404
	next(error)
})
app.use((err, req, res, next) => {
	res.locals.message = err.message
	res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}
	res.status(err.status || 500)
	res.render('error')
})

/* 포트 오픈 */
app.listen(app.get('port'), () => {
	console.log(`http://localhost:${app.get('port')}`)
})
