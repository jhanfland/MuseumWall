import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useArtworkFilters from '@/hooks/useArtworkFilters';

const mockArtworks = [
  { id: 1, title: 'Priest and Boy', artist_title: 'Lawrence Earle', main_reference_number: '1880.1', date_start: 1880, place_of_origin: 'United States' },
  { id: 2, title: 'Interior of St. Mark\'s, Venice', artist_title: 'David Neal', main_reference_number: '1887.232', date_start: 1869, place_of_origin: 'Germany' },
  { id: 3, title: 'Self-Portrait', artist_title: 'Walter Shirlaw', main_reference_number: '1887.234', date_start: 1878, place_of_origin: 'United States' },
  { id: 4, title: 'The Fall of the Giants', artist_title: 'Salvator Rosa', main_reference_number: '1887.249', date_start: 1663, place_of_origin: 'Italy' },
  { id: 5, title: 'The Cottage Window', artist_title: 'Myles Birket Foster', main_reference_number: '1900.3', date_start: 1885, place_of_origin: 'England' },
  { id: 6, title: 'View of the Roman Campagna', artist_title: 'Jean-Baptiste-Camille Corot', main_reference_number: '1900.12', date_start: 1826, place_of_origin: 'Italy' },
  { id: 7, title: 'The Song of the Lark', artist_title: 'Jules Adolphe Breton', main_reference_number: '1894.1033', date_start: 1884, place_of_origin: 'France' },
  { id: 8, title: 'Arrangement in Grey and Black No. 1', artist_title: 'James McNeill Whistler', main_reference_number: '1894.1034', date_start: 1871, place_of_origin: 'England' },
  { id: 9, title: 'The Herring Net', artist_title: 'Winslow Homer', main_reference_number: '1894.1035', date_start: 1885, place_of_origin: 'United States' },
  { id: 10, title: 'The Child\'s Bath', artist_title: 'Mary Cassatt', main_reference_number: '1910.2', date_start: 1893, place_of_origin: 'France' },
  { id: 11, title: 'A Sunday on La Grande Jatte', artist_title: 'Georges Seurat', main_reference_number: '1926.1934', date_start: 1884, place_of_origin: 'France' },
  { id: 12, title: 'The Bedroom', artist_title: 'Vincent van Gogh', main_reference_number: '1926.1935', date_start: 1889, place_of_origin: 'France' },
  { id: 13, title: 'American Gothic', artist_title: 'Grant Wood', main_reference_number: '1930.934', date_start: 1930, place_of_origin: 'United States' },
  { id: 14, title: 'Nighthawks', artist_title: 'Edward Hopper', main_reference_number: '1942.51', date_start: 1942, place_of_origin: 'United States' },
  { id: 15, title: 'Portrait of a Man', artist_title: 'Rembrandt van Rijn', main_reference_number: '1950.1', date_start: 1655, place_of_origin: 'Netherlands' },
];
describe('useArtworkFilters hook', () => {
  const renderFilterHook = () => {
    return renderHook(() => useArtworkFilters(mockArtworks, false, null));
  };

  it('should return an empty array initially', () => {
    const { result } = renderFilterHook();
    expect(result.current.filteredArtworks).toEqual([]);
    expect(result.current.anyAppliedFilterActive).toBe(false);
  });

  it('should filter by an exact reference number', () => {
    const { result } = renderFilterHook();

    act(() => {
      result.current.handleSearch({ searchTerm: '1926.1934' });
    });

    expect(result.current.filteredArtworks.length).toBe(1);
    expect(result.current.filteredArtworks[0].title).toBe('A Sunday on La Grande Jatte');
  });

  it('should filter by a partial title search', () => {
    const { result } = renderFilterHook();

    act(() => {
      result.current.handleSearch({ searchTerm: 'the' });
    });

    expect(result.current.filteredArtworks.length).toBe(7);
    expect(result.current.filteredArtworks.map(a => a.id)).toEqual(
      expect.arrayContaining([4, 5, 6, 7, 9, 10, 12])
    );
  });

  it('should filter by artist', () => {
    const { result } = renderFilterHook();

    act(() => {
      result.current.handleSearch({ artist: 'rembrandt' });
    });

    expect(result.current.filteredArtworks.length).toBe(1);
    expect(result.current.filteredArtworks[0].id).toBe(15);
  });

  it('should filter by place of origin', () => {
    const { result } = renderFilterHook();

    act(() => {
      result.current.handleSearch({ place: 'Italy' });
    });

    expect(result.current.filteredArtworks.length).toBe(2);
    expect(result.current.filteredArtworks.map(a => a.id)).toEqual(expect.arrayContaining([4, 6]));
  });

  it('should filter by a date range', () => {
    const { result } = renderFilterHook();

    act(() => {
      result.current.handleSearch({ startDate: '1885', endDate: '1895' });
    });

    expect(result.current.filteredArtworks.length).toBe(4);
    expect(result.current.filteredArtworks.map(a => a.id)).toEqual(expect.arrayContaining([5, 9, 10, 12]));
  });

  it('should filter by only a start date', () => {
    const { result } = renderFilterHook();

    act(() => {
      result.current.handleSearch({ startDate: '1930' });
    });

    expect(result.current.filteredArtworks.length).toBe(2);
    expect(result.current.filteredArtworks.map(a => a.id)).toEqual(expect.arrayContaining([13, 14]));
  });

  it('should combine multiple filters correctly', () => {
    const { result } = renderFilterHook();

    act(() => {
      result.current.handleSearch({ place: 'United States', startDate: '1880', endDate: '1900' });
    });

    expect(result.current.filteredArtworks.length).toBe(2);
    expect(result.current.filteredArtworks.map(a => a.id)).toEqual(expect.arrayContaining([1, 9]));
  });

  it('should return no results if no artwork matches the criteria', () => {
    const { result } = renderFilterHook();

    act(() => {
      result.current.handleSearch({ artist: 'Da Vinci', place: 'Spain' });
    });

    expect(result.current.filteredArtworks.length).toBe(0);
  });

  it('should clear all filters and reset the artworks list', () => {
    const { result } = renderFilterHook();

    act(() => {
      result.current.handleSearch({ artist: 'Edward Hopper' });
    });

    expect(result.current.filteredArtworks.length).toBe(1);
    expect(result.current.anyAppliedFilterActive).toBe(true);

    act(() => {
      result.current.handleClearFilters();
    });

    expect(result.current.filteredArtworks.length).toBe(0);
    expect(result.current.anyAppliedFilterActive).toBe(false);
  });
   it('should combine multiple filters correctly with the new searchTerm', () => {
    const { result } = renderFilterHook();

    act(() => {
      result.current.handleSearch({ searchTerm: 'Herring', place: 'United States' });
    });

    expect(result.current.filteredArtworks.length).toBe(1);
    expect(result.current.filteredArtworks[0].id).toBe(9);
  });
   it('should reject an almost complete reference number into searchTerm', () => {
    const { result } = renderFilterHook();

    act(() => {
      result.current.handleSearch({ searchTerm: '1887.23'});
    });

    expect(result.current.filteredArtworks.length).toBe(0);
  });
    it('should reject a search combining name and search number', () => {
    const { result } = renderFilterHook();

    act(() => {
      result.current.handleSearch({ searchTerm: 'Priest and Boy 1880.1'});
    });

    expect(result.current.filteredArtworks.length).toBe(0);
  });
});