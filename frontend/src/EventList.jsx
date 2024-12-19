import React, { useEffect, useState } from 'react';

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/api/schedule-events')
      .then((res) => res.json())
      .then((data) => setEvents(data.collection || []))
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  return (
    <div>
      <h2>Scheduled Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.uri}>
            {event.name} on {new Date(event.start_time).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
