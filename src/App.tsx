import "./App.css";
import { FilterBar } from "./components/FilterBar";
import { SearchBar } from "./components/SearchBar";
import type { Filters } from "./components/FilterBar/FilterBar";
import type { SearchParams } from "./components/SearchBar/SearchBar";
import React, { useEffect, useState } from "react";
import { eventService } from "./services/api";
import { Event } from "./types/index";
import EventCard from "./components/EventCard";

const App: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]); // Store all fetched events
  const [loading, setLoading] = useState<boolean>(false); // Start false to allow SearchBar to mount
  const [error, setError] = useState<string | null>(null);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState<boolean>(false); // Track if initial load completed
  const [activeFilters, setActiveFilters] = useState<Filters>({
    price: "all",
    date: "all",
    category: "gigs",
  });

  // Handle search submission - fetches events from API
  const handleSearchSubmit = async (searchParams: SearchParams) => {
    try {
      setLoading(true);
      const queryParams: Record<string, string> = {};

      if (searchParams.category && searchParams.category !== "all") {
        queryParams.category = searchParams.category;
      }

      if (searchParams.date && searchParams.date !== "all") {
        queryParams.date = searchParams.date;
      }

      console.log("Sending query params:", queryParams);
      const data = await eventService.getEvents(queryParams);
      setAllEvents(data); // Store all fetched events
      setEvents(data); // Display all initially

      // Update filter bar to match search criteria
      const newFilters: Filters = {
        price: "all",
        date: searchParams.date,
        category: searchParams.category,
      };
      setActiveFilters(newFilters);
      setError(null);
    } catch (err) {
      setError(
        "Failed to load events. Make sure the server and backend are running.",
      );
      console.error(err);
    } finally {
      setLoading(false);
      setHasInitiallyLoaded(true); // Mark that initial load has completed
    }
  };

  // Handle filter changes - filters already-fetched events on frontend
  const handleFiltersSubmit = (filters: Filters) => {
    console.log("Filters received from FilterBar:", filters);
    setActiveFilters(filters);

    // Filter the allEvents array based on filters
    const filtered = allEvents.filter((event) => {
      const priceMatch =
        filters.price === "all" || event.price == filters.price;
      const dateMatch = filters.date === "all" || event.date == filters.date;
      const categoryMatch =
        filters.category === "all" || event.category == filters.category;

      return priceMatch && dateMatch && categoryMatch;
    });

    setEvents(filtered);
  };

  // Initial load is now handled by SearchBar's useEffect calling handleSearchSubmit
  // No need for separate useEffect here

  return (
    <div className="App">
      <header className="App-header">
        <h1>EventFinder</h1>
        <p>Discover amazing events near you</p>
      </header>
      <main>
        {/* Always render SearchBar - never unmount it to prevent infinite loops */}
        <SearchBar onSearchSubmit={handleSearchSubmit} />

        {/* Always render FilterBar */}
        <FilterBar
          onFiltersSubmit={handleFiltersSubmit}
          initialFilters={activeFilters}
        />

        {/* Show loading state for initial load */}
        {!hasInitiallyLoaded && loading && (
          <div className="loading">Loading events...</div>
        )}

        {/* Show error state for initial load */}
        {!hasInitiallyLoaded && error && <div className="error">{error}</div>}

        {/* Show inline loading after initial load */}
        {hasInitiallyLoaded && loading && (
          <div className="loading-inline">Loading events...</div>
        )}

        {/* Show inline error after initial load */}
        {hasInitiallyLoaded && error && (
          <div className="error-inline">{error}</div>
        )}

        {/* Show event list once we have data or after initial load attempt */}
        {(hasInitiallyLoaded || (!loading && !error)) && (
          <div className="event-list">
            <h2>Upcoming Events</h2>
            {activeFilters && (
              <h3>
                Filters: Price: {activeFilters.price} | Date:{" "}
                {activeFilters.date} | Category: {activeFilters.category}
              </h3>
            )}
            {events.length === 0 ? (
              <p>No events found.</p>
            ) : (
              <div className="events-grid">
                {events.map((event) => (
                  <div key={event.id} className="event-card">
                    <EventCard {...event} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
