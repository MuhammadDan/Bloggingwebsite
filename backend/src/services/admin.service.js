// BACKEND/src/services/admin.service.js
const adminRepository = require('../repositories/admin.repository');

class AdminService {
  async getDashboardStats() {
    return await adminRepository.getDashboardStats();
  }

  async getAllArticles() {
    return await adminRepository.getAllArticles();
  }

  async deleteArticle(id) {
    return await adminRepository.deleteArticle(id);
  }
}

module.exports = new AdminService();