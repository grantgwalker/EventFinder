import React, { useState } from 'react';
import './FilterBar.css';

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
        price: "free",
        date: "today",
        category: "gigs",
    });

    // Handle changes to filter inputs
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        // convert date value to match date format
        if (name === "date" && value === "today") {
            const today = new Date();
            // convert to YYYY-MM-DD format
            const formattedDate = today.toISOString().split('T')[0];
            setFilters(prevFilters => ({
                ...prevFilters,
                [name]: formattedDate
            }));
        } else {
            setFilters(prevFilters => ({
                ...prevFilters,
                [name]: value
            }));
        }
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFiltersSubmit(filters);
    }



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
                id="date" 
                name="date" 
                value={filters.date} 
                onChange={handleFilterChange}
            >
                <option value="all">All</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
            </select>

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