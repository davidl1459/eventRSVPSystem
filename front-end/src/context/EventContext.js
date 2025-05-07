import React, { createContext, useState, useEffect } from 'react';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem('events');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const addEvent = (newEvent) => {
    const eventWithId = { ...newEvent, id: Date.now(), attendees: [] };
    setEvents(prev => [...prev, eventWithId]);
  };

  const addAttendee = (eventId, attendee) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === parseInt(eventId)
          ? { ...event, attendees: [...event.attendees, attendee] }
          : event
      )
    );
  };

  return (
    <EventContext.Provider value={{ events, addEvent, addAttendee }}>
      {children}
    </EventContext.Provider>
  );
};
