import React, { useState } from "react";
import "./FilterBar.css";

export interface Filters {
  price: string;
  date: string;
  category: string;
}

interface FilterBarProps {
  onFiltersSubmit: (filters: Filters) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFiltersSubmit }) => {
  // Use state to manage filters
  const [filters, setFilters] = useState<Filters>({
    price: "0",
    date: "all",
    category: "gigs",
  });

  // State to track if using custom date
  const [dateMode, setDateMode] = useState<"all" | "custom">("all");
  const [customDate, setCustomDate] = useState<string>("");

  // Handle changes to filter inputs
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Handle date mode change
  const handleDateModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mode = e.target.value as "all" | "custom";
    setDateMode(mode);
    if (mode === "all") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        date: "all",
      }));
      setCustomDate("");
    } else {
      // Set to current custom date or empty
      setFilters((prevFilters) => ({
        ...prevFilters,
        date: customDate,
      }));
    }
  };

  // Handle custom date input change
  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setCustomDate(selectedDate);
    setFilters((prevFilters) => ({
      ...prevFilters,
      date: selectedDate,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersSubmit(filters);
  };

  return (
    <form className="filter-bar" onSubmit={handleSubmit}>
      <h2>Filter Events</h2>

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="price">Price:</label>
          <select
            id="price"
            name="price"
            value={filters.price}
            onChange={handleFilterChange}
          >
            <option value="all">All</option>
            <option value="0">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div className="filter-group date-filter">
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
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      date: "all",
                    }));
                    setCustomDate("");
                  } else {
                    setFilters((prevFilters) => ({
                      ...prevFilters,
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

        <div className="filter-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="all">All</option>
            <option value="gigs">Gigs & Comedy</option>
            <option value="sports">Concerts</option>
            <option value="arts">Nightlife</option>
            <option value="family">Exhibitions</option>
          </select>
        </div>

        <button type="submit" className="apply-button">
          Apply Filters
        </button>
      </div>
    </form>
  );
};

export default FilterBar;
