import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateEvent.css';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/events`, {
        organizer_id: 3, // optionally parse this from JWT later
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Event created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Failed to create event');
    }
  };

  return (
    <div>
      <div className="admin-header">Create Event</div>
      <div className="admin-layout">
        <div className="admin-sidebar">
          <Link to="/dashboard">Home</Link>
          <Link to="/create">Create Event</Link>
          <Link to="/login">Logout</Link>
        </div>

        <div className="admin-main center-form">
          <form className="event-form" onSubmit={handleSubmit}>
            <label>Event Name</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <label>Event Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <label>Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />

            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />

            <div className="button-center">
              <button type="submit" className="create-btn">Create Event</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
