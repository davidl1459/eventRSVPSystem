const express = require('express');
const router = express.Router();
const db = require('../services/db');

router.post('/:token', async (req, res) => {
  const { token } = req.params;
  const { event_id, response, comment } = req.body;

  try {
    const [guest] = await db.execute('SELECT * FROM Guest WHERE token = ?', [token]);
    if (guest.length === 0)
      return res.status(404).json({ success: false, message: 'Invalid token' });

    await db.execute(
      'INSERT INTO Attendance (guest_id, event_id, response, comment) VALUES (?, ?, ?, ?)',
      [guest[0].guest_id, event_id, response, comment]
    );

    res.status(200).json({ success: true, message: 'RSVP submitted successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Already RSVP’d' });
    }
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to submit RSVP' });
  }
});

module.exports = router;
