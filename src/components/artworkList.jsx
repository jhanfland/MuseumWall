import React from 'react';
import { FixedSizeList } from 'react-window';

const Row = ({ index, style, data }) => {
  const artwork = data[index];
  if (!artwork) return <div style={style}></div>;

  return (
    <div style={style} className="artwork-card">
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
  );
};

const ArtworkList = ({ artworks, listHeight, getContainerWidth }) => {
  const ITEM_HEIGHT = 400; // Estimated height for each artwork card

  return (
    <FixedSizeList
      height={listHeight}
      itemCount={artworks.length}
      itemSize={ITEM_HEIGHT}
      width={getContainerWidth()}
      itemData={artworks}
    >
      {Row}
    </FixedSizeList>
  );
};

export default ArtworkList;