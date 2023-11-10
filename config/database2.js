// mysql async/await
// 불러오기 : const createConnenction = require('../config/database2')
// 사용하기 : const conn = craetConnection()
// 			 const [result] = conn.execute('sql문', ['변수1', '변수2'])
const mysql = require('mysql2/promise')

const config = {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
}

const conn = async () => {
	return await mysql.createConnection(config)
}

module.exports = conn
