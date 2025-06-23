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
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('artworkFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('artworkFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (artworkId) => {
    setFavorites(prev => {
      if (prev.includes(artworkId)) {
        return prev.filter(id => id !== artworkId);
      } else {
        return [...prev, artworkId];
      }
    });
  };

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

  // Sort artworks to show favorites first
  const sortArtworksByFavorites = (artworkList) => {
    return [...artworkList].sort((a, b) => {
      const aIsFavorite = favorites.includes(a.id);
      const bIsFavorite = favorites.includes(b.id);
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      return 0;
    });
  };

  const baseArtworks = anyAppliedFilterActive ? filteredArtworks : artworks;
  const displayArtworks = sortArtworksByFavorites(baseArtworks);

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
          <ArtworkList 
            artworks={displayArtworks} 
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </div>
    </div>
  );
}

export default App;