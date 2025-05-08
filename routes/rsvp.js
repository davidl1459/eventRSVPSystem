const express = require('express');
const router = express.Router();
const db = require('../services/db');

// POST /rsvp/:token — Submit RSVP
router.post('/:token', async (req, res) => {
  const { token } = req.params;
  const { event_id, email, response, comment } = req.body;

  if (!event_id || !token) {
    return res.status(400).json({ success: false, message: 'Missing token or event ID' });
  }

  try {
    // 1. Find guest by token
    const [guests] = await db.execute('SELECT * FROM Guest WHERE token = ?', [token]);
    if (guests.length === 0) {
      return res.status(404).json({ success: false, message: 'Invalid RSVP token' });
    }

    const guest = guests[0];

    // 2. Optional: Update guest's email if provided
    if (email && email !== guest.email) {
      await db.execute('UPDATE Guest SET email = ? WHERE guest_id = ?', [email, guest.guest_id]);
    }

    // 3. Insert into Attendance table
    await db.execute(
      `INSERT INTO Attendance (guest_id, event_id, response, comment, timestamp)
       VALUES (?, ?, ?, ?, NOW())`,
      [guest.guest_id, event_id, response, comment]
    );

    res.status(200).json({ success: true, message: 'RSVP submitted successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'You have already RSVP’d' });
    }

    console.error('RSVP error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit RSVP' });
  }
});

module.exports = router;
