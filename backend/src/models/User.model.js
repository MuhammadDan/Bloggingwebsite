// src/models/User.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
      isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    aiCredits: {
  type: DataTypes.INTEGER,
  defaultValue: 10,     // Free credits new users ko
  allowNull: false
},

aiGeneratedPosts: {
  type: DataTypes.INTEGER,
  defaultValue: 0
},
  }, {
    timestamps: true,
    tableName: 'users',
  });

  return User; // ← yeh return bohot zaroori hai – agar yeh missing hai to sequelize.define crash karega
};