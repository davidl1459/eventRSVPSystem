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

// Get all events
router.get('/', verifyToken, async (req, res) => {
  try {
    const [events] = await db.execute('SELECT * FROM Event');
    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
});

// Get single event by ID
router.get('/:id', async (req, res) => {
  const eventId = req.params.id;

  try {
    const [rows] = await db.execute('SELECT * FROM Event WHERE event_id = ?', [eventId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ message: 'Failed to fetch event' });
  }
});

// Update an event
router.put('/:id', verifyToken, async (req, res) => {
  const eventId = req.params.id;
  const { title, description, date, time, location } = req.body;

  try {
    await db.execute(
      'UPDATE Event SET title = ?, description = ?, date = ?, time = ?, location = ? WHERE event_id = ?',
      [title, description, date, time, location, eventId]
    );

    res.status(200).json({ success: true, message: 'Event updated successfully' });
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ success: false, message: 'Error updating event' });
  }
});

// Delete an event and associated guests
router.delete('/:id', verifyToken, async (req, res) => {
  const eventId = req.params.id;

  try {
    // 1. Delete attendance records for this event
    await db.execute('DELETE FROM Attendance WHERE event_id = ?', [eventId]);
  
    // 2. Optionally delete guests with no more attendance (only if needed)
     await db.execute('DELETE FROM Guest WHERE guest_id NOT IN (SELECT DISTINCT guest_id FROM Attendance)');
  
    // 3. Delete the event
    await db.execute('DELETE FROM Event WHERE event_id = ?', [eventId]);
  
    res.status(200).json({ success: true, message: 'Event and associated attendance deleted successfully' });
  } catch (err) {
    console.error('Error deleting event and related data:', err);
    res.status(500).json({ success: false, message: 'Error deleting event and guests' });
  }
  
});

module.exports = router;
