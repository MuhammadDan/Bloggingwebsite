// src/routes/ai.route.js

const { generatePost } = require('../controllers/ai.controller');
// const { generatePostSchema } = require('../schemas/ai.schema');

async function aiRoutes(fastify) {
  fastify.post('/ai/generate', {
    // schema: generatePostSchema,
    preHandler: [fastify.authenticate]   // JWT check
  }, generatePost);
}

module.exports = aiRoutes;