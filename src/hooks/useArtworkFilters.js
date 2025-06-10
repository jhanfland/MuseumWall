import { useState, useMemo } from 'react';

const useArtworkFilters = (artworks, loading, error) => {
  const [appliedFilters, setAppliedFilters] = useState(null);

  const handleSearch = (filtersToApply) => {
    setAppliedFilters(filtersToApply);
  };

  const handleClearFilters = () => {
    setAppliedFilters(null);
  };


  const filteredArtworks = useMemo(() => {
    if (loading || error || !appliedFilters) {
      return [];
    }

    const { searchTerm, artist, place, startDate, endDate } = appliedFilters;
    return artworks.filter(artwork => {

      const searchMatch = !searchTerm || 
        artwork.main_reference_number?.trim().toLowerCase() === searchTerm.trim().toLowerCase() ||
        artwork.title?.toLowerCase().includes(searchTerm.trim().toLowerCase());
      const artistMatch = !artist || artwork.artist_title?.toLowerCase().includes(artist.trim().toLowerCase());
      const placeMatch = !place || artwork.place_of_origin?.toLowerCase().includes(place.trim().toLowerCase());
      const startDateMatch = !startDate || (artwork.date_start && artwork.date_start >= parseInt(startDate, 10));
      const endDateMatch = !endDate || (artwork.date_start && artwork.date_start <= parseInt(endDate, 10));
      
      return searchMatch && artistMatch && placeMatch && startDateMatch && endDateMatch;
    });
  }, [artworks, appliedFilters, loading, error]);

  const anyAppliedFilterActive = !!appliedFilters;

  return {
    filteredArtworks,
    handleSearch,
    handleClearFilters,
    anyAppliedFilterActive
  };
};

export default useArtworkFilters;