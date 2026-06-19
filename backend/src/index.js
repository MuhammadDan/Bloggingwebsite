// src/index.js
const fastify = require("fastify")({ logger: true });

// ====================== PLUGINS ======================

// Multipart support (agar future mein file upload karna ho)
fastify.register(require("@fastify/multipart"), {
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Environment variables
fastify.register(require("@fastify/env"), {
  schema: {
    type: "object",
    required: ["PORT", "JWT_SECRET"],
    properties: {
      PORT: { type: "string", default: "4000" },
      DB_HOST: { type: "string" },
      DB_PORT: { type: "string" },
      DB_NAME: { type: "string" },
      DB_USER: { type: "string" },
      DB_PASSWORD: { type: "string" },
      JWT_SECRET: { type: "string" },
      ADMIN_GIVEN_TOKEN: { type: "string" },
      EMAIL_HOST: { type: "string" },
      EMAIL_PORT: { type: "string" },
      EMAIL_USER: { type: "string" },
      EMAIL_PASS: { type: "string" },
      CLOUDINARY_CLOUD_NAME: { type: "string" },
      CLOUDINARY_API_KEY: { type: "string" },
      CLOUDINARY_API_SECRET: { type: "string" },
    },
  },
  data: process.env,
  dotenv: true,
});

// CORS
fastify.register(require("@fastify/cors"), {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

// ====================== AUTHENTICATION ======================
// JWT Authentication Decorator
fastify.decorate("authenticate", async (request, reply) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.code(401).send({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const jwt = require("jsonwebtoken");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded; // ← yahan se request.user milna chahiye
  } catch (err) {
    return reply.code(401).send({ error: "Invalid or expired token" });
  }
});

// ====================== ROUTES ======================

// Auth Routes
const authRoutes = require("./routes/auth.routes");
fastify.register(authRoutes, { prefix: "/api/auth" });

// Article Routes
fastify.register(require("./routes/article.route"), { prefix: "/api/blog" });

// Comments routes
fastify.register(require("./routes/comment.route"), { prefix: "/api/blog" });

// Basic Test Route
fastify.get("/", async (request, reply) => {
  return {
    message: "Hello from Fastify backend! 🚀 Blog app chal raha hai.",
  };
});

// Ai chats
fastify.register(require("./routes/ai.route"), { prefix: "/api" });

// payment routes
fastify.register(require("./routes/payment.route"), { prefix: "" });

// userdashbaord routes
fastify.register(require("./routes/userdashboard.route"), {prefix:"/user"});

// admin dashboard routes
const adminRoutes = require('./routes/admin.routes');
fastify.register(adminRoutes, { prefix: '/api' });

// ====================== START SERVER ======================
const start = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT || 4000,
      host: "0.0.0.0",
    });

    console.log(
      `Backend server chal raha hai → http://localhost:${process.env.PORT || 4000}`,
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
