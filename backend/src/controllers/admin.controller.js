// BACKEND/src/controllers/admin.controller.js
const adminService = require('../services/admin.service');

const AdminController = {
  async getDashboardStats(req, reply) {
    try {
      const stats = await adminService.getDashboardStats();
      return reply.send(stats);
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: error.message });
    }
  },

  async getAllArticles(req, reply) {
    try {
      const data = await adminService.getAllArticles();
      return reply.send(data);
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: error.message });
    }
  },

  async deleteArticle(req, reply) {
    try {
      const { id } = req.params;
      await adminService.deleteArticle(id);
      return reply.send({ message: 'Article deleted successfully' });
    } catch (error) {
      console.error(error);
      return reply.code(404).send({ error: error.message });
    }
  }
};

module.exports = AdminController;