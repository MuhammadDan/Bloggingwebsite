// BACKEND/src/routes/admin.routes.js
const AdminController = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

async function adminRoutes(fastify) {
  fastify.get('/admin/dashboard', {
    preHandler: [verifyToken, isAdmin]
  }, AdminController.getDashboardStats);

  fastify.get('/admin/articles', {
    preHandler: [verifyToken, isAdmin]
  }, AdminController.getAllArticles);

  fastify.delete('/admin/articles/:id', {
    preHandler: [verifyToken, isAdmin]
  }, AdminController.deleteArticle);
}

module.exports = adminRoutes;