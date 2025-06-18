import React, { useState, useEffect, useCallback, useRef } from 'react';

const ITEMS_PER_PAGE = 20;

const ArtworkList = ({ artworks }) => {
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef();
  const loadingRef = useRef();
  // New state to track artworks with successfully loaded images
  const [validArtworks, setValidArtworks] = useState([]);
  // New state to track the ID of the enlarged artwork (null if none)
  const [enlargedId, setEnlargedId] = useState(null);

  // New helper to toggle enlargement
  const toggleEnlarge = (id) => {
    setEnlargedId(prev => (prev === id ? null : id));
  };
  const loadMoreItems = useCallback(() => {
    if (isLoading || displayedItems >= artworks.length) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setDisplayedItems(prev => Math.min(prev + ITEMS_PER_PAGE, artworks.length));
      setIsLoading(false);
    }, 100);
  }, [artworks.length, displayedItems, isLoading]);

  useEffect(() => {
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

  // Modified: Update validArtworks based on the current artworks prop
  useEffect(() => {
    // Initialize all artworks as potentially valid; we'll validate on image load
    setValidArtworks(artworks.map(artwork => ({ ...artwork, imageLoaded: false })));
  }, [artworks]);

  // New helper to handle image load success
  const handleImageLoad = (id) => {
    setValidArtworks(prev =>
      prev.map(art => (art.id === id ? { ...art, imageLoaded: true } : art))
    );
  };

  // New helper to handle image load failure (e.g., invalid image_id or network error)
  const handleImageError = (id) => {
    setValidArtworks(prev =>
      prev.filter(art => art.id !== id) // Remove the artwork if image fails to load
    );
  };

  // Modified: Filter to only show artworks where imageLoaded is true
  const visibleArtworks = validArtworks
    .filter(art => art.imageLoaded)
    .slice(0, displayedItems);

  return (
    <div className="artwork-list-container">
      <div className="artwork-grid">
        {visibleArtworks.map((artwork, index) => (
          <div key={artwork.id || index} className="artwork-card">
            {artwork.image_link ? (
              <img
                src={artwork.image_link}
                alt={artwork.title}
                // Modified: Add class for enlargement, onClick to toggle, and keep onLoad/onError
                className={`artwork-image ${enlargedId === artwork.id ? 'enlarged' : ''}`}
                onClick={() => toggleEnlarge(artwork.id)}
                onLoad={() => handleImageLoad(artwork.id)}
                onError={() => handleImageError(artwork.id)}
                style={{ cursor: 'pointer' }} // Make it clear it's clickable
              />
            ) : (
              <div className="no-image-placeholder">No Image Available</div>
            )}
            // New: Optional close button for enlarged view (only shown when enlarged)
            {enlargedId === artwork.id && (
              <button
                onClick={() => toggleEnlarge(artwork.id)}
                style={{ marginTop: '10px', cursor: 'pointer' }}
              >
                Close
              </button>
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