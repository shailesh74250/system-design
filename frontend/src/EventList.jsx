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
      <h2><center>Scheduled Events</center></h2>
      <p><center>List of scheduled events - Only allowed in subscription service</center></p>
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
