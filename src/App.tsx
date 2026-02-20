import "./App.css";
import { FilterBar } from "./components/FilterBar";
import type { Filters } from "./components/FilterBar/FilterBar";
import React, { useEffect, useState } from "react";
import { eventService } from "./services/api";
import { Event } from "./types/index";
import EventCard from "./components/EventCard";

const App: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Filters | null>(null);

  // Handle filter submission from FilterBar
  const handleFiltersSubmit = (filters: Filters) => {
    console.log("Filters received from FilterBar:", filters);
    setActiveFilters(filters);
    // Here you can:
    // 1. Filter the existing events array
    // 2. Or fetch new events from API with these filters
    // Example: fetchEvents(filters);
  };

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
    <div className="App">
      <header className="App-header">
        <h1>EventFinder</h1>
        <p>Discover amazing events near you</p>
      </header>
      <main>
        {/* Filter Bar to get user input and fetch filter criteria. FilterBar component passes events to list */}
        <FilterBar onFiltersSubmit={handleFiltersSubmit} />
        {/* Of the fetched filtered events, We have an event List, list is responsible for displaying them */}
        {/* The Event List is comprised of Event Cards, rendering and the design of each */}
        <div className="event-list">
          <h2>Upcoming Events for:</h2>
          <h3>
            Price: {activeFilters?.price} | Date: {activeFilters?.date} |
            Category: {activeFilters?.category}
          </h3>
          {events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <div className="events-grid">
              {events.map(
                (event) =>
                  // if event matches activeFilters show event
                  (!activeFilters ||
                    ((activeFilters.price === "all" ||
                      event.price == activeFilters.price) &&
                      (activeFilters.date === "all" ||
                        event.date == activeFilters.date) &&
                      (activeFilters.category === "all" ||
                        event.category == activeFilters.category))) && (
                    <div key={event.id} className="event-card">
                      <EventCard {...event} />
                    </div>
                  ),
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
