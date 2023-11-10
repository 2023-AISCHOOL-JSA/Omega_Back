const Sequelize = require('sequelize')

const Member = require('./member')
const Place = require('./place')
// const Plan = require('./plan')
// const PlanDetail = require('./planDetail')
// const Recommend = require('./recommend')
// const Review = require('./review')
// const Upload = require('./upload')
// const Image = require('./image')
// const Wishlist = require('./wishlist')

const db = {}
const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIALECT,
		port: process.env.DB_PORT,
	},
)
db.sequelize = sequelize

db.Member = Member
db.Place = Place
// db.Plan = Plan
// db.PlanDetail = PlanDetail
// db.Recommend = Recommend
// db.Review = Review
// db.Upload = Upload
// db.Image = Image
// db.Wishlist = Wishlist

Member.initiate(sequelize)
Place.initiate(sequelize)
// Plan.initiate(sequelize)
// PlanDetail.initiate(sequelize)
// Recommend.initiate(sequelize)
// Review.initiate(sequelize)
// Upload.initiate(sequelize)
// Image.initiate(sequelize)
// Wishlist.initiate(sequelize)

Member.associate(db)
Place.associate(db)
// Plan.associate(db)
// PlanDetail.associate(db)
// Recommend.associate(db)
// Review.associate(db)
// Upload.associate(db)
// Image.associate(db)
// Wishlist.associate(db)

module.exports = db
