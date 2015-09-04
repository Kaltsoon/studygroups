var Sequelize = require('sequelize');

var sequelize = new Sequelize('studygroups', '', '', {
  dialect: 'sqlite',
  storage: 'database/database.sqlite'
});

module.exports = {
  DataTypes: Sequelize,
  sequelize: sequelize
};
