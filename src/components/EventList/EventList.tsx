import React, { useEffect, useState } from "react";
import { eventService } from "../../services/api";
import { Event } from "../../types";
import "./EventList.css";

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getEvents();
        setEvents(data);
        setError(null);
      } catch (err) {
        setError(
          "Failed to load events. Make sure the server and backend are running.",
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="event-list">
      <h2>Upcoming Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.name}</h3>
              <p className="event-date">{event.date}</p>
              <p className="event-location">{event.location}</p>
              {event.description && (
                <p className="event-description">{event.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
