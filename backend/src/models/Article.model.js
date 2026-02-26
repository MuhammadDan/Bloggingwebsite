// src/models/Article.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Article = sequelize.define('Article', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [3, 300] },
    },
    slug: {                           // recommended for blog URLs (e.g. /blog/my-first-post)
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    featuredImage: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isUrl: true },
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    // likes ko simple count se handle kar rahe hain (alag Likes table baad mein agar chahiye)
    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    // views track karne ke liye (optional lekin useful)
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    timestamps: true,                 // createdAt aur updatedAt auto ban jayenge
    tableName: 'articles',
  });

  return Article;
};