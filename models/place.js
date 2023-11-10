const Sequelize = require('sequelize')

class Place extends Sequelize.Model {
	static initiate(sequelize) {
		Place.init(
			{
				pla_no: {
					type: Sequelize.INTEGER.UNSIGNED,
					primaryKey: true,
					autoIncrement: true,
				},
				pla_code: {
					type: Sequelize.STRING(20),
					allowNull: false,
				},
				pla_name: {
					type: Sequelize.STRING(100),
					allowNull: false,
				},
				pla_loc: {
					type: Sequelize.STRING(800),
					allowNull: false,
				},
				pla_time: {
					type: Sequelize.STRING(30),
					allowNull: true,
				},
				pla_period: {
					type: Sequelize.STRING(30),
					allowNull: true,
				},
				pla_price: {
					type: Sequelize.INTEGER,
					allowNull: true,
				},
				pla_info: {
					type: Sequelize.TEXT,
					allowNull: false,
				},
				lat: {
					type: Sequelize.DECIMAL(17, 14),
					allowNull: false,
					defaultValue: 0,
				},
				lon: {
					type: Sequelize.DECIMAL(17, 14),
					allowNull: false,
					defaultValue: 0,
				},
			},
			{
				sequelize,
				timestamps: false,
				underscored: false,
				modelName: 'Place',
				tableName: 't_place',
				paranoid: false,
				charset: 'utf8',
				collate: 'utf8_general_ci',
			},
		)
	}

	static associate(db) {}
}

module.exports = Place
