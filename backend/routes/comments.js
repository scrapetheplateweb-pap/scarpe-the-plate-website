const express = require('express');
const pool = require('../db');
const { logActivity } = require('../utils/activityLogger');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { postId } = req.query;

    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    const result = await pool.query(
      `SELECT c.*, u.username, u.display_name
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.post_id = $1
       ORDER BY c.created_at DESC`,
      [postId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { postId, content } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Must be logged in to comment' });
    }

    if (!postId || !content) {
      return res.status(400).json({ error: 'Post ID and content are required' });
    }

    const result = await pool.query(
      `INSERT INTO comments (post_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [postId, userId, content]
    );

    const comment = result.rows[0];

    const userResult = await pool.query(
      'SELECT username, display_name FROM users WHERE id = $1',
      [userId]
    );

    await logActivity(req, 'comment_created', `Commented on post ID: ${postId}`);

    res.json({
      ...comment,
      username: userResult.rows[0].username,
      display_name: userResult.rows[0].display_name
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Must be logged in to delete comments' });
    }

    const comment = await pool.query('SELECT user_id FROM comments WHERE id = $1', [id]);

    if (comment.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await pool.query('DELETE FROM comments WHERE id = $1', [id]);
    await logActivity(req, 'comment_deleted', `Deleted comment ID: ${id}`);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
