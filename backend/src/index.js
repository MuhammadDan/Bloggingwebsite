// src/index.js
// const { connectDB } = require('./db'); 
const fastify = require('fastify')({ logger: true });

// .env plugin register (pehla register karo)
fastify.register(require('@fastify/env'), {
  schema: {
    type: 'object',
    required: ['PORT'],
    properties: {
      PORT: { type: 'string', default: 4000 },
      DB_HOST: { type: 'string' },
      DB_PORT: { type: 'string' },
      DB_NAME: { type: 'string' },
      DB_USER: { type: 'string' },
      DB_PASSWORD: { type: 'string' },
      JWT_SECRET: { type: 'string' },
      ADMIN_GIVEN_TOKEN: { type: 'string' },
      EMAIL_HOST: { type: 'string' },
      EMAIL_PORT: { type: 'string' },
      EMAIL_USER: { type: 'string' },
      EMAIL_PASS: { type: 'string' }
    }
  },
  data: process.env,
  dotenv: true
});

// CORS enable karo (yeh line add kar do)
fastify.register(require('@fastify/cors'), {
  origin: 'http://localhost:3000',        // frontend ka URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
});

// Register Sequelize connection (agar tumhara db.js hai to yeh add karo)
// ya jo bhi tumhara db connect file hai

// Register auth routes (YAHAN ADD KARNA HAI)
const authRoutes = require('./routes/auth.routes');
fastify.register(authRoutes, { prefix: '/api/auth' });

// Basic test route
fastify.get('/', async (request, reply) => {
  return { message: 'Hello from Fastify backend! 🚀 Blog app chal raha hai.' };
});

// Server start function
const start = async () => {
  try {
    // await connectDB();  // DB connect pehle (agar hai to)

    await fastify.listen({ port: process.env.PORT || 4000, host: '0.0.0.0' });
    console.log(`Backend server chal raha hai → http://localhost:${process.env.PORT || 4000}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();