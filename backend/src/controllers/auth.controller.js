// src/controllers/authController.js
const AuthService = require('../services/auth.service');

const AuthController = {
  async register(request, reply) {
    const { name, email, password, imageUrl } = request.body;

    try {
      const result = await AuthService.register({ name, email, password, imageUrl });
      return reply.send(result); // 200 (OTP pending)
    } catch (error) {
      return reply.code(400).send({ error: error.message });
    }
  },

  async verifyOtp(request, reply) {
    const { email, otp, tempToken } = request.body;

    try {
      const result = await AuthService.verifyOtp({ email, otp, tempToken });
      return reply.send(result);
    } catch (error) {
      return reply.code(400).send({ error: error.message });
    }
  },
  async login(request, reply) {
    const { email, password } = request.body;
    try {
      const result = await AuthService.login({ email, password });
      return reply.send(result);
    } catch (error) {
      return reply.code(400).send({ error: error.message });
    }
  }
};

module.exports = AuthController;