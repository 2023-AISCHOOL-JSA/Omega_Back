// mysql 콜백
// 불러오기 : const conn = require('../config/database')
// 사용하기 : conn.query()
const mysql = require('mysql2')

const config = {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
}

const conn = mysql.createConnection(config)

module.exports = conn