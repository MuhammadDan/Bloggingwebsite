// src/models/Comment.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { len: [1, 2000] },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    articleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Articles',
        key: 'id',
      },
    },
    // Agar nested/reply comments chahiye future mein
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Comments',
        key: 'id',
      },
    },
  }, {
    timestamps: true,                 // createdAt, updatedAt auto
    tableName: 'comments',
  });

  return Comment;
};