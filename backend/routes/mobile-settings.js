const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mobile_settings');
    
    const settings = {};
    result.rows.forEach(row => {
      try {
        settings[row.setting_key] = JSON.parse(row.setting_value);
      } catch (e) {
        settings[row.setting_key] = row.setting_value;
      }
    });

    res.json(settings);
  } catch (error) {
    console.error('Get mobile settings error:', error);
    res.status(500).json({ error: 'Failed to get mobile settings' });
  }
});

router.put('/:settingKey', async (req, res) => {
  try {
    if (!req.session.isAdmin) {
      return res.status(403).json({ error: 'Admin privileges required' });
    }

    const { settingKey } = req.params;
    const { value } = req.body;

    const settingValue = typeof value === 'string' ? value : JSON.stringify(value);

    const result = await pool.query(
      `INSERT INTO mobile_settings (setting_key, setting_value, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (setting_key)
       DO UPDATE SET setting_value = $2, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [settingKey, settingValue]
    );

    let parsedValue;
    try {
      parsedValue = JSON.parse(result.rows[0].setting_value);
    } catch (e) {
      parsedValue = result.rows[0].setting_value;
    }

    res.json({
      success: true,
      setting: {
        key: result.rows[0].setting_key,
        value: parsedValue
      }
    });
  } catch (error) {
    console.error('Update mobile settings error:', error);
    res.status(500).json({ error: 'Failed to update mobile settings' });
  }
});

router.post('/reset', async (req, res) => {
  try {
    if (!req.session.isAdmin) {
      return res.status(403).json({ error: 'Admin privileges required' });
    }

    const defaultSettings = {
      section_visibility: { hero: true, services: true, media: true, about: true, cta: true },
      navigation_items: ['home', 'about', 'comedy', 'car-wraps', 'modeling', 'media', 'store'],
      font_sizes: { heading: '1.8rem', subheading: '1.2rem', body: '1rem' },
      layout_mode: 'single-column',
      mobile_content: {}
    };

    for (const [key, value] of Object.entries(defaultSettings)) {
      await pool.query(
        `INSERT INTO mobile_settings (setting_key, setting_value, updated_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (setting_key)
         DO UPDATE SET setting_value = $2, updated_at = CURRENT_TIMESTAMP`,
        [key, JSON.stringify(value)]
      );
    }

    res.json({ success: true, message: 'Mobile settings reset to defaults' });
  } catch (error) {
    console.error('Reset mobile settings error:', error);
    res.status(500).json({ error: 'Failed to reset mobile settings' });
  }
});

module.exports = router;
