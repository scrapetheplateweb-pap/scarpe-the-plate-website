const express = require('express');
const router = express.Router();

let stripe;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    const Stripe = require('stripe');
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
} catch (error) {
  console.error('Stripe initialization error:', error);
}

router.post('/create-payment-intent', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY.' });
    }

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent: ' + error.message });
  }
});

router.post('/update-payment-intent', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe is not configured' });
    }

    const { payment_intent_id, order_id } = req.body;

    if (!payment_intent_id || !order_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const pool = require('../db');
    await pool.query(
      'UPDATE orders SET stripe_payment_intent_id = $1, status = $2 WHERE id = $3',
      [payment_intent_id, 'processing', order_id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Update payment intent error:', error);
    res.status(500).json({ error: 'Failed to update payment intent' });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).send('Stripe not configured');
    }

    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const pool = require('../db');

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await pool.query(
          'UPDATE orders SET status = $1 WHERE stripe_payment_intent_id = $2',
          ['completed', paymentIntent.id]
        );
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await pool.query(
          'UPDATE orders SET status = $1 WHERE stripe_payment_intent_id = $2',
          ['failed', failedPayment.id]
        );
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
