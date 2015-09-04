var Database = require('../database/connection');

var Page = Database.sequelize.define('Page', {
  id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: Database.DataTypes.STRING,
  content: Database.DataTypes.TEXT
});

var User = Database.sequelize.define('User', {
  id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: Database.DataTypes.STRING, validate: { isEmail: { msg: 'Email should have the right format.' } } },
  username: { type: Database.DataTypes.STRING, validate: { len: { args: [3,15], msg: 'Username length should be between 3 and 15 characters.' } }, unique: true },
  password: { type: Database.DataTypes.STRING, validate: { len: { args: [5,100], msg: 'Password length should be at least 5 characters.' } } }
});

var Reader = Database.sequelize.define('Reader', {
  identifier: { type: Database.DataTypes.STRING, unique: true }
});

var StudyGroup = Database.sequelize.define('StudyGroup', {
  id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: Database.DataTypes.STRING,
  description: Database.DataTypes.TEXT,
  key: Database.DataTypes.TEXT
}, {
  scopes: {
    ownedByUser: function(userId){
      return {
        where: { UserId: userId },
        include: [{ model: Page, attributes: ['title', 'id'] }, { model: User }, { model: Reader, attributes: ['UserId'] }]
      }
    }
  }
});

Reader.belongsTo(User);
Reader.belongsTo(StudyGroup);
Page.belongsTo(StudyGroup);
StudyGroup.belongsTo(User);

StudyGroup.hasMany(Page);
StudyGroup.hasMany(Reader);
User.hasMany(StudyGroup);

module.exports = {
  StudyGroup: StudyGroup,
  Page: Page,
  User: User,
  Reader: Reader,
  _SYNC: function(){
    Database.sequelize.sync();
  }
};
