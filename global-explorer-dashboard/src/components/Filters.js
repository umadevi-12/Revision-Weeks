import React, { useState } from 'react';

const Filters = ({ onSearch, onFilter, onSort }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [sortBy, setSortBy] = useState('');

  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleRegionChange = (e) => {
    const value = e.target.value;
    setSelectedRegion(value);
    onFilter(value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    onSort(value);
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <input
          type="text"
          placeholder="Search by country or capital..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <select 
          value={selectedRegion} 
          onChange={handleRegionChange}
          className="filter-select"
        >
          <option value="">All Regions</option>
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <select 
          value={sortBy} 
          onChange={handleSortChange}
          className="filter-select"
        >
          <option value="">Sort by</option>
          <option value="name">Name</option>
          <option value="population">Population</option>
          <option value="area">Area</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;