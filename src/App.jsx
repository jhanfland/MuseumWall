import React, { useState, useEffect, useRef } from 'react';
import useArtworkData from './hooks/useArtworkData';
import useArtworkFilters from './hooks/useArtworkFilters';
import ArtworkList from './components/artworkList.jsx';
import './App.css';

function App() {
  const { artworks, loading, error } = useArtworkData();
  const [searchTerm, setSearchTerm] = useState('');
  const [artistFilter, setArtistFilter] = useState('');
  const [placeFilter, setPlaceFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  const {
    filteredArtworks,
    handleSearch: applyFilters,
    handleClearFilters: clearAllFilters,
    anyAppliedFilterActive
  } = useArtworkFilters(artworks, loading, error);

  // ... existing code ...
  
  const handleSearch = () => {
    applyFilters({
      searchTerm: searchTerm,
      artist: artistFilter,
      place: placeFilter,
      startDate: startDateFilter,
      endDate: endDateFilter,
    });
  };

  const handleClear = () => {
    clearAllFilters();
    setSearchTerm('');
    setArtistFilter('');
    setPlaceFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  // Determine which artworks to display
  const displayArtworks = anyAppliedFilterActive ? filteredArtworks : artworks;

  return (
    <div className="museum-wall-app">
      <h1>The Museum Wall</h1>

      <div className="filters">
        <input 
          type="text" 
          placeholder="Search by Reference # or Title" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <input type="text" placeholder="Filter by Artist" value={artistFilter} onChange={(e) => setArtistFilter(e.target.value)} />
        <input type="text" placeholder="Filter by Place of Origin" value={placeFilter} onChange={(e) => setPlaceFilter(e.target.value)} />

        <div className="date-filters-group">
          <input type="number" placeholder="Start Date" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} />
          <input type="number" placeholder="End Date" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} />
        </div>

        <div className="action-buttons-group">
          <button onClick={handleSearch}>Search</button>
          <button onClick={handleClear}>Clear Filters</button>
        </div>
      </div>
      
      <div className="results-container">
        {loading && <p className="loading-message">Loading initial artwork data from CSV...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && anyAppliedFilterActive && filteredArtworks.length === 0 && (
          <p className="no-results-message">No artworks found matching this criteria</p>
        )}

        {!loading && !error && displayArtworks.length > 0 && (
          <ArtworkList artworks={displayArtworks} />
        )}
      </div>
    </div>
  );
}

export default App;