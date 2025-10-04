const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    const { limit = 100, user_id, action_type } = req.query;
    
    let query = `
      SELECT a.id, a.user_id, a.username, a.action_type, a.action_details, a.page, a.created_at, u.display_name
      FROM user_activity a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (user_id) {
      query += ` AND a.user_id = $${paramCount}`;
      params.push(user_id);
      paramCount++;
    }

    if (action_type) {
      query += ` AND a.action_type = $${paramCount}`;
      params.push(action_type);
      paramCount++;
    }

    query += ` ORDER BY a.created_at DESC LIMIT $${paramCount}`;
    params.push(parseInt(limit));

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Failed to get activity logs' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_actions,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT page) as pages_visited,
        COUNT(CASE WHEN action_type = 'page_view' THEN 1 END) as total_page_views,
        COUNT(CASE WHEN action_type = 'login' THEN 1 END) as total_logins,
        COUNT(CASE WHEN action_type = 'register' THEN 1 END) as total_registrations,
        COUNT(CASE WHEN action_type = 'post_created' THEN 1 END) as total_posts_created,
        COUNT(CASE WHEN action_type = 'comment_created' THEN 1 END) as total_comments,
        COUNT(CASE WHEN action_type = 'like' THEN 1 END) as total_likes,
        COUNT(CASE WHEN action_type = 'booking_created' THEN 1 END) as total_bookings
      FROM user_activity
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `);

    const recentActivity = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as actions
      FROM user_activity
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    const topPages = await pool.query(`
      SELECT 
        page,
        COUNT(*) as visits
      FROM user_activity
      WHERE action_type = 'page_view' AND page IS NOT NULL
      GROUP BY page
      ORDER BY visits DESC
      LIMIT 10
    `);

    res.json({
      stats: stats.rows[0],
      recentActivity: recentActivity.rows,
      topPages: topPages.rows
    });
  } catch (error) {
    console.error('Get activity stats error:', error);
    res.status(500).json({ error: 'Failed to get activity stats' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { action_type, action_details, page } = req.body;
    const userId = req.session.userId || null;
    const username = req.session.username || 'anonymous';
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    if (!action_type) {
      return res.status(400).json({ error: 'Action type is required' });
    }

    await pool.query(
      `INSERT INTO user_activity (user_id, username, action_type, action_details, page, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, username, action_type, action_details || null, page || null, ipAddress, userAgent]
    );

    res.json({ message: 'Activity logged successfully' });
  } catch (error) {
    console.error('Log activity error:', error);
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

module.exports = router;
