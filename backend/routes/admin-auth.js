const express = require('express');
const router = express.Router();

const ADMIN_CODE = '4922';

router.post('/verify', async (req, res) => {
  try {
    const { accessCode } = req.body;

    if (accessCode === ADMIN_CODE) {
      req.session.isAdmin = true;
      await req.session.save();
      
      res.json({ 
        success: true, 
        message: 'Admin access granted' 
      });
    } else {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid access code' 
      });
    }
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

router.get('/status', async (req, res) => {
  res.json({ 
    isAdmin: req.session.isAdmin === true 
  });
});

router.post('/logout', async (req, res) => {
  req.session.isAdmin = false;
  await req.session.save();
  res.json({ success: true });
});

module.exports = router;
