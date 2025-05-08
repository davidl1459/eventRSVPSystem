const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../services/db');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, async (req, res) => {
  const { name, gender, status, event_id } = req.body;

  if (!name || !gender || !status || !event_id) {
    return res.status(400).json({ success: false, message: 'Missing guest info or event ID' });
  }

  try {
    // Generate JWT with guest info and event_id
    const payload = { name, gender, status, event_id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Save guest + token to DB (NO event_id stored in DB)
    await db.execute(
      `INSERT INTO Guest (name, gender, status, token)
       VALUES (?, ?, ?, ?)`,
      [name, gender, status, token]
    );

    const rsvpLink = `http://localhost:3000/rsvp?token=${token}`;
    res.status(200).json({
      success: true,
      message: 'RSVP link generated',
      link: rsvpLink
    });
  } catch (err) {
    console.error('Token generation failed:', err);
    res.status(500).json({ success: false, message: 'Failed to generate link' });
  }
});

module.exports = router;
