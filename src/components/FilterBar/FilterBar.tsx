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
      <h2>Filter Bar</h2>

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

      <label htmlFor="date">Date:</label>
      <select
        id="dateMode"
        name="dateMode"
        value={dateMode}
        onChange={handleDateModeChange}
      >
        <option value="all">All</option>
        <option value="custom">Specific Date</option>
      </select>

      {dateMode === "custom" && (
        <input
          type="date"
          id="customDate"
          name="customDate"
          value={customDate}
          onChange={handleCustomDateChange}
        />
      )}

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

      <button type="submit">Apply Filters</button>

      <div>Currently selected filters: {JSON.stringify(filters)}</div>
    </form>
  );
};

export default FilterBar;
