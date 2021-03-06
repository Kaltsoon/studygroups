var Database = require('../database/connection');

var Page = Database.sequelize.define('Page', {
  id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: Database.DataTypes.STRING, allowNull: false },
  content: { type: Database.DataTypes.TEXT, allowNull: false }
});

var User = Database.sequelize.define('User', {
  id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: Database.DataTypes.STRING, validate: { isEmail: { msg: 'Email should have the right format.' } } },
  username: {
    type: Database.DataTypes.STRING,
    validate: {
      len: { args: [3,15], msg: 'Username length should be between 3 and 15 characters.' },
      isUnique: function(username, next){
        User.findOne({ where: { username: username } })
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
  password: { type: Database.DataTypes.STRING, validate: { len: { args: [5,100], msg: 'Password length should be at least 5 characters.' } } },
  description: Database.DataTypes.TEXT
});

var Reader = Database.sequelize.define('Reader', {
  identifier: { type: Database.DataTypes.STRING, unique: true }
});

var StudyGroup = Database.sequelize.define('StudyGroup', {
  id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: Database.DataTypes.STRING, allowNull: false },
  description: { type: Database.DataTypes.TEXT, allowNull: false },
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
  text: { type: Database.DataTypes.TEXT, allowNull: false },
  type: { type: Database.DataTypes.STRING, validate: { isIn: [['success', 'warning', 'danger']] } }
});

var ChatMessage = Database.sequelize.define('ChatMessage', {
  id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  text: { type: Database.DataTypes.TEXT, allowNull: false }
});

var Comment = Database.sequelize.define('Comment', {
  id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  content: { type: Database.DataTypes.TEXT, allowNull: false }
});

Reader.belongsTo(User, { onDelete: 'CASCADE' });
Reader.belongsTo(StudyGroup, { onDelete: 'CASCADE' });
Page.belongsTo(StudyGroup, { onDelete: 'CASCADE' });
StudyGroup.belongsTo(User, { onDelete: 'CASCADE' });
Highlight.belongsTo(User, { onDelete: 'CASCADE' });
Highlight.belongsTo(Page, { onDelete: 'CASCADE' });
ChatMessage.belongsTo(User, { onDelete: 'CASCADE' });
ChatMessage.belongsTo(StudyGroup, { onDelete: 'CASCADE' });
Comment.belongsTo(User, { onDelete: 'CASCADE' });
Comment.belongsTo(Page, { onDelete: 'CASCADE' });
Comment.belongsTo(Comment, { onDelete: 'CASCADE' });

StudyGroup.hasMany(Page, { onDelete: 'CASCADE' });
StudyGroup.hasMany(Reader, { onDelete: 'CASCADE' });
StudyGroup.hasMany(ChatMessage, { onDelete: 'CASCADE' });
User.hasMany(StudyGroup, { onDelete: 'CASCADE' });
User.hasMany(ChatMessage, { onDelete: 'CASCADE' });
User.hasMany(Highlight, { onDelete: 'CASCADE' });
Page.hasMany(Highlight, { onDelete: 'CASCADE' });

module.exports = {
  StudyGroup: StudyGroup,
  Page: Page,
  User: User,
  Reader: Reader,
  Highlight: Highlight,
  ChatMessage: ChatMessage,
  Comment: Comment,
  _SYNC: function(){
    Database.sequelize.sync({ force: true });
  }
};
