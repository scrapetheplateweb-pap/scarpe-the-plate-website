const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const userId = req.session.userId;
    const sessionId = req.sessionID;

    let query = `
      SELECT ci.*, p.name, p.description, p.price, p.image_url, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE `;
    
    const params = userId ? [userId] : [sessionId];
    query += userId ? 'ci.user_id = $1' : 'ci.session_id = $1';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const userId = req.session.userId || null;
    const sessionId = req.sessionID;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = await pool.query('SELECT stock FROM products WHERE id = $1', [product_id]);
    if (product.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.rows[0].stock < quantity) {
      return res.status(400).json({ error: 'Not enough stock' });
    }

    const existingItem = await pool.query(
      userId 
        ? 'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2'
        : 'SELECT * FROM cart_items WHERE session_id = $1 AND product_id = $2',
      userId ? [userId, product_id] : [sessionId, product_id]
    );

    let result;
    if (existingItem.rows.length > 0) {
      result = await pool.query(
        userId
          ? 'UPDATE cart_items SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND product_id = $3 RETURNING *'
          : 'UPDATE cart_items SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE session_id = $2 AND product_id = $3 RETURNING *',
        [quantity, userId || sessionId, product_id]
      );
    } else {
      result = await pool.query(
        'INSERT INTO cart_items (user_id, session_id, product_id, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, sessionId, product_id, quantity]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const result = await pool.query(
      'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM cart_items WHERE id = $1', [id]);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
});

router.delete('/clear', async (req, res) => {
  try {
    const userId = req.session.userId;
    const sessionId = req.sessionID;

    await pool.query(
      userId 
        ? 'DELETE FROM cart_items WHERE user_id = $1'
        : 'DELETE FROM cart_items WHERE session_id = $1',
      [userId || sessionId]
    );

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;
