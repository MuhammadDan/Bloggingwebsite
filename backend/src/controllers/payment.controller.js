// src/controllers/payment.controller.js
const { createCheckoutSession } = require('../services/payment.service');
const UserRepository = require('../repositories/user.repository');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const getUserPlan = async (req, reply) => {
  try {
    const user = await UserRepository.findById(req.user.id);
    if (!user) return reply.code(404).send({ success: false, message: "User not found" });

    reply.send({
      success: true,
      hasActivePlan: user.plan !== 'none' && user.plan !== null,
      plan: user.plan,
      aiCredits: user.aiCredits,
    });
  } catch (error) {
    reply.code(500).send({ success: false, message: "Could not fetch plan" });
  }
};

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
    if (!sessionId) return reply.code(400).send({ success: false, message: "Session ID required" });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return reply.code(400).send({ success: false, message: "Payment not completed" });
    }

    const plan = session.metadata?.plan || 'basic';
    const credits = plan === 'premium' ? 999999 : 20;

    // ✅ Actually saves to DB now — was silently failing before
    await UserRepository.updatePlan(req.user.id, plan, credits);

    reply.send({ success: true, message: "Payment verified", plan });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    reply.code(500).send({ success: false, message: "Payment verification failed" });
  }
};


module.exports = {
  getUserPlan,
  createPaymentSession,
  verifyPayment
};