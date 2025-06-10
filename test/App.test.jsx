import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import App from '@/App';
import useArtworkData from '@/hooks/useArtworkData';

vi.mock('@/hooks/useArtworkData');

const mockArtworks = [
  { id: 1, title: 'Priest and Boy', artist_title: 'Lawrence Earle', main_reference_number: '1880.1', date_start: 1880, place_of_origin: 'United States' },
  { id: 2, title: 'Interior of St. Mark\'s', artist_title: 'David Neal', main_reference_number: '1887.232', date_start: 1869, place_of_origin: 'Munich' },
  { id: 3, title: 'Self-Portrait', artist_title: 'Walter Shirlaw', main_reference_number: '1887.234', date_start: 1878, place_of_origin: 'United States' },
];

describe('App Component', () => {
  it('should display a loading message while fetching data', () => {
    useArtworkData.mockReturnValue({
      artworks: [],
      loading: true,
      error: null,
    });

    render(<App />);
    expect(screen.getByText(/loading initial artwork data/i)).toBeInTheDocument();
  });

  it('should display an error message if data fetching fails', () => {
    useArtworkData.mockReturnValue({
      artworks: [],
      loading: false,
      error: 'Failed to fetch artworks',
    });

    render(<App />);
    expect(screen.getByText(/failed to fetch artworks/i)).toBeInTheDocument();
  });

  it('should display the initial message when data is loaded but no filters are applied', () => {
    useArtworkData.mockReturnValue({
      artworks: mockArtworks,
      loading: false,
      error: null,
    });
      
    render(<App />);
    expect(screen.getByText(/enter a search or filter to see artworks/i)).toBeInTheDocument();
  });

  it('should allow a user to search by artist and display filtered results', async () => {
    const user = userEvent.setup();
    useArtworkData.mockReturnValue({
      artworks: mockArtworks,
      loading: false,
      error: null,
    });
    
    render(<App />);

    const artistInput = screen.getByPlaceholderText(/filter by artist/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.type(artistInput, 'David Neal');
    await user.click(searchButton);

    expect(screen.getByText("Interior of St. Mark's")).toBeInTheDocument();
    expect(screen.queryByText('Priest and Boy')).not.toBeInTheDocument();
    expect(screen.queryByText('Self-Portrait')).not.toBeInTheDocument();
  });

  it('should display a "no results" message if a search yields no matches', async () => {
    const user = userEvent.setup();
    useArtworkData.mockReturnValue({
      artworks: mockArtworks,
      loading: false,
      error: null,
    });
      
    render(<App />);
      
    const titleInput = screen.getByPlaceholderText(/search by title/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.type(titleInput, 'Monet');
    await user.click(searchButton);

    expect(screen.getByText(/no artworks found matching this criteria/i)).toBeInTheDocument();
  });
});