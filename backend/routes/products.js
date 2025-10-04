const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, active } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (category) {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (active !== undefined) {
      query += ` AND active = $${paramCount}`;
      params.push(active === 'true');
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to get product' });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    const { name, description, price, image_url, stock, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const result = await pool.query(
      `INSERT INTO products (name, description, price, image_url, stock, category)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description, price, image_url, stock || 0, category]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    const { id } = req.params;
    const { name, description, price, image_url, stock, category, active } = req.body;

    const result = await pool.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, image_url = $4, 
           stock = $5, category = $6, active = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 RETURNING *`,
      [name, description, price, image_url, stock, category, active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
