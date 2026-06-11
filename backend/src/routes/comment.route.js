// src/routes/comment.route.js
const commentController = require('../controllers/comment.controller');

async function commentRoutes(fastify) {
  // Saare comments fetch karo ek article ke liye (public)
  fastify.get('/comments/:articleId', commentController.getComments);

  // Comment add karo (login zaroori)
  fastify.post('/comments', {
    preHandler: fastify.authenticate,
  }, commentController.addComment);

  // Comment delete karo (login zaroori, sirf apna)
  fastify.delete('/comments/:id', {
    preHandler: fastify.authenticate,
  }, commentController.deleteComment);
}

module.exports = commentRoutes;