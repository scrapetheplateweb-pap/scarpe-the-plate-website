const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/:page', async (req, res) => {
  try {
    const { page } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM page_sections WHERE page = $1 ORDER BY section_order ASC',
      [page]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get sections error:', error);
    res.status(500).json({ error: 'Failed to get sections' });
  }
});

router.post('/:page/reorder', async (req, res) => {
  try {
    if (!req.session.isAdmin) {
      return res.status(403).json({ error: 'Admin privileges required' });
    }

    const { page } = req.params;
    const { sections } = req.body;

    if (!Array.isArray(sections)) {
      return res.status(400).json({ error: 'Sections must be an array' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (let i = 0; i < sections.length; i++) {
        const { section_id, visible } = sections[i];
        
        await client.query(
          `INSERT INTO page_sections (page, section_id, section_order, visible)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (page, section_id)
           DO UPDATE SET section_order = $3, visible = $4, updated_at = CURRENT_TIMESTAMP`,
          [page, section_id, i, visible !== undefined ? visible : true]
        );
      }

      await client.query('COMMIT');

      const result = await pool.query(
        'SELECT * FROM page_sections WHERE page = $1 ORDER BY section_order ASC',
        [page]
      );

      res.json(result.rows);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Reorder sections error:', error);
    res.status(500).json({ error: 'Failed to reorder sections' });
  }
});

router.patch('/:page/:sectionId/visibility', async (req, res) => {
  try {
    if (!req.session.isAdmin) {
      return res.status(403).json({ error: 'Admin privileges required' });
    }

    const { page, sectionId } = req.params;
    const { visible } = req.body;

    const result = await pool.query(
      `UPDATE page_sections SET visible = $1, updated_at = CURRENT_TIMESTAMP
       WHERE page = $2 AND section_id = $3 RETURNING *`,
      [visible, page, sectionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Section not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update section visibility error:', error);
    res.status(500).json({ error: 'Failed to update section visibility' });
  }
});

module.exports = router;
