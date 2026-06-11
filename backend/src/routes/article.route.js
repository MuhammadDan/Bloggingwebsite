// src/routes/article.route.js
const articleController = require('../controllers/article.controller');
const articleSchemas = require('../schemas/article.schema');
const upload = require('../middlewares/upload.middlewear');

async function articleRoutes(fastify) {

  // Image Upload Route - schema nahi hoga kyunki file upload hai
  fastify.post('/articles/upload-image', {
    preHandler: [fastify.authenticate, upload.single('image')]
  }, articleController.uploadImage);

  // Create Article - schema WAPAS rakha ✅
  fastify.post('/articles', {
    preHandler: fastify.authenticate,
    schema: articleSchemas.createArticle  // ← WAPAS AA GAYA
  }, articleController.createArticle);

  // Public Routes
  fastify.get('/articles', {
    schema: articleSchemas.getAllArticles  // ✅
  }, articleController.getPublishedArticles);

  fastify.get('/articles/:slug', {
    schema: articleSchemas.getArticleBySlug  // ✅
  }, articleController.getArticleBySlug);

  // Protected Routes
  fastify.get('/articles/my', {
    preHandler: fastify.authenticate
  }, articleController.getMyArticles);

  fastify.put('/articles/:id', {
    preHandler: fastify.authenticate,
    schema: articleSchemas.updateArticle  // ✅
  }, articleController.updateArticle);

  fastify.delete('/articles/:id', {
    preHandler: fastify.authenticate
  }, articleController.deleteArticle);

   fastify.post('/articles/:id/like', {
    preHandler: fastify.authenticate
  }, articleController.toggleLike);
  
}

module.exports = articleRoutes;