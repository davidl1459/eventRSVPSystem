import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { EventContext } from '../context/EventContext';
import { useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const { events } = useContext(EventContext);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const selectedEvent = events.find(event => event.event_id === Number(selectedEventId));
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState([]);
  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEventList(res.data);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      }
    };

    fetchEvents();
  }, []);

useEffect(() => {
  const fetchAttendees = async () => {
    if (!selectedEventId) return;
    const token = localStorage.getItem('token');

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/attendance/${selectedEventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendees(res.data);
    } catch (err) {
      console.error('Failed to fetch attendees:', err);
      setAttendees([]);
    }
  };

  fetchAttendees();
}, [selectedEventId]);


  return (
    <div>
      <div className="admin-header">Admin Dashboard</div>
      <div className="admin-layout">
        <div className="admin-sidebar">
          <a href="/dashboard">Home</a>
          <a href="/create">Create Event</a>
          <a href="/invite">Invite Guests</a>
          <a href="/login">Logout</a>
        </div>

        <div className="admin-main">
          <h2 className="section-title">Event List</h2>
          <table className="event-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Event Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {eventList.map((event) => (
                <tr
                  key={event.event_id}
                  onClick={() => setSelectedEventId(event.event_id)}
                  className="clickable-row"
                >
                  <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>{event.event_id}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent row click
                        navigator.clipboard.writeText(event.event_id);
                      }}
                      className="copy-btn"
                      title="Copy Event ID"
                    >
                      📋
                    </button>
                  </td>
                  <td>{event.title}</td>
                  <td>{event.date?.split('T')[0]}</td>
                  <td>{event.time}</td>
                  <td>{event.location}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedEvent && (
  <>
    <h3 className="section-subtitle">Attendees for: {selectedEvent.title}</h3>
    <table className="event-table attendee-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Attendance</th>
          <th>Comment</th>
        </tr>
      </thead>
      <tbody>
        {attendees.length > 0 ? (
          attendees.map((att, index) => (
            <tr key={index}>
              <td>{att.name}</td>
              <td>{att.email}</td>
              <td>{att.response ? 'Yes' : 'No'}</td>
              <td>{att.comment}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4">No attendees yet.</td>
          </tr>
        )}
      </tbody>
    </table>
              <div className="see-all-wrapper">
                <button className="see-all-button" onClick={() => navigate('/attendance')}>
                  See All
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
