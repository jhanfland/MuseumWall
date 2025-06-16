import React, { useState, useEffect, useCallback, useRef } from 'react';

const ITEMS_PER_PAGE = 20;

const ArtworkList = ({ artworks }) => {
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef();
  const loadingRef = useRef();

  const loadMoreItems = useCallback(() => {
    if (isLoading || displayedItems >= artworks.length) return;
    
    setIsLoading(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setDisplayedItems(prev => Math.min(prev + ITEMS_PER_PAGE, artworks.length));
      setIsLoading(false);
    }, 100);
  }, [artworks.length, displayedItems, isLoading]);

  useEffect(() => {
    // Reset displayed items when artworks change
    setDisplayedItems(ITEMS_PER_PAGE);
  }, [artworks]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreItems]);

  const visibleArtworks = artworks.slice(0, displayedItems);

  return (
    <div className="artwork-list-container">
      <div className="artwork-grid">
        {visibleArtworks.map((artwork, index) => (
          <div key={artwork.id || index} className="artwork-card">
            {artwork.image_link ? (
              <img src={artwork.image_link} alt={artwork.title} className="artwork-image" />
            ) : (
              <div className="no-image-placeholder">No Image Available</div>
            )}
            <h3>{artwork.title}</h3>
            <p><strong>Artist:</strong> {artwork.artist_title || 'N/A'}</p>
            <p><strong>Origin:</strong> {artwork.place_of_origin || 'N/A'}</p>
            <p><strong>Date:</strong> {artwork.date_start || 'N/A'}</p>
          </div>
        ))}
      </div>
      
      {displayedItems < artworks.length && (
        <div ref={loadingRef} className="loading-trigger">
          {isLoading && <p className="loading-message">Loading more artworks...</p>}
        </div>
      )}
    </div>
  );
};

export default ArtworkList;