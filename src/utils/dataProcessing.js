import Papa from 'papaparse';
import artworkCsv from '../assets/artwork.csv';

export const parseArtworkCsv = async () => {
  return new Promise((resolve, reject) => {
    Papa.parse(artworkCsv, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: async (results) => {
        if (results.errors.length > 0) {
          reject(new Error("Error parsing artwork data from CSV."));
          return;
        }

        const essentialFields = [
          'id',
          'title',
          'main_reference_number',
          'artist_title',
          'place_of_origin',
          'date_start',
          'image_id'
        ];

        const filteredArtworks = results.data
          .filter(row => {
            if (!row || typeof row !== 'object') return false;
            return essentialFields.every(field => {
              const value = row[field];
              if (value === null || value === undefined) return false;
              if (typeof value === 'string') return value.trim() !== '';
              return true;
            });
          });

        const imageCheckPromises = filteredArtworks.map(async (artwork) => {
          const imageLink = artwork.image_id
            ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`
            : null;

          if (imageLink) {
            try {
              const response = await fetch(imageLink, { method: 'HEAD' }); // Use head for efficiency

              if (response.ok) {
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.startsWith('image/')) {
                  return {
                    id: artwork.id,
                    main_reference_number: String(artwork.main_reference_number).trim(),
                    title: artwork.title ? String(artwork.title).trim() : 'N/A',
                    artist_id: artwork.artist_id,
                    artist_title: artwork.artist_title ? String(artwork.artist_title).trim() : 'N/A',
                    place_of_origin: artwork.place_of_origin ? String(artwork.place_of_origin).trim() : 'N/A',
                    date_start: artwork.date_start,
                    image_link: imageLink,
                  };
                } else {
                  console.warn(`URL for artwork ID ${artwork.id} is not an image (Content-Type: ${contentType || 'N/A'}): ${imageLink}`);
                  return null; // Content-Type is not an image -> remove
                }
              } else {
                console.warn(`Broken image link for artwork ID ${artwork.id}: ${imageLink} (Status: ${response.status})`);
                return null; // Image link is broken -> remove
              }
            } catch (error) {
              console.error(`Error checking image link for artwork ID ${artwork.id}: ${imageLink}`, error);
              return null; // Error during fetch -> remove
            }
          } else {
            return null; // No image link -> remove
          }
        });

        const resultsOfImageChecks = await Promise.allSettled(imageCheckPromises);

        const processedArtworks = resultsOfImageChecks
          .filter(result => result.status === 'fulfilled' && result.value !== null)
          .map(result => result.value);

        resolve(processedArtworks);
      },
      error: (error) => {
        reject(new Error("Error downloading or parsing CSV: " + error.message));
      }
    });
  });
};