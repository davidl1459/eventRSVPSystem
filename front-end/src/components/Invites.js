import React, { useContext, useState } from 'react';
import jwtEncode from 'jwt-encode';
import Papa from 'papaparse';
import { EventContext } from '../context/EventContext';
import './Invites.css';

const SECRET_KEY = 'test-secret'; // For development only
const BASE_URL = window.location.origin;

const Invites = () => {
  const { events } = useContext(EventContext);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [copiedName, setCopiedName] = useState('');
  const [inviteLinks, setInviteLinks] = useState({});
  const [guests, setGuests] = useState([]);

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data.map(row => ({
          name: row.name,
          gender: row.gender,
          status: row.status,
        }));
        setGuests(data);
        setInviteLinks({});
      },
      error: (err) => console.error('CSV Parse Error:', err)
    });
  };

  const generateLinks = () => {
    if (!selectedEventId) return;
    const links = {};

    guests.forEach(guest => {
      const payload = {
        eventId: parseInt(selectedEventId),
        name: guest.name,
        gender: guest.gender,
        status: guest.status
      };
      const token = jwtEncode(payload, SECRET_KEY);
      const link = `${BASE_URL}/rsvp?token=${token}`;
      links[guest.name] = link;
    });

    setInviteLinks(links);
  };

  return (
    <div>
      <div className="admin-header">Guest Invitations</div>
      <div className="admin-layout">
        <div className="admin-sidebar">
          <a href="/dashboard">Home</a>
          <a href="/create">Create Event</a>
          <a href="/invite">Invite Guests</a>
          <a href="/login">Logout</a>
        </div>

        <div className="admin-main">
          <h2 className="section-title">Select Event</h2>
          <select
            className="filter-dropdown"
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(e.target.value);
              setInviteLinks({});
            }}
          >
            <option value="">-- Choose Event --</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>{event.name}</option>
            ))}
          </select>

          <h3 className="section-subtitle" style={{ marginTop: '20px' }}>
            Upload Guest List (CSV)
          </h3>
          <input type="file" accept=".csv" onChange={handleCSVUpload} />

          {guests.length > 0 && selectedEventId && (
            <>
              <button className="create-btn" onClick={generateLinks} style={{ marginTop: '20px' }}>
                Generate RSVP Links
              </button>

              <h3 className="section-subtitle" style={{ marginTop: '30px' }}>
                Guests for Selected Event
              </h3>

              <table className="event-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Status</th>
                    <th>RSVP Link</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((guest, index) => (
                    <tr key={index}>
                      <td>{guest.name}</td>
                      <td>{guest.gender}</td>
                      <td>{guest.status}</td>
                      <td>
                        <div className="copy-link-row">
                          <input
                            type="text"
                            value={inviteLinks[guest.name] || ''}
                            readOnly
                            style={{ flex: 1 }}
                          />
                          <button
                            className="copy-btn"
                            onClick={() => {
                              navigator.clipboard.writeText(inviteLinks[guest.name]);
                              setCopiedName(guest.name);
                              setTimeout(() => setCopiedName(''), 1500);
                            }}
                          >
                            📋
                          </button>
                          {copiedName === guest.name && (
                            <span className="copy-success">Copied!</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invites;
