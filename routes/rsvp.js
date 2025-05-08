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

    // 3. Check if already RSVP’d for the event
    const [existing] = await db.execute(
      'SELECT * FROM Attendance WHERE guest_id = ? AND event_id = ?',
      [guest.guest_id, event_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'You have already RSVP’d for this event' });
    }

    // 4. Insert into Attendance table
    await db.execute(
      `INSERT INTO Attendance (guest_id, event_id, response, comment, timestamp)
       VALUES (?, ?, ?, ?, NOW())`,
      [guest.guest_id, event_id, response, comment]
    );

    res.status(200).json({ success: true, message: 'RSVP submitted successfully' });
  } catch (err) {
    console.error('RSVP error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit RSVP' });
  }

  // Get event details
const [events] = await db.execute('SELECT * FROM Event WHERE event_id = ?', [event_id]);
if (events.length === 0) {
  return res.status(404).json({ success: false, message: 'Event not found' });
}

const event = events[0];
const eventDateTime = new Date(`${event.date}T${event.time}`);
const now = new Date();

if (eventDateTime < now) {
  return res.status(400).json({ success: false, message: 'The event is already over' });
}

});

module.exports = router;
