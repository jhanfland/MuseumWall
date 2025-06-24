import React, { useState, useEffect } from 'react';

const ArtworkCard = ({ artwork, isFavorited, onToggleFavorite, onDownload, onClick }) => {
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

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(artwork.id); // Stores the favorite to the favorites list in local storage
  };

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    onDownload(artwork.image_link, `${artwork.title}.jpg`); // Look at downloadImage in artworkList for implementation
  };

  if (isLoading) {
    return <div className="artwork-card-placeholder">Loading...</div>;
  }

  if (!isValid) {
    return null;
  }

  return (
    <div className="artwork-card clickable" onClick={onClick}>
      <div className="artwork-card-actions">
        <button 
          onClick={handleFavoriteClick}
          className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorited ? '❤️' : '🤍'}
        </button>
        <button 
          onClick={handleDownloadClick}
          className="download-btn"
          title="Download image"
        >
          📥
        </button>
      </div>
      <img src={artwork.image_link} alt={artwork.title} className="artwork-image" />
      <h3>{artwork.title}</h3>
      <p><strong>Artist:</strong> {artwork.artist_title || 'N/A'}</p>
      <p><strong>Origin:</strong> {artwork.place_of_origin || 'N/A'}</p>
      <p><strong>Date:</strong> {artwork.date_start || 'N/A'}</p>
    </div>
  );
};

export default ArtworkCard;