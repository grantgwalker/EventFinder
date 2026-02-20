import React from "react";
import "./App.css";
import EventList from "./components/EventList";
import { FilterBar } from "./components/FilterBar";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>EventFinder</h1>
        <p>Discover amazing events near you</p>
      </header>
      <main>
        {/* Filter Bar to get user input and fetch filtered events. FilterBar component passes events to list */}
        <FilterBar />
        {/* Of the fetched filtered events, We have an event List, list is responsible for displaying them */}
        {/* The Event List is comprised of Event Cards, rendering and the design of each */}
        <EventList />
      </main>
    </div>
  );
};

export default App;
