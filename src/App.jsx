import React, { useState, useEffect, useRef } from 'react';
import useArtworkData from './hooks/useArtworkData';
import useArtworkFilters from './hooks/useArtworkFilters';
import ArtworkList from './components/artworkList.jsx';
import './App.css';

function App() {
  const { artworks, loading, error } = useArtworkData();
  const [referenceNumberSearchTerm, setReferenceNumberSearchTerm] = useState('');
  const [titleSearchTerm, setTitleSearchTerm] = useState('');
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

  const resultsContainerRef = useRef(null);
  const [listDimensions, setListDimensions] = useState({ width: 0, height: 0 });
  
  const handleSearch = () => {
    applyFilters({
      referenceNumber: referenceNumberSearchTerm,
      title: titleSearchTerm,
      artist: artistFilter,
      place: placeFilter,
      startDate: startDateFilter,
      endDate: endDateFilter,
    });
  };

  const handleClear = () => {
    clearAllFilters();
    setReferenceNumberSearchTerm('');
    setTitleSearchTerm('');
    setArtistFilter('');
    setPlaceFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  useEffect(() => {
    const calculateSize = () => {
      if (resultsContainerRef.current) {
        const { top } = resultsContainerRef.current.getBoundingClientRect();
        const height = window.innerHeight - top - 20;
        const width = resultsContainerRef.current.clientWidth;
        setListDimensions({ width, height: height > 0 ? height : 0 });
      }
    };

    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, []);

  return (
    <div className="museum-wall-app">
      <h1>The Museum Wall</h1>

      <div className="filters">
        <input type="text" placeholder="Search by Reference #" value={referenceNumberSearchTerm} onChange={(e) => setReferenceNumberSearchTerm(e.target.value)} />
        <input type="text" placeholder="Search by Title" value={titleSearchTerm} onChange={(e) => setTitleSearchTerm(e.target.value)} />
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
      
      <div className="results-container" ref={resultsContainerRef}>
        {loading && <p className="loading-message">Loading initial artwork data from CSV...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && !anyAppliedFilterActive && (
          <p className="no-results-message">Enter a search or filter to see artworks</p>
        )}

        {!loading && !error && anyAppliedFilterActive && filteredArtworks.length === 0 && (
          <p className="no-results-message">No artworks found matching this criteria</p>
        )}

        {!loading && !error && filteredArtworks.length > 0 && (
          <ArtworkList
            artworks={filteredArtworks}
            listHeight={listDimensions.height}
            getContainerWidth={() => listDimensions.width}
          />
        )}
      </div>
    </div>
  );
}

export default App;