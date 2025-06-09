import { useState, useEffect } from 'react';

const useArtworkFilters = (artworks, loading, error) => {
  const [filteredArtworks, setFilteredArtworks] = useState([]);

  const [referenceNumberSearchTerm, setReferenceNumberSearchTerm] = useState('');
  const [titleSearchTerm, setTitleSearchTerm] = useState('');
  const [artistFilter, setArtistFilter] = useState('');
  const [placeFilter, setPlaceFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  const [appliedReferenceNumberSearchTerm, setAppliedReferenceNumberSearchTerm] = useState('');
  const [appliedTitleSearchTerm, setAppliedTitleSearchTerm] = useState('');
  const [appliedArtistFilter, setAppliedArtistFilter] = useState('');
  const [appliedPlaceFilter, setAppliedPlaceFilter] = useState('');
  const [appliedStartDateFilter, setAppliedStartDateFilter] = useState('');
  const [appliedEndDateFilter, setAppliedEndDateFilter] = useState('');

  const handleSearch = () => {
    setAppliedReferenceNumberSearchTerm(referenceNumberSearchTerm);
    setAppliedTitleSearchTerm(titleSearchTerm);
    setAppliedArtistFilter(artistFilter);
    setAppliedPlaceFilter(placeFilter);
    setAppliedStartDateFilter(startDateFilter);
    setAppliedEndDateFilter(endDateFilter);
  };

  const handleClearFilters = () => {
    setReferenceNumberSearchTerm('');
    setTitleSearchTerm('');
    setArtistFilter('');
    setPlaceFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
    setAppliedReferenceNumberSearchTerm('');
    setAppliedTitleSearchTerm('');
    setAppliedArtistFilter('');
    setAppliedPlaceFilter('');
    setAppliedStartDateFilter('');
    setAppliedEndDateFilter('');
  };

  useEffect(() => {
    if (loading || error) {
      setFilteredArtworks([]);
      return;
    }

    const anyAppliedFilterActive =
      appliedReferenceNumberSearchTerm || appliedTitleSearchTerm ||
      appliedArtistFilter || appliedPlaceFilter || appliedStartDateFilter || appliedEndDateFilter;

    if (!anyAppliedFilterActive) {
      setFilteredArtworks([]);
      return;
    }

    let currentFiltered = artworks;

    if (appliedReferenceNumberSearchTerm) {
      const lowerCaseSearchTerm = appliedReferenceNumberSearchTerm.trim().toLowerCase();
      currentFiltered = currentFiltered.filter(artwork =>
        artwork.main_reference_number?.trim().toLowerCase() === lowerCaseSearchTerm
      );
    }
    if (appliedTitleSearchTerm) {
      const lowerCaseSearchTerm = appliedTitleSearchTerm.trim().toLowerCase();
      currentFiltered = currentFiltered.filter(artwork =>
        artwork.title?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    if (appliedArtistFilter) {
      const lowerCaseArtistFilter = appliedArtistFilter.trim().toLowerCase();
      currentFiltered = currentFiltered.filter(artwork =>
        artwork.artist_title?.toLowerCase().includes(lowerCaseArtistFilter)
      );
    }
    if (appliedPlaceFilter) {
      const lowerCasePlaceFilter = appliedPlaceFilter.trim().toLowerCase();
      currentFiltered = currentFiltered.filter(artwork =>
        artwork.place_of_origin?.toLowerCase().includes(lowerCasePlaceFilter)
      );
    }
    if (appliedStartDateFilter) {
      currentFiltered = currentFiltered.filter(artwork =>
        artwork.date_start && artwork.date_start >= parseInt(appliedStartDateFilter, 10)
      );
    }
    if (appliedEndDateFilter) {
      currentFiltered = currentFiltered.filter(artwork =>
        artwork.date_start && artwork.date_start <= parseInt(appliedEndDateFilter, 10)
      );
    }

    setFilteredArtworks(currentFiltered);
  }, [
    appliedReferenceNumberSearchTerm, appliedTitleSearchTerm,
    appliedArtistFilter, appliedPlaceFilter,
    appliedStartDateFilter, appliedEndDateFilter,
    artworks, loading, error
  ]);

  return {
    filteredArtworks,
    referenceNumberSearchTerm, setReferenceNumberSearchTerm,
    titleSearchTerm, setTitleSearchTerm,
    artistFilter, setArtistFilter,
    placeFilter, setPlaceFilter,
    startDateFilter, setStartDateFilter,
    endDateFilter, setEndDateFilter,
    handleSearch, handleClearFilters,
    anyAppliedFilterActive:
      appliedReferenceNumberSearchTerm || appliedTitleSearchTerm ||
      appliedArtistFilter || appliedPlaceFilter || appliedStartDateFilter || appliedEndDateFilter
  };
};

export default useArtworkFilters;