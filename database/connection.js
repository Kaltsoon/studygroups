var Sequelize = require('sequelize');
var sequelize;

var env = process.env.NODE_ENV || 'development';

if(env == 'development'){
  sequelize = new Sequelize('studygroups', '', '', {
    dialect: 'sqlite',
    storage: 'database/database.sqlite'
  });
}else{
  sequelize = new Sequelize('d36vs2qi05q4fm', 'opeeuzdvkyzxen', 'B2xe9srr7msiOx_MyCW569kHRQ', {
    host: 'ec2-54-197-245-93.compute-1.amazonaws.com',
    dialect: 'postgres'
  });
}

module.exports = {
  DataTypes: Sequelize,
  sequelize: sequelize
};
