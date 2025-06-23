import React, { useState, useEffect } from 'react';

const ArtworkCard = ({ artwork, onClick, favorites, toggleFavorite }) => {  // Updated: Added favorites and toggleFavorite props
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!artwork.image_link) {
      setIsValid(false);
      setIsLoading(false);
      return;
    }

    const img = new Image();
    img.src = artwork.image_link;

    img.onload = () => {
      setIsValid(true);
      setIsLoading(false);
    };

    img.onerror = () => {
      console.warn(`Invalid image for artwork ID ${artwork.id}: ${artwork.image_link}`);
      setIsValid(false);
      setIsLoading(false);
    };
  }, [artwork.image_link, artwork.id]);

  if (isLoading) {
    return <div className="artwork-card-placeholder">Loading...</div>;
  }

  if (!isValid) {
    return null;
  }
  const handleDownload = () => {
    if (artwork.image_link) {
      const link = document.createElement('a');
      link.href = artwork.image_link;
      link.download = `${artwork.title || 'artwork'}.jpg`;
      link.click();
    }
  };

  return (
    <div className="artwork-card clickable" onClick={onClick}>
      <img src={artwork.image_link} alt={artwork.title} className="artwork-image" />
      <h3>{artwork.title}</h3>
      <p><strong>Artist:</strong> {artwork.artist_title || 'N/A'}</p>
      <p><strong>Origin:</strong> {artwork.place_of_origin || 'N/A'}</p>
      <p><strong>Date:</strong> {artwork.date_start || 'N/A'}</p>
      // New: Favorites heart and download button
      <div className="artwork-card-actions">
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(artwork.id); }}  // Prevent card click from triggering enlarge
          className="favorite-btn"
          aria-label={favorites.includes(artwork.id) ? 'Remove from favorites' : 'Add to favorites'}
        >
          {favorites.includes(artwork.id) ? '❤️' : '♡'}
        </button>
        <button onClick={(e) => { e.stopPropagation(); handleDownload(); }} className="download-btn">
          Download Image
        </button>
      </div>
    </div>
  );
};

export default ArtworkCard;