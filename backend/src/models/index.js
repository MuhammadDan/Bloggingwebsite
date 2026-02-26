// src/models/index.js
const { Sequelize } = require('sequelize');
const sequelize = require('../config/database'); // tumhara sequelize instance

// Models define
const defineUser = require('./User');
const defineArticle = require('./Article');
const defineComment = require('./Comment');

const User = defineUser(sequelize);
const Article = defineArticle(sequelize);
const Comment = defineComment(sequelize);

// Associations
User.hasMany(Article, {
  foreignKey: 'authorId',
  as: 'articles',
  onDelete: 'CASCADE',
});

Article.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
});

Article.hasMany(Comment, {
  foreignKey: 'articleId',
  as: 'comments',
  onDelete: 'CASCADE',
});

Comment.belongsTo(Article, {
  foreignKey: 'articleId',
  as: 'article',
});

User.hasMany(Comment, {
  foreignKey: 'userId',
  as: 'comments',
  onDelete: 'SET NULL',   // ya CASCADE agar strict chahiye
});

Comment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Optional: nested comments (reply system)
Comment.hasMany(Comment, {
  foreignKey: 'parentId',
  as: 'replies',
  onDelete: 'CASCADE',
});

Comment.belongsTo(Comment, {
  foreignKey: 'parentId',
  as: 'parent',
});

module.exports = {
  sequelize,
  User,
  Article,
  Comment,
};