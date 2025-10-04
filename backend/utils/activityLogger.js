const pool = require('../db');

async function logActivity(req, actionType, actionDetails = null, page = null) {
  try {
    const userId = req.session?.userId || null;
    const username = req.session?.username || 'anonymous';
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    await pool.query(
      `INSERT INTO user_activity (user_id, username, action_type, action_details, page, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, username, actionType, actionDetails, page, ipAddress, userAgent]
    );
  } catch (error) {
    console.error('Activity logging error:', error);
  }
}

module.exports = { logActivity };
