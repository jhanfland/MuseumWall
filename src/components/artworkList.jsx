import React, { useState, useEffect, useCallback, useRef } from 'react';
import ArtworkCard from './artworkCard';

const ITEMS_PER_PAGE = 20;

const ArtworkList = ({ artworks, favorites, toggleFavorite }) => {  // Updated: Added favorites and toggleFavorite props
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [enlargedArtwork, setEnlargedArtwork] = useState(null);
  const observerRef = useRef();
  const loadingRef = useRef();

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
    setEnlargedArtwork(null);
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

  const handleArtworkClick = (artwork) => {
    setEnlargedArtwork(artwork);
  };


  // Updated: Sort artworks to prioritize favorites before slicing
  const sortedArtworks = [...artworks].sort((a, b) => {
    const aIsFavorite = favorites.includes(a.id);
    const bIsFavorite = favorites.includes(b.id);
    return bIsFavorite - aIsFavorite;  // Favorites first (true > false in sort)
  });
  const visibleArtworks = sortedArtworks.slice(0, displayedItems);
  // Updated: Modal handling with backdrop and click-outside-to-close
  const handleCloseEnlarged = (e) => {
    if (e.target === e.currentTarget) {  // Close only if clicking outside content
      setEnlargedArtwork(null);
    }
  };

  return (
    <div className="artwork-list-container">
      {enlargedArtwork && (
        <div className="modal-backdrop" onClick={handleCloseEnlarged}>  // New: Backdrop for modal
          <div className="enlarged-artwork-container" onClick={(e) => e.stopPropagation()}>  // Updated: Prevent close on content click
            <div className="enlarged-artwork-header">
              <h2>Enlarged View</h2>
              <button onClick={() => setEnlargedArtwork(null)} className="close-enlarged-btn">
                ✕ Close
              </button>
            </div>
          <div className="enlarged-artwork-content">
            <img 
              src={enlargedArtwork.image_link} 
              alt={enlargedArtwork.title} 
              className="enlarged-artwork-image" 
            />
            <div className="enlarged-artwork-details">
              <h3>{enlargedArtwork.title}</h3>
              <p><strong>Artist:</strong> {enlargedArtwork.artist_title || 'N/A'}</p>
              <p><strong>Origin:</strong> {enlargedArtwork.place_of_origin || 'N/A'}</p>
              <p><strong>Date:</strong> {enlargedArtwork.date_start || 'N/A'}</p>
              <p><strong>Reference #:</strong> {enlargedArtwork.main_reference_number}</p>
            </div>
          </div>
        </div>
      )}
      <div className="artwork-grid">
        {visibleArtworks.map((artwork, index) => (
          <ArtworkCard
            key={artwork.id || index}
            artwork={artwork}
            onClick={() => handleArtworkClick(artwork)}
            favorites={favorites}  // New: Pass to ArtworkCard
            toggleFavorite={toggleFavorite}  // New: Pass to ArtworkCard
          />
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