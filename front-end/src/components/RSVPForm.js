import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import './Form.css';
import { EventContext } from '../context/EventContext';

const RSVPForm = () => {
  const { events, addAttendee } = useContext(EventContext);
  const [email, setEmail] = useState('');
  const [attendance, setAttendance] = useState('Yes');
  const [comment, setComment] = useState('');

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const eventId = searchParams.get('eventId');
  const guestName = searchParams.get('name') || 'Guest';
  const gender = searchParams.get('gender') || '';
  const status = searchParams.get('status') || '';

  const event = events.find(e => e.id === parseInt(eventId));

  // Prefix logic
  let prefix = '';
  if (gender.toLowerCase() === 'male') prefix = 'Mr.';
  else if (gender.toLowerCase() === 'female') {
    prefix = status.toLowerCase() === 'married' ? 'Mrs.' : 'Miss';
  }

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
      alert('RSVP submitted successfully!');
    } else {
      alert('Error: Event ID is missing.');
    }

    // Clear form (optional)
    setEmail('');
    setComment('');
    setAttendance('Yes');
  };

  return (
    <div className="rsvp-container">
      <div className="rsvp-left">
        <h2>{prefix} {guestName},</h2>
        <p>you are invited to attend:</p>
        <h3>{event ? event.name : 'Event Not Found'}</h3>
        <p className="event-description">
          Please confirm your attendance by filling out the form.
        </p>
        <p className="event-location">{event?.location || '-'}</p>
        <p className="event-date-time">
          {event?.date ? `${event.date.split('T')[0]} - ${event.date.split('T')[1]}` : '-'}
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
