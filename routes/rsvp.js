const express = require('express');
const router = express.Router();
const db = require('../services/db');
const jwt = require('jsonwebtoken');

// POST /rsvp/:token
router.post('/:token', async (req, res) => {
  const { token } = req.params;
  const { email, response, comment } = req.body;

  try {
    // Decode token to get event_id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const event_id = decoded.event_id;

    if (!event_id) {
      return res.status(400).json({ success: false, message: 'Invalid token payload' });
    }

    // Look up guest by token only
    const [guests] = await db.execute('SELECT * FROM Guest WHERE token = ?', [token]);
    if (guests.length === 0) {
      return res.status(404).json({ success: false, message: 'Invalid RSVP token' });
    }

    const guest = guests[0];

    // Optional: update email if newly provided
    if (email && email !== guest.email) {
      await db.execute('UPDATE Guest SET email = ? WHERE guest_id = ?', [email, guest.guest_id]);
    }

    // Insert attendance
    await db.execute(
      `INSERT INTO Attendance (guest_id, event_id, response, comment, timestamp)
       VALUES (?, ?, ?, ?, NOW())`,
      [guest.guest_id, event_id, response, comment]
    );

    res.status(200).json({ success: true, message: 'RSVP submitted successfully' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'RSVP link expired' });
    }
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'You have already RSVP’d' });
    }

    console.error('RSVP error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit RSVP' });
  }
});

module.exports = router;
