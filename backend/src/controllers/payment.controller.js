// src/controllers/payment.controller.js
const { createCheckoutSession } = require('../services/payment.service');

const createPaymentSession = async (req, reply) => {
  try {
    const { plan = 'basic' } = req.body;
    const userId = req.user.id;   // JWT se aa raha hai

    const session = await createCheckoutSession(userId, plan);

    reply.send({
      success: true,
      url: session.url,           // Frontend is URL pe redirect karega
    });
  } catch (error) {
    console.error(error);
    reply.code(500).send({
      success: false,
      message: error.message || "Payment initialization failed"
    });
  }
};

const verifyPayment = async (req, reply) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return reply.code(400).send({ success: false, message: "Session ID required" });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // User ke AI Credits badhao (example: 50 credits)
      // Agar tumhare User model mein repository hai to use karo
      // Warna direct Sequelize use kar sakte ho

      await req.userRepository?.updateAiCredits?.(req.user.id, 50); // agar repository hai

      reply.send({ 
        success: true, 
        message: "Payment verified successfully" 
      });
    } else {
      reply.code(400).send({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    console.error("Verify Payment Error:", error);
    reply.code(500).send({ 
      success: false, 
      message: "Payment verification failed" 
    });
  }
};

module.exports = {
  createPaymentSession,
  verifyPayment
};