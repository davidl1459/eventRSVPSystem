const express = require('express');
const router = express.Router();
const db = require('../services/db');

router.get('/:token', async (req, res) => {
    const { token } = req.params;
    const [guestRows] = await db.execute('SELECT * FROM Guest WHERE token = ?', [token]);
  
    if (guestRows.length === 0)
      return res.status(404).json({ success: false, message: 'Invalid link' });
  
    const guest = guestRows[0];
  
    // Get guest's assigned event
    const [attendanceRows] = await db.execute('SELECT event_id FROM Attendance WHERE guest_id = ?', [guest.guest_id]);
    if (attendanceRows.length === 0)
      return res.status(404).json({ success: false, message: 'No event assigned to guest' });
  
    const eventId = attendanceRows[0].event_id;
    const [eventRows] = await db.execute('SELECT * FROM Event WHERE event_id = ?', [eventId]);
  
    res.status(200).json({
      guest: {
        name: guest.name,
        email: guest.email
      },
      event: eventRows[0]
    });
  });

  module.exports = router;

  