// src/routes/auth.routes.js
const AuthController = require('../controllers/auth.controller');
const authSchemas = require('../schemas/auth.schema');

async function authRoutes(fastify) {
  // Register – OTP email pe jayega (adminToken optional)
  fastify.post('/register', {
    schema: authSchemas.register
  }, AuthController.register);

  // Verify OTP
  fastify.post('/verify-otp', {
    schema: authSchemas.verifyOtp
  }, AuthController.verifyOtp);

  fastify.post('/login',{
    schema: authSchemas.login
  }, AuthController.login);
}

module.exports = authRoutes;