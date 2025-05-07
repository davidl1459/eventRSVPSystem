const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Simple login (no password hash for now)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [admin] = await db.execute(
      'SELECT * FROM Organizer WHERE email = ? AND password = ?',
      [email, password]
    );

    if (admin.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({ success: true, admin: admin[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Login error' });
  }
});

module.exports = router;
