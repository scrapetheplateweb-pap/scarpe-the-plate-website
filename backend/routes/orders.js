const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await pool.query(
      `SELECT o.*, 
        (SELECT json_agg(json_build_object(
          'id', oi.id,
          'product_name', oi.product_name,
          'product_price', oi.product_price,
          'quantity', oi.quantity
        )) FROM order_items oi WHERE oi.order_id = o.id) as items
       FROM orders o
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [req.session.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

router.get('/admin', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    const result = await pool.query(
      `SELECT o.*, 
        (SELECT json_agg(json_build_object(
          'id', oi.id,
          'product_name', oi.product_name,
          'product_price', oi.product_price,
          'quantity', oi.quantity
        )) FROM order_items oi WHERE oi.order_id = o.id) as items
       FROM orders o
       ORDER BY o.created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone, shipping_address, items, total_amount } = req.body;
    const userId = req.session.userId || null;

    if (!customer_name || !customer_email || !items || !total_amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const orderResult = await client.query(
        `INSERT INTO orders (user_id, customer_name, customer_email, customer_phone, shipping_address, total_amount, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [userId, customer_name, customer_email, customer_phone, shipping_address, total_amount, 'pending']
      );

      const orderId = orderResult.rows[0].id;

      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity)
           VALUES ($1, $2, $3, $4, $5)`,
          [orderId, item.product_id, item.product_name, item.product_price, item.quantity]
        );

        await client.query(
          'UPDATE products SET stock = stock - $1 WHERE id = $2',
          [item.quantity, item.product_id]
        );
      }

      await client.query('COMMIT');
      res.json(orderResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
