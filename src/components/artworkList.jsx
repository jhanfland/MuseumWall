import React, { useState, useEffect, useCallback, useRef } from 'react';
import ArtworkCard from './artworkCard';

const ITEMS_PER_PAGE = 20;

const ArtworkList = ({ artworks, favorites, onToggleFavorite }) => {
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

  const handleCloseEnlarged = () => {
    setEnlargedArtwork(null);
  };

  const downloadImage = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'artwork.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const visibleArtworks = artworks.slice(0, displayedItems);

  return (
    <div className="artwork-list-container">
      {enlargedArtwork && (
        <div className="enlarged-artwork-overlay" onClick={handleCloseEnlarged}>
          <div className="enlarged-artwork-modal" onClick={(e) => e.stopPropagation()}>
            <div className="enlarged-artwork-header">
              <h2>Enlarged View</h2>
              <div className="enlarged-artwork-actions">
                <button 
                  onClick={() => onToggleFavorite(enlargedArtwork.id)}
                  className={`favorite-btn ${favorites.includes(enlargedArtwork.id) ? 'favorited' : ''}`}
                >
                  {favorites.includes(enlargedArtwork.id) ? '❤️' : '🤍'}
                </button>
                <button 
                  onClick={() => downloadImage(enlargedArtwork.image_link, `${enlargedArtwork.title}.jpg`)}
                  className="download-btn"
                >
                  📥 Download
                </button>
                <button onClick={handleCloseEnlarged} className="close-enlarged-btn">
                  ✕ Close
                </button>
              </div>
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
        </div>
      )}
      
      <div className="artwork-grid">
        {visibleArtworks.map((artwork, index) => (
          <ArtworkCard 
            key={artwork.id || index} 
            artwork={artwork} 
            isFavorited={favorites.includes(artwork.id)}
            onToggleFavorite={onToggleFavorite}
            onDownload={downloadImage}
            onClick={() => handleArtworkClick(artwork)} 
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