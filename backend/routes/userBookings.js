const express = require('express');
const pool = require('../db');
const { logActivity } = require('../utils/activityLogger');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Must be logged in to view bookings' });
    }

    const result = await pool.query(
      `SELECT b.*, u.username, u.display_name
       FROM bookings b
       LEFT JOIN users u ON b.user_id = u.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [req.session.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to get bookings' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, servicePage, bookingDate, bookingTime, details } = req.body;
    const userId = req.session.userId || null;

    if (!name || !email || !servicePage || !bookingDate || !bookingTime) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const result = await pool.query(
      `INSERT INTO bookings (user_id, name, email, phone, service_page, booking_date, booking_time, details)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, name, email, phone || '', servicePage, bookingDate, bookingTime, details || '']
    );

    await logActivity(req, 'booking_created', `Booking for ${servicePage} on ${bookingDate}`, servicePage);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

router.get('/my-bookings', async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Must be logged in to view bookings' });
    }

    const result = await pool.query(
      `SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ error: 'Failed to get bookings' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Must be logged in to update bookings' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const booking = await pool.query('SELECT user_id FROM bookings WHERE id = $1', [id]);
    if (booking.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.rows[0].user_id !== req.session.userId) {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }

    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Must be logged in to delete bookings' });
    }

    const { id } = req.params;
    
    const booking = await pool.query('SELECT user_id FROM bookings WHERE id = $1', [id]);
    if (booking.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.rows[0].user_id !== req.session.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this booking' });
    }

    await pool.query('DELETE FROM bookings WHERE id = $1', [id]);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

module.exports = router;
