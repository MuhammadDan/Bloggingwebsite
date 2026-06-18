// src/routes/userdashboard.route.js
const userDashboardController = require('../controllers/userdashboard.controller');

module.exports = async function (fastify) {
  fastify.get('/dashboard', {
    preHandler: [fastify.authenticate],   // JWT middleware
    handler: userDashboardController.getUserDashboard
  });
};