// File: routes/attendance.js
const express = require('express');
const router = express.Router();
const db = require('../services/db');
const verifyToken = require('../middleware/auth');

router.get('/:event_id', verifyToken, async (req, res) => {
  const { event_id } = req.params;

  try {
    const [rows] = await db.execute(`
        SELECT 
    g.name, g.email,
    a.response, a.comment
    FROM Attendance a
    JOIN Guest g ON a.guest_id = g.guest_id
    WHERE a.event_id = ?
      
    `, [event_id]);

    router.get('/all', verifyToken, async (req, res) => {
        try {
          const [rows] = await db.execute(`
            SELECT 
              g.name,
              g.email,
              e.title AS eventName,
              a.response AS attendance,
              a.comment
            FROM Attendance a
            JOIN Guest g ON a.guest_id = g.guest_id
            JOIN Event e ON a.event_id = e.event_id
          `);
          res.status(200).json(rows);
        } catch (err) {
          console.error('Error fetching all attendance:', err);
          res.status(500).json({ message: 'Failed to fetch attendance' });
        }
      });
      

    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching attendees:', err);
    res.status(500).json({ message: 'Failed to fetch attendees' });
  }
});

module.exports = router;
