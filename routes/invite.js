const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { v4: uuidv4 } = require('uuid');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, async (req, res) => {
  const { name, email, event_id } = req.body;
  const token = uuidv4();

  if (!name || !email || !event_id) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  try {
    // 1. Insert or update guest with token
    await db.execute(
      'INSERT INTO Guest (name, email, token) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = ?',
      [name, email, token, token]
    );

    // 2. Get guest_id
    const [guests] = await db.execute('SELECT guest_id FROM Guest WHERE email = ?', [email]);
    const guest_id = guests[0].guest_id;

    // 3. Insert into Attendance (if not already exists)
    await db.execute(
      'INSERT IGNORE INTO Attendance (guest_id, event_id) VALUES (?, ?)',
      [guest_id, event_id]
    );

    // 4. Respond with link
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
