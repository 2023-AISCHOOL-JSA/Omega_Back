const Sequelize = require('sequelize')

class Member extends Sequelize.Model {
	static initiate(sequelize) {
		Member.init(
			{
				mb_id: {
					type: Sequelize.STRING(30),
					primaryKey: true,
				},
				mb_pw: {
					type: Sequelize.STRING(128),
					allowNull: true,
				},
				mb_name: {
					type: Sequelize.STRING(40),
					allowNull: false,
				},
				mb_phone: {
					type: Sequelize.STRING(20),
					allowNull: false,
				},
				mb_email: {
					type: Sequelize.STRING(50),
					allowNull: false,
					unique: true,
				},
				mb_type: {
					type: Sequelize.STRING(1),
					allowNull: false,
				},
				joined_at: {
					type: Sequelize.DATE,
					allowNull: false,
					defaultValue: Sequelize.NOW,
				},
			},
			{
				sequelize,
				timestamps: false,
				underscored: false,
				modelName: 'Member',
				tableName: 't_member',
				paranoid: false,
				charset: 'utf8',
				collate: 'utf8_general_ci',
			},
		)
	}

	static associate(db) {}
}

module.exports = Member
