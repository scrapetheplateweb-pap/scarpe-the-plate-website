const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page } = req.query;
    let query = `
      SELECT p.*, u.username, u.display_name,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
    `;
    const params = [];

    if (page) {
      query += ' WHERE p.page = $1';
      params.push(page);
    }

    query += ' ORDER BY p.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to get posts' });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Must be logged in to create posts' });
    }

    const { page, title, content, imageUrl, videoUrl } = req.body;

    if (!page) {
      return res.status(400).json({ error: 'Page is required' });
    }

    const result = await pool.query(
      'INSERT INTO posts (page, title, content, image_url, video_url, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [page, title || '', content || '', imageUrl || null, videoUrl || null, req.session.userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Must be logged in to delete posts' });
    }

    const { id } = req.params;
    
    const post = await pool.query('SELECT user_id FROM posts WHERE id = $1', [id]);
    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.rows[0].user_id !== req.session.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Must be logged in to like posts' });
    }

    const existingLike = await pool.query(
      'SELECT id FROM likes WHERE post_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingLike.rows.length > 0) {
      await pool.query('DELETE FROM likes WHERE post_id = $1 AND user_id = $2', [id, userId]);
      res.json({ liked: false });
    } else {
      await pool.query('INSERT INTO likes (post_id, user_id) VALUES ($1, $2)', [id, userId]);
      res.json({ liked: true });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

router.get('/:id/liked', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

    if (!userId) {
      return res.json({ liked: false });
    }

    const result = await pool.query(
      'SELECT id FROM likes WHERE post_id = $1 AND user_id = $2',
      [id, userId]
    );

    res.json({ liked: result.rows.length > 0 });
  } catch (error) {
    console.error('Check liked error:', error);
    res.status(500).json({ error: 'Failed to check like status' });
  }
});

module.exports = router;
