import React from "react";
import "./App.css";
import EventList from "./components/EventList";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>EventFinder</h1>
        <p>Discover amazing events near you</p>
      </header>
      <main>
        <EventList />
      </main>
    </div>
  );
};

export default App;
