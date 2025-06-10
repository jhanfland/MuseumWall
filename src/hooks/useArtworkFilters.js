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

    const { referenceNumber, title, artist, place, startDate, endDate } = appliedFilters;
    return artworks.filter(artwork => {

      const referenceMatch = !referenceNumber || artwork.main_reference_number?.trim().toLowerCase() === referenceNumber.trim().toLowerCase();
      const titleMatch = !title || artwork.title?.toLowerCase().includes(title.trim().toLowerCase());
      const artistMatch = !artist || artwork.artist_title?.toLowerCase().includes(artist.trim().toLowerCase());
      const placeMatch = !place || artwork.place_of_origin?.toLowerCase().includes(place.trim().toLowerCase());
      const startDateMatch = !startDate || (artwork.date_start && artwork.date_start >= parseInt(startDate, 10));
      const endDateMatch = !endDate || (artwork.date_start && artwork.date_start <= parseInt(endDate, 10));
      
      return referenceMatch && titleMatch && artistMatch && placeMatch && startDateMatch && endDateMatch;
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