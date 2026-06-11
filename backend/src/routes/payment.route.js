// src/routes/payment.route.js
const paymentController = require('../controllers/payment.controller');

async function paymentRoutes(fastify) {
  
  // Create Stripe Checkout Session
  fastify.post('/api/payment/create-session', {
    preHandler: [fastify.authenticate],   // Login zaroori hai
  }, paymentController.createPaymentSession);

  fastify.post('/api/payment/verify', {
  preHandler: [fastify.authenticate]
}, paymentController.verifyPayment);

  // (Optional) Future mein payment success webhook ke liye
  // fastify.post('/api/payment/webhook', paymentController.handleWebhook);
}

module.exports = paymentRoutes;