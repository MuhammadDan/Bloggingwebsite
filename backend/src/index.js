// src/index.js
const fastify = require('fastify')({ logger: true });

// .env plugin register
fastify.register(require('@fastify/env'), {
  schema: {
    type: 'object',
    required: ['PORT'],
    properties: {
      PORT: { type: 'string', default: 4000 },
      DB_HOST: { type: 'string' },
      // aur baaki
    }
  },
  data: process.env,
  dotenv: true
});

// Basic test route
fastify.get('/', async (request, reply) => {
  return { message: 'Hello from Fastify backend! 🚀 Blog app chal raha hai.' };
});

// Server start function
const start = async () => {
  try {
    await fastify.listen({ port: 4000, host: '0.0.0.0' });
    console.log('Backend server chal raha hai → http://localhost:4000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();