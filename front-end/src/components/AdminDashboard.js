import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import axios from 'axios';
import { EventContext } from '../context/EventContext';

const AdminDashboard = () => {
  const { events } = useContext(EventContext);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const navigate = useNavigate();

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

  const handleEditClick = (event) => {
    setEditingEventId(event.event_id);
    setEditFormData({ ...event });
  };

  const handleEditChange = (e) => {
    setEditFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSave = async () => {
    const token = localStorage.getItem('token');
  
    // Use the date directly from the input (no timezone conversion)
    const updatedData = {
      ...editFormData,
      date: editFormData.date // no Date() conversion!
    };
  
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/events/${editingEventId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Event updated!');
      setEditingEventId(null);
      window.location.reload();
    } catch (err) {
      console.error('Failed to update event:', err);
      alert('Update failed.');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this event and its guests?');
    if (!confirm) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Event deleted.');
      window.location.reload();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete event.');
    }
  };

  return (
    <div>
      <div className="admin-header">Admin Dashboard</div>
      <div className="admin-layout">
        <div className="admin-sidebar">
          <a href="/dashboard">Home</a>
          <a href="/create">Create Event</a>
          <a href="/login">Logout</a>
        </div>

        <div className="admin-main">
          <h2 className="section-title">Event List</h2>
          <table className="event-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Title</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {eventList.map((event) => (
                <tr key={event.event_id} onClick={() => setSelectedEventId(event.event_id)} className="clickable-row">
                  <td>{event.event_id}</td>
                  {editingEventId === event.event_id ? (
                    <>
                      <td><input name="title" value={editFormData.title} onChange={handleEditChange} /></td>
                      <td><input type="date" name="date" value={ editFormData.date ? editFormData.date.length > 10 ? editFormData.date.slice(0, 10) : editFormData.date : ''} 
                      onChange={handleEditChange} /></td>

                      <td><input type="time" name="time" value={editFormData.time?.slice(0, 5) || ''} onChange={handleEditChange} /></td>
                      <td><input name="location" value={editFormData.location} onChange={handleEditChange} /></td>
                      <td>
                        <button onClick={handleEditSave}>💾 Save</button>
                        <button onClick={() => setEditingEventId(null)}>❌ Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{event.title}</td>
                      <td>{event.date}</td>
                      <td>{event.time}</td>
                      <td>{event.location}</td>
                      <td>
                        <button onClick={() => handleEditClick(event)}>✏️ Edit</button>
                        <button onClick={() => handleDelete(event.event_id)}>🗑 Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {selectedEventId && attendees.length > 0 && (
            <>
              <h3 className="section-subtitle">Attendees</h3>
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
                  {attendees.map((att, idx) => (
                    <tr key={idx}>
                      <td>{att.name}</td>
                      <td>{att.email}</td>
                      <td>{att.response ? 'Yes' : 'No'}</td>
                      <td>{att.comment}</td>
                    </tr>
                  ))}
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
