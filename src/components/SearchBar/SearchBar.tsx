import React, { useState, useEffect } from "react";
import "./SearchBar.css";

export interface SearchParams {
  category: string;
  date: string;
}

interface SearchBarProps {
  onSearchSubmit: (params: SearchParams) => void;
}

const SEARCH_STORAGE_KEY = "eventfinder_search_params";

const SearchBar: React.FC<SearchBarProps> = ({ onSearchSubmit }) => {
  // Load from localStorage or use defaults
  const loadSearchParams = (): SearchParams => {
    const saved = localStorage.getItem(SEARCH_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved search params", e);
      }
    }
    return { category: "gigs", date: "all" };
  };

  // Use state to manage search parameters
  const [searchParams, setSearchParams] =
    useState<SearchParams>(loadSearchParams());

  // State to track if using custom date
  const [dateMode, setDateMode] = useState<"all" | "custom">("all");
  const [customDate, setCustomDate] = useState<string>("");

  // Handle changes to search inputs
  const handleSearchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  // Handle custom date input change
  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setCustomDate(selectedDate);
    setSearchParams((prevParams) => ({
      ...prevParams,
      date: selectedDate,
    }));
  };

  // Load persisted search on mount
  useEffect(() => {
    const params = loadSearchParams();
    setSearchParams(params);
    if (params.date !== "all") {
      setDateMode("custom");
      setCustomDate(params.date);
    }
    // Trigger search with persisted params on mount
    onSearchSubmit(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to localStorage
    localStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(searchParams));
    onSearchSubmit(searchParams);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <h2>Search Events</h2>

      <div className="search-container">
        <div>
          <label htmlFor="category">Price:</label>
          <span>All</span>
        </div>

        <div className="search-group date-search">
          <label htmlFor="date">Date:</label>
          <div className="date-controls">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={dateMode === "custom"}
                onChange={(e) => {
                  const mode = e.target.checked ? "custom" : "all";
                  setDateMode(mode);
                  if (mode === "all") {
                    setSearchParams((prevParams) => ({
                      ...prevParams,
                      date: "all",
                    }));
                    setCustomDate("");
                  } else {
                    setSearchParams((prevParams) => ({
                      ...prevParams,
                      date: customDate,
                    }));
                  }
                }}
              />
              <span className="toggle-text">Specific Date</span>
            </label>
            {dateMode === "custom" && (
              <input
                type="date"
                id="customDate"
                name="customDate"
                value={customDate}
                onChange={handleCustomDateChange}
                className="date-input"
              />
            )}
          </div>
        </div>
        <div className="search-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={searchParams.category}
            onChange={handleSearchChange}
          >
            <option value="all">All</option>
            <option value="gigs">Gigs & Comedy</option>
            <option value="concerts">Concerts</option>
            <option value="nightlife">Nightlife</option>
            <option value="exhibitions">Exhibitions</option>
          </select>
        </div>
        <button type="submit" className="search-button">
          Search Events
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
