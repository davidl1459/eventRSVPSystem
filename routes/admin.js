const express = require('express');
const router = express.Router();
const db = require('../services/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [admins] = await db.execute(
      'SELECT * FROM Organizer WHERE email = ?',
      [email]
    );

    if (admins.length === 0)
      return res.status(401).json({ success: false, message: 'Invalid email' });

    const admin = admins[0];

    const match = await bcrypt.compare(password, admin.password);
    if (!match)
      return res.status(401).json({ success: false, message: 'Wrong password' });

    // Generate JWT
    const token = jwt.sign(
      { organizer_id: admin.organizer_id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        organizer_id: admin.organizer_id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

module.exports = router;
