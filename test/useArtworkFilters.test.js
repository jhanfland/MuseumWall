import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useArtworkFilters from '../../src/hooks/useArtworkFilters';

// A controlled, mock dataset to test against.
const mockArtworks = [
  { id: 1, title: 'Priest and Boy', artist_title: 'Lawrence Earle', main_reference_number: '1880.1', date_start: 1880, place_of_origin: 'United States' },
  { id: 2, title: 'Interior of St. Mark\'s', artist_title: 'David Neal', main_reference_number: '1887.232', date_start: 1869, place_of_origin: 'Munich' },
  { id: 3, title: 'Self-Portrait', artist_title: 'Walter Shirlaw', main_reference_number: '1887.234', date_start: 1878, place_of_origin: 'United States' },
  { id: 4, title: 'The Fall of the Giants', artist_title: 'Salvator Rosa', main_reference_number: '1887.249', date_start: 1663, place_of_origin: 'Italy' },
];

describe('useArtworkFilters hook', () => {
  it('should filter by an exact reference number', () => {
    const { result } = renderHook(() => useArtworkFilters(mockArtworks));

    act(() => {
      result.current.setReferenceNumberSearchTerm('1887.234');
      result.current.handleSearch();
    });

    expect(result.current.filteredArtworks.length).toBe(1);
    expect(result.current.filteredArtworks[0].title).toBe('Self-Portrait');
  });

  it('should filter by a partial title search (case-insensitive)', () => {
    const { result } = renderHook(() => useArtworkFilters(mockArtworks));

    act(() => {
      result.current.setTitleSearchTerm('int');
      result.current.handleSearch();
    });

    expect(result.current.filteredArtworks.length).toBe(2);
    expect(result.current.filteredArtworks.map(a => a.title)).toEqual(
      expect.arrayContaining(['Priest and Boy', 'Interior of St. Mark\'s'])
    );
  });
  
  it('should filter by artist (case-insensitive)', () => {
    const { result } = renderHook(() => useArtworkFilters(mockArtworks));
      
    act(() => {
        result.current.setArtistFilter('walter shirlaw');
        result.current.handleSearch();
    });

    expect(result.current.filteredArtworks.length).toBe(1);
    expect(result.current.filteredArtworks[0].id).toBe(3);
  });

  it('should filter by a date range', () => {
    const { result } = renderHook(() => useArtworkFilters(mockArtworks));
      
    act(() => {
        result.current.setStartDateFilter('1870');
        result.current.setEndDateFilter('1885');
        result.current.handleSearch();
    });

    expect(result.current.filteredArtworks.length).toBe(2);
    expect(result.current.filteredArtworks.map(a => a.id)).toEqual(expect.arrayContaining([1, 3]));
  });

  it('should combine multiple filters correctly', () => {
    const { result } = renderHook(() => useArtworkFilters(mockArtworks));
      
    act(() => {
        result.current.setPlaceFilter('United States');
        result.current.setStartDateFilter('1879');
        result.current.handleSearch();
    });

    expect(result.current.filteredArtworks.length).toBe(1);
    expect(result.current.filteredArtworks[0].id).toBe(1);
  });

  it('should return no results if no artwork matches the criteria', () => {
    const { result } = renderHook(() => useArtworkFilters(mockArtworks));
      
    act(() => {
        result.current.setArtistFilter('Nonexistent Artist');
        result.current.handleSearch();
    });

    expect(result.current.filteredArtworks.length).toBe(0);
  });

  it('should clear all filters and reset the artworks list', () => {
    const { result } = renderHook(() => useArtworkFilters(mockArtworks));
      
    act(() => {
        result.current.setArtistFilter('Salvator Rosa');
        result.current.handleSearch();
    });

    expect(result.current.filteredArtworks.length).toBe(1);
    expect(result.current.anyAppliedFilterActive).toBe(true);

    act(() => {
        result.current.handleClearFilters();
    });
      
    expect(result.current.filteredArtworks.length).toBe(0);
    expect(result.current.anyAppliedFilterActive).toBe(false);
  });
});