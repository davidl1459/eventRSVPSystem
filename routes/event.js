const express = require('express');
const router = express.Router();
const db = require('../services/db');
const verifyToken = require('../middleware/auth');

// Create a new event
router.post('/', verifyToken, async (req, res) => {
  const { organizer_id, title, description, date, time, location } = req.body;

  if (!organizer_id || !title || !date || !time || !location) {
    return res.status(400).json({ success: false, message: 'Missing event fields' });
  }

  try {
    await db.execute(
      'INSERT INTO Event (organizer_id, title, description, date, time, location) VALUES (?, ?, ?, ?, ?, ?)',
      [organizer_id, title, description, date, time, location]
    );

    res.status(201).json({ success: true, message: 'Event created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error creating event' });
  }
});

// Get all events (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    const [events] = await db.execute('SELECT * FROM Event');
    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
});

// 🔥 GET event by ID (for public RSVP)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute('SELECT * FROM Event WHERE event_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching event' });
  }
});

module.exports = router;
