import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AttendanceList.css';
import axios from 'axios';

const AttendanceList = () => {
  const [attendees, setAttendees] = useState([]);
  const [attendanceFilter, setAttendanceFilter] = useState('All');
  const [eventFilter, setEventFilter] = useState('All');

  useEffect(() => {
    const fetchAttendees = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/attendance/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAttendees(res.data);
        console.log('Fetched attendance:', res.data); // Debug log
      } catch (err) {
        console.error('Failed to fetch attendance list:', err);
      }
    };

    fetchAttendees();
  }, []);

  const filteredAttendees = attendees.filter(att => {
    const matchAttendance =
      attendanceFilter === 'All' || att.attendance === attendanceFilter;
    const matchEvent =
      eventFilter === 'All' || att.eventName === eventFilter;
    return matchAttendance && matchEvent;
  });
  
  
  const uniqueEventNames = Array.from(new Set(attendees.map(att => att.eventName)));

  return (
    <div>
      <div className="admin-header">Attendance List</div>
      <div className="admin-layout">
        <div className="admin-sidebar">
          <Link to="/dashboard">Home</Link>
          <Link to="/create">Create Event</Link>
          <Link to="/invite">Invite Guests</Link>
          <Link to="/login">Logout</Link>
        </div>

        <div className="admin-main">
          <div className="header-row">
            <h2 className="section-title">All Attendees</h2>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div className="filter-wrapper">
                <label htmlFor="attendanceFilter">Attendance: </label>
                <select
                  id="attendanceFilter"
                  value={attendanceFilter}
                  onChange={(e) => setAttendanceFilter(e.target.value)}
                  className="filter-dropdown"
                >
                  <option value="All">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="filter-wrapper">
                <label htmlFor="eventFilter">Event: </label>
                <select
                  id="eventFilter"
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="filter-dropdown"
                >
                  <option value="All">All Events</option>
                  {uniqueEventNames.map((name, idx) => (
                    <option key={idx} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <table className="event-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Name</th>
                <th>Email</th>
                <th>Attendance</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendees.length > 0 ? (
                filteredAttendees.map((att, index) => (
                  <tr key={index}>
                    <td>{att.eventName}</td>
                    <td>{att.name}</td>
                    <td>{att.email}</td>
                    <td>{att.attendance}</td>
                    <td>{att.comment}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No attendees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceList;
