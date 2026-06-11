// src/services/payment.service.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (userId, plan) => {
  try {
    let price = 499; // Default $4.99 USD (ya INR mein 499)

    if (plan === 'premium') price = 999;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',        // change to 'pkr' ya 'inr' agar chaho
            product_data: {
              name: `AI Blog Credits - ${plan === 'premium' ? 'Premium' : 'Basic'}`,
              description: 'AI se unlimited blog generate karo',
            },
            unit_amount: price * 100, // paise mein convert
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/posts/new`,
      metadata: {
        userId: userId,
        plan: plan,
      },
    });

    return session;
  } catch (error) {
    console.error("Payment Service Error:", error);
    throw new Error("Payment session create nahi ho saka");
  }
};

module.exports = {
  createCheckoutSession
};