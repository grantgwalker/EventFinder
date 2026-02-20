import { Event } from "../../types/index";
import "./EventCard.css";

const EventCard: React.FC<Event> = (event) => {
  // Take in event data as props and render the card
  return (
    <div key={event.id} className="event-card">
      <h3>{event.name}</h3>
      <div className="event-info">
        <p className="event-date">
          {/* Convert date to Wed., Feb., YYYY format */}
          {new Date(event.date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          {event.time && <span className="event-time"> • {event.time}</span>}
        </p>
        {event.price && event.price === "0" && (
          <p className="event-price">💰 Free</p>
        )}
        {event.price && event.price !== "0" && (
          <p className="event-price">💰 {event.price}</p>
        )}
        <p className="event-location">📍 {event.location}</p>
      </div>
      {event.description && (
        <p className="event-description">{event.description}</p>
      )}
      {event.url && (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="event-link"
        >
          View Details →
        </a>
      )}
    </div>
  );
};

export default EventCard;
