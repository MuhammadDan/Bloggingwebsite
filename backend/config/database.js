// src/config/database.js (ya src/db.js)
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  }
);

// Optional: models ko yahan load kar sakte ho (lekin index.js better hai)
const models = require('../src/models');

module.exports = sequelize;
module.exports.models = models; // agar chahte ho direct access