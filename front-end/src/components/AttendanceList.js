import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './AttendanceList.css';
import { EventContext } from '../context/EventContext';

const AttendanceList = () => {
  const { events } = useContext(EventContext);
  const [filter, setFilter] = useState('All');

  // Combine all attendees with their event name
  const allAttendees = events.flatMap(event =>
    event.attendees.map(att => ({
      ...att,
      eventName: event.name
    }))
  );

  const filteredAttendees = allAttendees.filter(att => {
    if (filter === 'All') return true;
    return att.attendance === filter;
  });

  return (
    <div>
      <div className="admin-header">Attendance List</div>
      <div className="admin-layout">
        <div className="admin-sidebar">
          <Link to="/dashboard">Home</Link>
          <Link to="/create">Create Event</Link>
          <Link to="/login">Logout</Link>
        </div>

        <div className="admin-main">
          <div className="header-row">
            <h2 className="section-title">All Attendees</h2>
            <div className="filter-wrapper">
              <label htmlFor="filter">filter ▾</label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-dropdown"
              >
                <option value="All">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
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
              {filteredAttendees.map((att, index) => (
                <tr key={index}>
                  <td>{att.eventName}</td>
                  <td>{att.name}</td>
                  <td>{att.email}</td>
                  <td>{att.attendance}</td>
                  <td>{att.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceList;
