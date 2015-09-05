var Database = require('../database/connection');

var Page = Database.sequelize.define('Page', {
  id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: Database.DataTypes.STRING, validate: { notEmpty: { msg: 'Title can\'t be empty.' } } },
  content: { type: Database.DataTypes.TEXT, validate: { notEmpty: { msg: 'Content can\'t be empty.' } } }
});

var User = Database.sequelize.define('User', {
  id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: Database.DataTypes.STRING, validate: { isEmail: { msg: 'Email should have the right format.' } } },
  username: {
    type: Database.DataTypes.STRING,
    validate: {
      len: { args: [3,15], msg: 'Username length should be between 3 and 15 characters.' },
      isUnique: function(username, next){
        User.findOne({ username: username })
          .then(function(userWithSameUsername){
            if(userWithSameUsername){
              next('Username has already been taken.');
            }else{
              next();
            }
          })
      }
    },
    unique: true
  },
  password: { type: Database.DataTypes.STRING, validate: { len: { args: [5,100], msg: 'Password length should be at least 5 characters.' } } }
});

var Reader = Database.sequelize.define('Reader', {
  identifier: { type: Database.DataTypes.STRING, unique: true }
});

var StudyGroup = Database.sequelize.define('StudyGroup', {
  id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: Database.DataTypes.STRING, validate: { notEmpty: { msg: 'Name can\'t be empty.' } } },
  description: { type: Database.DataTypes.TEXT, validate: { notEmpty: { msg: 'Description can\'t be empty.' } } },
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

var Highlight = Database.sequelize.define('Highlight', {
  id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  text: { type: Database.DataTypes.TEXT, validate: { notEmpty: true } },
  type: { type: Database.DataTypes.STRING, validate: { isIn: [['success', 'warning', 'danger']] } }
});

Reader.belongsTo(User);
Reader.belongsTo(StudyGroup);
Page.belongsTo(StudyGroup);
StudyGroup.belongsTo(User);
Highlight.belongsTo(User);
Highlight.belongsTo(Page);

StudyGroup.hasMany(Page);
StudyGroup.hasMany(Reader);
User.hasMany(StudyGroup);
User.hasMany(Highlight);
Page.hasMany(Highlight);

module.exports = {
  StudyGroup: StudyGroup,
  Page: Page,
  User: User,
  Reader: Reader,
  Highlight: Highlight,
  _SYNC: function(){
    Database.sequelize.sync();
  }
};
