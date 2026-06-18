// src/routes/article.route.js
const articleController = require('../controllers/article.controller');
const articleSchemas = require('../schemas/article.schema');
const upload = require('../middlewares/upload.middlewear');

async function articleRoutes(fastify) {

  // Image Upload
  fastify.post('/articles/upload-image', {
    preHandler: [fastify.authenticate, upload.single('image')]
  }, articleController.uploadImage);

  // Create Article
  fastify.post('/articles', {
    preHandler: fastify.authenticate,
    schema: articleSchemas.createArticle
  }, articleController.createArticle);

  // ✅ /articles/my PEHLE hona chahiye — warna :slug isse intercept kar leta hai
  fastify.get('/articles/my', {
    preHandler: fastify.authenticate
  }, articleController.getMyArticles);

  // ✅ ID se single article fetch (edit page ke liye)
  fastify.get('/articles/id/:id', {
    preHandler: fastify.authenticate
  }, articleController.getArticleById);

  // Public Routes — baad mein
  fastify.get('/articles', {
    schema: articleSchemas.getAllArticles
  }, articleController.getPublishedArticles);

  fastify.get('/articles/:slug', {
    schema: articleSchemas.getArticleBySlug
  }, articleController.getArticleBySlug);

  // Update & Delete by ID
  fastify.put('/articles/:id', {
    preHandler: fastify.authenticate,
    schema: articleSchemas.updateArticle
  }, articleController.updateArticle);

  fastify.delete('/articles/:id', {
    preHandler: fastify.authenticate
  }, articleController.deleteArticle);

  fastify.post('/articles/:id/like', {
    preHandler: fastify.authenticate
  }, articleController.toggleLike);

}

module.exports = articleRoutes;