const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { v4: uuidv4 } = require('uuid');

router.post('/', async (req, res) => {
  const { name, email } = req.body;
  const token = uuidv4();

  try {
    await db.execute(
      'INSERT INTO Guest (name, email, token) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = ?',
      [name, email, token, token]
    );

    const rsvpLink = `http://localhost:3000/rsvp/${token}`;
    return res.status(200).json({
      success: true,
      message: 'Guest invited successfully',
      link: rsvpLink
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to invite guest' });
  }
});

module.exports = router;
