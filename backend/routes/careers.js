const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service_type, experience, portfolio_url, message } = req.body;

    if (!name || !email || !service_type) {
      return res.status(400).json({ error: 'Name, email, and service type are required' });
    }

    if (name.length > 255 || email.length > 255) {
      return res.status(400).json({ error: 'Name or email too long' });
    }

    if (message && message.length > 5000) {
      return res.status(400).json({ error: 'Message too long (max 5000 characters)' });
    }

    const result = await pool.query(
      `INSERT INTO job_applications (name, email, phone, service_type, experience, portfolio_url, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, email, phone, service_type, experience, portfolio_url, message]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

router.get('/', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    const { status, service_type } = req.query;
    let query = 'SELECT * FROM job_applications WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (service_type) {
      query += ` AND service_type = $${paramCount}`;
      params.push(service_type);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to get applications' });
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
      'UPDATE job_applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    const { id } = req.params;
    await pool.query('DELETE FROM job_applications WHERE id = $1', [id]);
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

module.exports = router;
