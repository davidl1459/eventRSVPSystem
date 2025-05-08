import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './Form.css';

const RSVPForm = () => {
  const [email, setEmail] = useState('');
  const [attendance, setAttendance] = useState('Yes');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

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
      eventId = decoded.eventId || decoded.event_id;
      guestName = decoded.name;
      gender = decoded.gender;
      status = decoded.status;
    } catch (err) {
      console.error('Invalid token:', err);
    }
  }

  // Prefix logic
  let prefix = '';
  if (gender.toLowerCase() === 'male') prefix = 'Mr.';
  else if (gender.toLowerCase() === 'female') {
    prefix = status === 'married' ? 'Mrs.' : 'Miss';
  }

  // Fetch event from backend
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/events/${eventId}`);
        setSelectedEvent(res.data);
      } catch (err) {
        console.error('Failed to fetch event:', err);
        setSelectedEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !eventId) {
      alert('Missing or invalid token.');
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/rsvp/${token}`, {
        event_id: eventId,
        email,
        response: attendance === 'Yes',
        comment
      });
    
      if (res.status === 200) {
        setSubmitted(true);
      } else {
        console.error('Unexpected response:', res);
        alert('Unexpected server response.');
      }
    } catch (err) {
      console.error('Failed to submit RSVP:', err);
      if (err.response?.status === 409) {
        alert('❗ You have already RSVP’d for this event.');
      } else {
        alert('Submission failed. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="rsvp-container"><p>⏳ Loading event details...</p></div>;
  }

  if (!selectedEvent) {
    return <div className="rsvp-container"><p>❌ Event not found or the link is invalid.</p></div>;
  }

  if (submitted) {
    return (
      <div className="rsvp-container">
        <div className="rsvp-left">
          <h2>Thank you, {prefix} {guestName}!</h2>
          <p>Your RSVP has been recorded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rsvp-container">
      <div className="rsvp-left">
        <h2>{prefix} {guestName},</h2>
        <p>You are invited to attend:</p>
        <h3>{selectedEvent.title}</h3>
        <p className="event-description">{selectedEvent.description || '-'}</p>
        <p className="event-location">{selectedEvent.location || '-'}</p>
        <p className="event-date-time">
          {selectedEvent?.date && selectedEvent?.time ? (
            `${new Date(selectedEvent.date).toLocaleDateString()} - ${selectedEvent.time.slice(0, 5)}`
          ) : '-'}
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
