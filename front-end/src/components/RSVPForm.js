import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Form.css';
import { EventContext } from '../context/EventContext';

const RSVPForm = () => {
  const { events, addAttendee } = useContext(EventContext);
  const [email, setEmail] = useState('');
  const [attendance, setAttendance] = useState('Yes');
  const [comment, setComment] = useState('');


  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  let eventId = '';
  let guestName = '';
  let gender = '';
  let status = '';

  if (token) {
    try {
      const decoded = jwtDecode(token);
      eventId = decoded.eventId;
      guestName = decoded.name;
      gender = decoded.gender;
      status = decoded.status;
    } catch (err) {
      console.error('Invalid token:', err);
    }
  }

  let prefix = '';
  if (gender.toLowerCase() === 'male') prefix = 'Mr.';
  else if (gender.toLowerCase() === 'female') {
    prefix = status === 'married' ? 'Mrs.' : 'Miss';
  }

  const selectedEvent = events.find(e => e.id === parseInt(eventId));

  const handleSubmit = (e) => {
    e.preventDefault();
    const attendee = {
      name: `${prefix} ${guestName}`,
      email,
      attendance,
      comment
    };

    if (eventId) {
      addAttendee(eventId, attendee);
      alert('RSVP submitted!');
    } else {
      alert('Invalid or missing event ID.');
    }

    setEmail('');
    setAttendance('Yes');
    setComment('');
  };

  return (
    <div className="rsvp-container">
      <div className="rsvp-left">
        <h2>{prefix} {guestName},</h2>
        <p>you are invited to attend:</p>
        <h3>{selectedEvent?.name || 'Event Not Found'}</h3>
        <p className="event-description">Please confirm your attendance by submitting the form.</p>
        <p className="event-location">{selectedEvent?.location || '-'}</p>
        <p className="event-date-time">
          {selectedEvent?.date
            ? `${selectedEvent.date.split('T')[0]} - ${selectedEvent.date.split('T')[1]}`
            : '-'}
        </p>
      </div>

      <form className="rsvp-right" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label>Attendance</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="att"
              value="Yes"
              checked={attendance === 'Yes'}
              onChange={() => setAttendance('Yes')}
            /> Yes
          </label>
          <label>
            <input
              type="radio"
              name="att"
              value="No"
              checked={attendance === 'No'}
              onChange={() => setAttendance('No')}
            /> No
          </label>
        </div>

        <label>Comment</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RSVPForm;
