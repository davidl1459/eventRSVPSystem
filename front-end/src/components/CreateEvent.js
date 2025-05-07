import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CreateEvent.css';
import { EventContext } from '../context/EventContext';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    datetime: '',
    location: ''
  });

  const { addEvent } = useContext(EventContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      name: formData.name,
      date: formData.datetime,
      location: formData.location,
      description: formData.description
    };
    addEvent(newEvent);
    alert('Event created successfully!');
    navigate('/dashboard');
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
              name="name"
              value={formData.name}
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

            <label>Date & Time</label>
            <input
              type="datetime-local"
              name="datetime"
              value={formData.datetime}
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
